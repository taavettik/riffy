import * as jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { AuthChecker } from 'type-graphql';
import { config } from './config';

export const authChecker: AuthChecker<Context> = ({ context }) => {
  const authToken = context.cookies.get('auth');
  try {
    const valid =
      authToken &&
      jwt.verify(authToken, config.JWT_SECRET, {
        algorithms: ['HS512'],
      });
    return Boolean(valid);
  } catch {
    return false;
  }
};
