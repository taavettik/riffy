import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { TabResolver } from './resolvers/TabResolver';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
  });
  const server = new ApolloServer({
    schema,
    playground: true,
  });
  const { url } = await server.listen(80);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

console.log('start bootstrap');
bootstrap();
