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
import { authChecker } from '../common/auth';
import { config } from '../common/config';
import { AccountService } from '../services/AccountService';

@ObjectType()
export class Account {
  @Field()
  id: string;

  @Field()
  name: string;
}

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => String)
  async login(
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    if (authChecker({ context: ctx } as any, [])) {
      return true;
    }

    const account = await this.accountService.getByName(name, ctx.state.tx);
    if (!account) {
      return false;
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
