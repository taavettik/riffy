import { createClient, RedisClient } from 'redis';
import { config } from './config';

export class PromiseRedisClient {
  constructor(public readonly redis: RedisClient) {}

  private promisify<T>(
    method: (cb: (err: Error | null, reply: T) => void) => void,
  ) {
    return new Promise<T>((resolve, reject) => {
      method((err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  get(key: string) {
    return this.promisify<string | null>((cb) => this.redis.get(key, cb));
  }

  set(key: string, value: string) {
    return this.promisify<'OK'>((cb) => this.redis.set(key, value, cb));
  }

  expire(key: string, seconds: number) {
    return this.promisify<number>((cb) => this.redis.expire(key, seconds, cb));
  }
}

export function createRedisClient() {
  return createClient({
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
  });
}
