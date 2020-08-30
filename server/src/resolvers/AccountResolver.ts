import { ValidationContext } from 'graphql';
import * as jwt from 'jsonwebtoken';
import {
  Arg,
  Ctx,
  Field,
  MiddlewareFn,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';

@ObjectType()
export class Account {
  @Field()
  id: string;

  @Field()
  name: string;
}

const AuthenticationMiddleware: MiddlewareFn = async (req, next) => {
  const result = await next();
  console.log(result);
  return true;
};

@Resolver()
export class AccountResolver {
  @Query(() => String)
  @UseMiddleware(AuthenticationMiddleware)
  login(
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() ctx: any,
  ) {
    console.log(ctx);
    const token = jwt.sign(
      {
        name,
      },
      'secret',
      {
        algorithm: 'HS512',
      },
    );
    console.log(ctx);
    return token;
  }
}
