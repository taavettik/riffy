import { Context } from 'koa';
import {
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { ArtistService } from '../services/ArtistService';
import { Tab } from './TabResolver';

@ObjectType()
export class Artist {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Tab])
  tabs: Tab[];
}

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(private readonly artistService: ArtistService) {}

  @FieldResolver(() => [Tab])
  async tabs(@Root() artist: Artist, @Ctx() ctx: Context) {
    return this.artistService.getTabsByArtist(
      ctx.state.user,
      artist.id,
      ctx.state.tx,
    );
  }

  @Authorized()
  @Query(() => [Artist])
  async getArtists(@Ctx() ctx: Context) {
    const artists = await this.artistService.getArtists(
      ctx.state.user,
      ctx.state.tx,
    );
    return artists.map((artist) => ({
      id: artist.artistId,
      name: artist.artistName,
    }));
  }
}
