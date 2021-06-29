import axios from 'axios';

const db = 'http://localhost:3004';

const Query = {
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

  pictures: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/pictures`);
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
};

// New Resolver Object Types for Relationships

// Relationship between two Schema Types From Post to User & Post to Picture
const Post = {
  // 'parentValue' is the Parent Data table - 'Post'
  author: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/users/${parent.author}`);
    return response.data;
  },
  picture: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/pictures/${parent.picture}`);
    return response.data;
  },
};

const User = {
  posts: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/posts?author=${parent.id}`);
    return response.data;
  },
  pictures: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/pictures?author=${parent.id}`);
    return response.data;
  },
};

const Picture = {
  author: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/users/${parent.author}`);
    return response.data;
  },
  post: async (parent, args, context, info) => {
    const response = await axios.get(`${db}/posts/${parent.post}`);
    return response.data;
  },
};

export { Query, Post, User, Picture };
