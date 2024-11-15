const userResolvers = require('./userResolvers');
const postResolvers = require('./postResolvers');
const notificationResolvers = require('./notificationResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Post: {
    ...postResolvers.Post,
  },
  Notification: {
    ...notificationResolvers.Notification,
  },
};

module.exports = resolvers;
