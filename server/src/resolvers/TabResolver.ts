import { Context } from 'koa';
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
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

@ObjectType()
export class Tab {
  @Field(() => String)
  chords: string;

  @Field(() => String)
  id: string;

  @Field()
  trackTitle: string;

  @Field(() => String, { nullable: true })
  trackArtist: string | null;

  accountId: string;
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

@Resolver(Tab)
export class TabResolver {
  constructor(
    private readonly tabService: TabService,
    private readonly mb: MBService,
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
    const id = await this.tabService.create(
      ctx.state.user,
      {
        title,
        artist,
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
}
