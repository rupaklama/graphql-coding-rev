import axios from 'axios';
import { GraphQLServer } from 'graphql-yoga';

const db = 'http://localhost:3004';

// Scalar types are default Data types
// !  - is required & the 'return value' is NOT to be NULL
// []! - required & the whole thing must be NON-NULLABLE, NOT NULL
const typeDefs = `
  type Query {
    agent(id: ID!): User!
    agents(name: String, age: Int): [User!]!
    posts: [Post!]!
    post(id: ID!): Post! 

    cars: [String!]!
    msg(values: [String!]!): String
    multiply(value: Int!): Int
  }

  type User {
    id: ID!
    name: String!
    age: Int
    married: Boolean
    average: Float
  }

  type Post {
    id: ID!
    title: String
    content: String
    author: User!
  }
`;

const resolvers = {
  Query: {
    // NOTE - Resolvers Function has a default args - parent, args, context, info

    agent: async (parent, args, context, info) => {
      // NOTE - The resolve function works also by returning a Promise - async fashion making request to outside server
      const response = await axios.get(`${db}/users/${args.id}`);
      return response.data;
    },
    agents: async (parent, args, context, info) => {
      // making 'args' OPTIONAL here which always return response object
      const name = args.name != null ? `name=${args.name}` : '';
      const age = args.age != null ? `age=${args.age}` : '';

      const response = await axios.get(`${db}/users?${name}&${age}`);
      return response.data;
    },

    posts: async (parent, args, context, info) => {
      const response = await axios.get(`${db}/posts`);
      return response.data;
    },

    post: async (parent, args, context, info) => {
      const response = await axios.get(`${db}/posts/${args.id}`);
      return response.data;
    },

    multiply: async (parent, args, context, info) => {
      return args.value * 10;
    },
    cars: () => {
      return ['Ford', null, 'Honda'];
    },

    msg: (parent, args, context, info) => {
      if (args.values.length === 0) return 'Sorry, no values';
      return `Hello ${args.values[0]} ${args.values[1]}`;
    },
  },

  // New Resolver Object Type for Relationship
  // Relationship between two Schema Types From Post to User
  Post: {
    // 'parentValue' is the Parent Data table - 'Post'
    author: async (parent, args, context, info) => {
      const response = await axios.get(`${db}/users/${parent.author}`);
      return response.data;
    },
  },
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
