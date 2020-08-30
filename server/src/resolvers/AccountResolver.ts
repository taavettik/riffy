import { ValidationContext } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { Context, DefaultContext } from 'koa';
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
import { config } from '../common/config';

@ObjectType()
export class Account {
  @Field()
  id: string;

  @Field()
  name: string;
}

@Resolver()
export class AccountResolver {
  @Query(() => String)
  login(
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    const existingToken = ctx.cookies.get('auth');

    try {
      if (
        existingToken &&
        jwt.verify(existingToken, config.JWT_SECRET, { algorithms: ['HS512'] })
      ) {
        return true;
      }
    } catch {
      //
    }

    const token = jwt.sign(
      {
        name,
      },
      config.JWT_SECRET,
      {
        algorithm: 'HS512',
      },
    );
    ctx.cookies.set('auth', token);
    return true;
  }
}
