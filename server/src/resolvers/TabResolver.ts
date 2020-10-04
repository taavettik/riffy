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
export class Track {
  @Field({ nullable: true })
  artist?: string;

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
    @Arg('trackTitle') trackTitle: string,
    @Arg('chords') chords: string,
    @Ctx() ctx: Context,
  ) {
    const id = await this.tabService.create(
      ctx.state.user,
      trackTitle,
      chords,
      ctx.state.tx,
    );
    console.log(id);
    const tab = await this.tabService.get(id, ctx.state.tx);
    console.log(tab);
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
  @Query(() => [String])
  async searchArtists(@Arg('query') query: string) {
    const data = await this.mb.search('artist', query);
    return data.artists
      .filter((result) => Number(result.score) > 80)
      .map((artist) => artist.name);
  }

  @Authorized()
  @Query(() => [Track])
  async searchTracks(@Arg('query') query: string) {
    const data = await this.mb.search('recording', query);
    const formatted = data.recordings.map((r) => ({
      name: r.title,
      artist: r['artist-credit'][0]?.name,
    }));
    return uniqBy(formatted, (entry) => `${entry.name}, ${entry.artist}`);
  }
}
