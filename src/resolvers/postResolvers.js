const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const postResolvers = {
  Query: {
    getPosts: async () => {
      return await Post.find().populate('author').sort({ createdAt: -1 });
    },
    getFeed: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const currentUser = await User.findById(user.id);
      return await Post.find({ author: { $in: currentUser.following } }).populate('author').sort({ createdAt: -1 });
    },
  },
  Mutation: {
    createPost: async (_, { content }, { user }) => {
      console.log('createPost - User from context:', user); // Debug log

      if (!user) throw new AuthenticationError('Not authenticated');
      if (content.trim() === '') throw new UserInputError('Content cannot be empty');

      const post = new Post({ author: user.id, content });
      await post.save();
      console.log('createPost - Post saved:', post); // Debug log
      return await post.populate('author');
    },
    editPost: async (_, { postId, content }, { user }) => {
      console.log('editPost - User from context:', user); // Debug log

      if (!user) throw new AuthenticationError('Not authenticated');
      if (content.trim() === '') throw new UserInputError('Content cannot be empty');

      const post = await Post.findById(postId);
      if (!post) throw new UserInputError('Post not found');
      if (post.author.toString() !== user.id) throw new AuthenticationError('Not authorized');

      post.content = content;
      await post.save();
      console.log('editPost - Post updated:', post); // Debug log
      return await post.populate('author');
    },
    deletePost: async (_, { postId }, { user }) => {
      console.log('deletePost - User from context:', user); // Debug log

      if (!user) throw new AuthenticationError('Not authenticated');

      const post = await Post.findById(postId);
      if (!post) throw new UserInputError('Post not found');
      if (post.author.toString() !== user.id) throw new AuthenticationError('Not authorized');

      await post.remove();
      console.log('deletePost - Post removed:', post); // Debug log
      return true;
    },
    addComment: async (_, { postId, message }, { user }) => {
      console.log('addComment - User from context:', user); // Debug log

      if (!user) throw new AuthenticationError('Not authenticated');
      if (message.trim() === '') throw new UserInputError('Message cannot be empty');

      const post = await Post.findById(postId).populate('author');
      if (!post) throw new UserInputError('Post not found');

      // Create notification
      const notification = new Notification({
        user: post.author.id,
        type: 'COMMENT',
        message: `${user.username} commented on your post: ${message}`,
      });
      await notification.save();
      console.log('addComment - Notification created:', notification); // Debug log

      post.comments.push(notification.id);
      await post.save();
      console.log('addComment - Post updated with comment:', post); // Debug log

      return notification;
    },
  },
  Post: {
    author: async (parent) => {
      return await User.findById(parent.author);
    },
    comments: async (parent) => {
      return await Notification.find({ _id: { $in: parent.comments } }).populate('user');
    },
  },
};

module.exports = postResolvers;
