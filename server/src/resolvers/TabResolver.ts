import { Authorized, Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class Tab {
  @Field(() => String)
  body: string;

  // TODO
}

@Resolver(Tab)
export class TabResolver {
  @Authorized()
  @Query(() => Boolean)
  test() {
    return true;
  }
}
