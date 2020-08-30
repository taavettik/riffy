import { ApolloServer, gql } from 'apollo-server-koa';
import 'reflect-metadata';
import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import { buildSchema } from 'type-graphql';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
  });

  const server = new ApolloServer({ schema, playground: true });
  const app = new Koa();
  server.applyMiddleware({ app, path: '/server/' });

  app.listen({ port: 80 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    ),
  );
}

bootstrap();
