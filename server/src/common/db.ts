import pgp from 'pg-promise';
import { config } from './config';

export function createDb() {
  const pg = pgp();
  const db = pg({
    host: config.DB_HOST,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  });
  return db;
}

export type Db = ReturnType<typeof createDb>;
