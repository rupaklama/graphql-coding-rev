import axios from 'axios';

const db = 'http://localhost:3004';

// Query Resolvers
// This is to resolve all the 'type Query' in our Schema file
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

// we also need to match the MUTATION Structure Schema also
// Mutation is a function that returns the value
const Mutation = {
  createAgent: async (parent, args, context, info) => {
    const response = await axios.post(`${db}/users`, {
      // data - Input types
      name: args.data.name,
      age: args.data.age,
      married: args.data.married,
      average: 0,
      status: args.data.status,
    });
    return response.data;
  },

  createPost: async (parent, args, context, info) => {
    const response = await axios.post(`${db}/posts`, {
      title: args.title,
      content: args.content,
      // additional fields with hard coding values
      author: 1,
      picture: 1,
      status: args.status,
    });
    return response.data;
  },

  deletePost: async (parent, args, context, info) => {
    const response = await axios.delete(`${db}/posts/${args.id}`);
    // console.log(response);

    // if no keys
    if (Object.keys(response.data).length === 0) {
      return true;
    }
    return false;
  },

  deleteAgent: async (parent, args, context, info) => {
    const response = await axios.delete(`${db}/users/${args.id}`);

    // find all posts related to user & delete them
    // find all pictures - delete them
    // NOTE - To keep NON-NULLABLE options & to avoid Errors

    if (Object.keys(response.data).length === 0) {
      return true;
    }
    return false;
  },

  updateAgent: async (parent, args, context, info) => {
    let data = {};

    // if defined, put values in our new object above
    if (args.data.name !== undefined) {
      data.name = args.data.name;
    }
    if (args.data.age !== undefined) {
      data.age = args.data.age;
    }
    if (args.data.married !== undefined) {
      data.married = args.data.married;
    }
    if (args.data.average !== undefined) {
      data.average = args.data.average;
    }
    if (args.data.status !== undefined) {
      data.status = args.data.status;
    }

    const response = await axios.patch(`${db}/users/${args.id}`, data);
    return response.data;
  },
};

// New Resolver Object Types for Relationships

// Relationship between two Schema Types From Post to User & Post to Picture
const Post = {
  // 'parentValue' is the Parent Data table - 'Post'
  author: async (parent, args, context, info) => {
    try {
      const response = await axios.get(`${db}/users/${parent.author}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
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

export { Query, Mutation, Post, User, Picture };
