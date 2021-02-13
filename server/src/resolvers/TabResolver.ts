import { Context } from 'koa';
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  createUnionType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { MBService } from '../services/MBService';
import { TabService } from '../services/TabService';
import { uniqBy } from 'lodash';
import { UGService } from '../services/UGService';
import { ArtistService, formatArtistId } from '../services/ArtistService';
import { Artist } from './ArtistResolver';

@ObjectType()
class BaseTab {
  @Field(() => String)
  chords: string;

  @Field()
  trackTitle: string;

  trackArtist: string | null;
}

@ObjectType()
export class Tab extends BaseTab {
  @Field(() => String)
  id: string;

  @Field(() => Artist, { nullable: true })
  artist: Artist;

  accountId: string;

  get artistId() {
    return this.trackArtist ? formatArtistId(this.trackArtist) : null;
  }
}

@ObjectType()
export class ExternalTab extends BaseTab {
  @Field()
  url: string;

  @Field()
  trackArtist: string;
}

@ObjectType()
export class MBArtist {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class MBTrack {
  @Field()
  id: string;

  @Field({ nullable: true })
  artist?: MBArtist;

  @Field()
  name: string;
}

@ObjectType()
export class UgSearchResult {
  @Field()
  trackTitle: string;

  @Field()
  trackArtist: string;

  @Field()
  url: string;

  @Field()
  votes: number;

  @Field()
  rating: number;

  @Field()
  version: number;
}

const RecentTab = createUnionType({
  name: 'RecentTab',
  types: () => [ExternalTab, Tab],
});

@InputType()
class TabData {
  @Field()
  trackArtist: string;

  @Field()
  trackTitle: string;

  @Field()
  chords: string;
}

@Resolver(Tab)
export class TabResolver {
  constructor(
    private readonly tabService: TabService,
    private readonly artistService: ArtistService,
    private readonly mb: MBService,
    private readonly ug: UGService,
  ) {}

  @FieldResolver(() => Artist)
  async artist(@Root() tab: Tab, @Ctx() ctx: Context) {
    if (!tab.artistId) {
      return null;
    }
    return this.artistService.getArtist(
      ctx.state.user,
      tab.artistId,
      ctx.state.tx,
    );
  }

  @Authorized()
  @Mutation(() => [Tab])
  async createTabs(
    @Arg('tabs', () => [TabData]) tabs: TabData[],
    @Ctx() ctx: Context,
  ) {
    const ids = await Promise.all(
      tabs.map((tab) =>
        this.tabService.create(
          ctx.state.user,
          {
            title: tab.trackTitle,
            artist: tab.trackArtist,
            chords: tab.chords,
            mbTrackId: undefined,
            mbArtistId: undefined,
          },
          ctx.state.tx,
        ),
      ),
    );

    const result = await Promise.all(
      ids.map((id) => this.tabService.get(id, ctx.state.tx)),
    );
    return result;
  }

  @Authorized()
  @Mutation(() => Tab)
  async createTab(
    @Arg('title') title: string,
    @Arg('chords') chords: string,
    @Arg('artist') artist: string,
    @Arg('mbId', () => String, { nullable: true }) mbId: string | undefined,
    @Arg('mbArtistId', () => String, { nullable: true })
    mbArtistId: string | undefined,
    @Ctx() ctx: Context,
  ) {
    const mbArtist = mbArtistId
      ? await this.mb.getEntity('artist', mbArtistId)
      : undefined;
    const mbTrack = mbId
      ? await this.mb.getEntity('recording', mbId)
      : undefined;
    const id = await this.tabService.create(
      ctx.state.user,
      {
        title: mbTrack?.title ? mbTrack.title : title,
        artist: mbArtist?.name ? mbArtist.name : artist,
        chords,
        mbTrackId: mbId,
        mbArtistId: mbArtist?.id,
      },
      ctx.state.tx,
    );
    const tab = await this.tabService.get(id, ctx.state.tx);
    return tab;
  }

  @Authorized()
  @Mutation(() => Tab)
  async editTab(
    @Arg('id') id: string,
    @Arg('chords') chords: string,
    @Ctx() ctx: Context,
  ) {
    return this.tabService.edit(id, ctx.state.user, { chords }, ctx.state.tx);
  }

  @Authorized()
  @Query(() => Tab)
  async getTab(@Arg('id') id: string, @Ctx() ctx: Context) {
    return this.tabService.get(id, ctx.state.tx);
  }

  @Authorized()
  @Query(() => [Tab])
  async getTabs(@Ctx() ctx: Context) {
    return this.tabService.getByAccount(ctx.state.user, ctx.state.tx);
  }

  @Authorized()
  @Query(() => [MBArtist])
  async searchArtists(@Arg('query') query: string) {
    const data = await this.mb.search('artist', query);
    return data.artists.filter((result) => Number(result.score) > 80);
  }

  @Authorized()
  @Query(() => [MBTrack])
  async searchTracks(@Arg('query') query: string) {
    const data = await this.mb.search('recording', query);
    const formatted = data.recordings.map((r) => ({
      id: r.id,
      name: r.title,
      artist: r['artist-credit'][0]?.artist,
    }));
    return uniqBy(formatted, (entry) => entry.id);
  }

  @Authorized()
  @Query(() => [Tab])
  async getConflictingTabs(
    @Arg('artist') artist: string,
    @Arg('title') title: string,
    @Ctx() ctx: Context,
  ) {
    const conflictingTabs = await this.tabService.getConflicts(
      ctx.state.user,
      artist,
      title,
      ctx.state.tx,
    );
    return conflictingTabs;
  }

  @Authorized()
  @Query(() => ExternalTab, { nullable: true })
  async getUgTab(@Arg('url') url: string, @Ctx() ctx: Context) {
    const tab = await this.ug.getTab(url, ctx.state.redis);
    return {
      ...tab,
      url,
    };
  }

  @Authorized()
  @Query(() => [UgSearchResult])
  async searchUgTabs(@Arg('query') query: string, @Ctx() ctx: Context) {
    const results = await this.ug.search(query);
    return results.map((r) => ({
      ...r,
      chords: '',
    }));
  }

  @Authorized()
  @Mutation(() => Boolean)
  async addRecentTab(@Arg('id') tabId: string, @Ctx() ctx: Context) {
    await this.tabService.addRecent(
      ctx.state.user,
      { id: tabId },
      ctx.state.tx,
    );
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async addRecentExternalTab(@Arg('url') tabUrl: string, @Ctx() ctx: Context) {
    await this.tabService.addRecent(
      ctx.state.user,
      { url: tabUrl },
      ctx.state.tx,
    );
    return true;
  }

  @Authorized()
  @Mutation(() => Artist)
  async deleteTab(@Arg('id') id: string, @Ctx() ctx: Context) {
    const tab = await this.tabService.get(id, ctx.state.tx);
    const artist = await this.artistService.getArtist(
      ctx.state.user,
      formatArtistId(tab.trackArtist || ''),
      ctx.state.tx,
    );
    await this.tabService.delete(id, ctx.state.user, ctx.state.tx);
    return artist;
  }

  @Authorized()
  @Query(() => [RecentTab])
  async recentTabs(@Ctx() ctx: Context): Promise<typeof RecentTab[]> {
    const tabs = await this.tabService.getRecentTabs(
      ctx.state.user,
      ctx.state.tx,
    );

    const resolvedTabs = await Promise.all(
      tabs.map(async (tab) => {
        if (tab.tabId) {
          const obj = await this.tabService.get(tab.tabId, ctx.state.tx);
          return Object.assign(new Tab(), obj);
        }
        if (!tab.tabUrl) {
          return;
        }
        try {
          const ugTab = await this.ug.getTab(tab.tabUrl, ctx.state.redis);
          return Object.assign(new ExternalTab(), {
            ...ugTab,
            url: tab.tabUrl,
          });
        } catch {
          return;
        }
      }),
    );

    return resolvedTabs.filter(Boolean);
  }
}
