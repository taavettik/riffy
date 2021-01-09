import { RedisClient } from 'redis';
import { Db } from './common/db';
import { PromiseRedisClient } from './common/redis';

declare module 'koa' {
  interface DefaultContext {
    state: {
      tx: Db;
      user: string;
      redis: PromiseRedisClient;
    };
  }
}
