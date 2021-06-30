import { GraphQLServer } from 'graphql-yoga';

import { Query, Mutation, Post, User, Picture } from './graphql/resolvers/index';

const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Picture,
};

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on localhost:4000'));
