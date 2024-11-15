const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profile: Profile
    followers: [User]
    following: [User]
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    bio: String
    avatar: String
  }

  type Post {
    id: ID!
    author: User!
    content: String!
    comments: [Notification]
    createdAt: String!
    updatedAt: String!
  }

  type Notification {
    id: ID!
    user: User!
    type: String!
    message: String
    isRead: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    getUser(id: ID!): User
    getPosts: [Post]
    getFeed: [Post]
    getNotifications: [Notification]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(bio: String, avatar: String): User
    followUser(userId: ID!): User
    unfollowUser(userId: ID!): User
    createPost(content: String!): Post
    editPost(postId: ID!, content: String!): Post
    deletePost(postId: ID!): Boolean
    addComment(postId: ID!, message: String!): Notification
    markNotificationAsRead(notificationId: ID!): Notification
  }
`;

module.exports = typeDefs;
