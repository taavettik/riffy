import { Db } from './common/db';

declare module 'koa' {
  interface DefaultContext {
    state: {
      tx: Db;
      user: string;
    };
  }
}
