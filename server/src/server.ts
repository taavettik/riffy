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

async function bootstrap() {
  const db = createDb();

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    authChecker,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    playground: { settings: { 'request.credentials': 'include' } },
    context: (ctx) => {
      return {
        ...ctx.ctx,
        cookies: ctx.ctx.cookies,
        state: {
          tx: db,
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

  app.listen({ port: 80 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    ),
  );
}

bootstrap();
