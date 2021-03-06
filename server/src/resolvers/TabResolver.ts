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
import { DeezerService } from '../services/DeezerService';

@ObjectType()
class BaseTab {
  @Field(() => String)
  chords: string;

  @Field()
  trackTitle: string;

  @Field()
  isFavourite: boolean;

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

  @Field()
  transposition: number;

  @Field(() => String, { nullable: true })
  isrc?: string;
}

@ObjectType()
export class ExternalTab extends BaseTab {
  @Field(() => String)
  get id() {
    return this.url;
  }

  @Field()
  url: string;

  @Field()
  trackArtist: string;

  @Field()
  transposition: number;
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
export class TrackSearchResult {
  @Field()
  id: number;

  @Field()
  artist: string;

  @Field()
  title: string;
}

@ObjectType()
export class ArtistSearchResult {
  @Field()
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class TrackInfo {
  @Field()
  id: number;

  @Field()
  artist: string;

  @Field()
  title: string;

  @Field()
  isrc: string;
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

const TabUnion = createUnionType({
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
    private readonly deezer: DeezerService,
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

  @FieldResolver(() => Number)
  async transposition(@Root() tab: Tab, @Ctx() ctx: Context) {
    const data = await this.tabService.getTabTransposition(
      ctx.state.user,
      { id: tab.id },
      ctx.state.tx,
    );
    return data?.transposition ?? 0;
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
    @Ctx() ctx: Context,
  ) {
    const id = await this.tabService.create(
      ctx.state.user,
      {
        title,
        artist,
        chords,
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
  @Query(() => [Tab])
  async searchTabs(@Ctx() ctx: Context, @Arg('query') query: string) {
    return this.tabService.search(ctx.state.user, query, ctx.state.tx);
  }

  @Authorized()
  @Query(() => [ArtistSearchResult])
  async searchArtists(@Arg('query') query: string) {
    return this.deezer.searchArtists(query);
  }

  @Authorized()
  @Query(() => [TrackSearchResult])
  async searchTracks(
    @Arg('title') title: string,
    @Arg('artist', () => String, { nullable: true }) artist: string | undefined,
  ) {
    const data = await this.deezer.search({
      track: title,
      artist,
    });
    return uniqBy(
      data.map((entry) => ({
        ...entry,
        artist: entry.artist.name,
      })),
      (track) => `${track.title} - ${track.artist}`,
    ).slice(0, 10);
  }

  @Authorized()
  @Query(() => TrackInfo)
  async fetchTrackInfo(@Arg('id') id: number) {
    const track = await this.deezer.getTrack(id);
    return {
      ...track,
      artist: track.artist.name,
    };
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
    const transposition = await this.tabService.getTabTransposition(
      ctx.state.user,
      { url },
      ctx.state.tx,
    );
    const isFavourite = await this.tabService.isExternalTabFavourite(
      ctx.state.user,
      url,
      ctx.state.tx,
    );
    return {
      ...tab,
      url,
      transposition: transposition?.transposition ?? 0,
      isFavourite,
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
  @Mutation(() => Tab)
  async setTabTransposition(
    @Arg('id') id: string,
    @Arg('transposition') transposition: number,
    @Ctx() ctx: Context,
  ) {
    await this.tabService.setTabTransposition(
      ctx.state.user,
      { id },
      transposition,
      ctx.state.tx,
    );
    return this.tabService.get(id, ctx.state.tx);
  }

  @Authorized()
  @Mutation(() => ExternalTab)
  async setExternalTabTransposition(
    @Arg('url') url: string,
    @Arg('transposition') transposition: number,
    @Ctx() ctx: Context,
  ) {
    await this.tabService.setTabTransposition(
      ctx.state.user,
      {
        url,
      },
      transposition,
      ctx.state.tx,
    );
    const tab = await this.getUgTab(url, ctx);
    return {
      ...tab,
      url,
    };
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
  @Mutation(() => Tab)
  async markTabFavourite(
    @Arg('id') tabId: string,
    @Arg('target') target: boolean,
    @Ctx() ctx: Context,
  ) {
    return this.tabService.markTabFavourite(
      ctx.state.user,
      tabId,
      target,
      ctx.state.tx,
    );
  }

  @Authorized()
  @Mutation(() => ExternalTab)
  async markExternalTabFavourite(
    @Arg('url') tabUrl: string,
    @Arg('target') target: boolean,
    @Ctx() ctx: Context,
  ) {
    await this.tabService.markExternalTabFavourite(
      ctx.state.user,
      tabUrl,
      target,
      ctx.state.tx,
    );

    return this.getUgTab(tabUrl, ctx);
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
  @Query(() => [TabUnion])
  async favouriteTabs(@Ctx() ctx: Context) {
    const favourites = await this.tabService.getFavouriteTabs(
      ctx.state.user,
      ctx.state.tx,
    );

    const tabs: typeof TabUnion[] = await Promise.all(
      favourites.map(async (tab) => {
        if (tab.id) {
          const data = await this.tabService.get(tab.id, ctx.state.tx);
          return Object.assign(new Tab(), data);
        }
        const data = await this.getUgTab(tab.tabUrl as string, ctx);
        return Object.assign(new ExternalTab(), data);
      }),
    );

    return tabs.sort((a, b) => {
      if (a.trackArtist === b.trackArtist) {
        return a.trackTitle.localeCompare(b.trackTitle);
      }
      if (!a.trackArtist) {
        return -1;
      }
      if (!b.trackArtist) {
        return 1;
      }
      return a.trackArtist.localeCompare(b.trackArtist);
    });
  }

  @Authorized()
  @Query(() => [TabUnion])
  async recentTabs(@Ctx() ctx: Context): Promise<typeof TabUnion[]> {
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
