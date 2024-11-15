const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
// const { JWT_SECRET } ='aryan'

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email },'aryan', { expiresIn: '1d' });
};

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    },
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');
      const user = new User({ username, email, password });
      await user.save();
      const token = generateToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('No user with that email');
      const valid = await user.comparePassword(password);
      if (!valid) throw new Error('Incorrect password');
      const token = generateToken(user);
      return { token, user };
    },
    updateProfile: async (_, { bio, avatar }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const updatedUser = await User.findByIdAndUpdate(user.id, { 'profile.bio': bio, 'profile.avatar': avatar }, { new: true });
      return updatedUser;
    },
    followUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      if (user.id === userId) throw new Error('Cannot follow yourself');
      const currentUser = await User.findById(user.id);
      const userToFollow = await User.findById(userId);
      if (!userToFollow) throw new Error('User not found');
      if (currentUser.following.includes(userId)) throw new Error('Already following');
      currentUser.following.push(userId);
      userToFollow.followers.push(user.id);
      await currentUser.save();
      await userToFollow.save();

      // Create notification
      const notification = new Notification({
        user: userId,
        type: 'FOLLOW',
        message: `${currentUser.username} started following you.`,
      });
      await notification.save();

      return userToFollow;
    },
    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.id);
      const userToUnfollow = await User.findById(userId);
      if (!userToUnfollow) throw new Error('User not found');
      if (!currentUser.following.includes(userId)) throw new Error('Not following');
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== user.id);
      await currentUser.save();
      await userToUnfollow.save();
      return userToUnfollow;
    },
  },
  User: {
    followers: async (parent) => {
      return await User.find({ _id: { $in: parent.followers } });
    },
    following: async (parent) => {
      return await User.find({ _id: { $in: parent.following } });
    },
    profile: (parent) => parent.profile,
  },
};

module.exports = userResolvers;
