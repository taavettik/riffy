import { ApolloServer, gql } from 'apollo-server-koa';
import 'reflect-metadata';
import Koa, { DefaultContext } from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import { buildSchema } from 'type-graphql';
import { authChecker } from './common/auth';
import pgp from 'pg-promise';
import Container from 'typedi';
import { config } from './common/config';
import { createDb } from './common/db';
import { decode } from 'jsonwebtoken';
import { createRedisClient, PromiseRedisClient } from './common/redis';

async function bootstrap() {
  const db = createDb();

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    authChecker,
    container: Container,
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
    playground: { settings: { 'request.credentials': 'include' } },
    context: (ctx) => {
      const authCookie = ctx.ctx.cookies.get('auth');
      const user = authCookie ? (decode(authCookie) as any) : undefined;

      return {
        ...ctx.ctx,
        cookies: ctx.ctx.cookies,
        state: {
          tx: db,
          user: user?.id,
          redis: new PromiseRedisClient(createRedisClient()),
        },
      };
    },
  });
  const app = new Koa();
  app.use(async (ctx, next) => {
    //console.log(ctx.cookies);
    await next();
  });
  server.applyMiddleware({ app, path: '/server/' });

  app.listen({ port: config.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${config.PORT}${server.graphqlPath}`,
    ),
  );
}

bootstrap();
