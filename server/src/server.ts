import { ApolloServer, gql } from 'apollo-server-koa';
import 'reflect-metadata';
import Koa, { DefaultContext } from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import { buildSchema } from 'type-graphql';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
  });

  const server = new ApolloServer({
    schema,
    playground: { settings: { 'request.credentials': 'include' } },
    context: (ctx) => {
      return { ...ctx.ctx, cookies: ctx.ctx.cookies, state: {} };
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
