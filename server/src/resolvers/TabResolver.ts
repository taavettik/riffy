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
import { TabService } from '../services/TabService';

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

@ArgsType()
export class TabSearchCriteria {
  @Field(() => String, { nullable: true })
  accountId: string | undefined;

  @Field(() => String, { nullable: true })
  trackTitle: string | undefined;
}

@Resolver(Tab)
export class TabResolver {
  constructor(private readonly tabService: TabService) {}

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
  async searchTabs(@Args() criteria: TabSearchCriteria, @Ctx() ctx: Context) {
    return this.tabService.search(criteria, ctx.state.tx);
  }

  @Authorized()
  @Query(() => Boolean)
  test(@Ctx() ctx: Context) {
    return true;
  }
}
