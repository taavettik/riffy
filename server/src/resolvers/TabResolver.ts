import { Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class Tab {
  @Field(() => String)
  body: string;

  // TODO
}

@Resolver(Tab)
export class TabResolver {
  @Query(() => Boolean)
  test() {
    return true;
  }
}
