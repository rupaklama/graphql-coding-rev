import { GraphQLServer } from 'graphql-yoga';

import { Query, Post, User, Picture } from './graphql/resolvers/index';

const resolvers = {
  Query,
  Post,
  User,
  Picture,
};

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on localhost:4000'));
