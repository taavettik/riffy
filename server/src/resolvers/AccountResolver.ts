import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Context, DefaultContext } from 'koa';
import {
  Arg,
  Authorized,
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

  passwordHash: string;
}

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Boolean)
  async login(
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    const account = await this.accountService.getByName(name, ctx.state.tx);

    if (!account) {
      return false;
    }

    const passwordValid = await bcrypt.compare(password, account.passwordHash);
    if (!passwordValid) {
      return false;
    }

    if (authChecker({ context: ctx } as any, [])) {
      return true;
    }

    const token = jwt.sign(
      {
        id: account.id,
      },
      config.JWT_SECRET,
      {
        algorithm: 'HS512',
      },
    );
    ctx.cookies.set('auth', token);
    return true;
  }

  @Authorized()
  @Query(() => Account)
  currentAccount(@Ctx() ctx: Context) {
    return this.accountService.get(ctx.state.user, ctx.state.tx);
  }
}
