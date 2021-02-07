export const config = {
  PROJECT_ENV: process.env.PROJECT_ENV || 'local',
  REDIS_HOST: process.env.REDIS_HOST || 'riffy-redis',
  REDIS_PORT: 6379,
  JWT_SECRET:
    '187E43CF8997D3BB55B883176DF42744F74CF53B3877106C9AD38F5B46B60AFF',
  DB_HOST: process.env.DB_HOST || 'riffy-database',
  DB_NAME: process.env.DB_NAME || 'riffy',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'sogood',
  PORT: process.env.PORT,
};
