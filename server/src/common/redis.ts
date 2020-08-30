import { createClient } from 'redis';
import { config } from './config';

export function createRedisClient() {
  return createClient({
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
  });
}
