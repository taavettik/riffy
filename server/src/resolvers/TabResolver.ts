import { Context } from 'koa';
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  createUnionType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { MBService } from '../services/MBService';
import { TabService } from '../services/TabService';
import { uniqBy } from 'lodash';
import { UGService } from '../services/UGService';

@ObjectType()
class BaseTab {
  @Field(() => String)
  chords: string;

  @Field()
  trackTitle: string;

  @Field(() => String, { nullable: true })
  trackArtist: string | null;
}

@ObjectType()
export class Tab extends BaseTab {
  @Field(() => String)
  id: string;

  accountId: string;
}

@ObjectType()
export class ExternalTab extends BaseTab {
  @Field()
  url: string;
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
  version: number;
}

const RecentTab = createUnionType({
  name: 'RecentTab',
  types: () => [ExternalTab, Tab],
});

@Resolver(Tab)
export class TabResolver {
  constructor(
    private readonly tabService: TabService,
    private readonly mb: MBService,
    private readonly ug: UGService,
  ) {}

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
