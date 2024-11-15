const Notification = require('../models/Notification');

const notificationResolvers = {
  Query: {
    getNotifications: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Notification.find({ user: user.id }).sort({ createdAt: -1 });
    },
  },
  Mutation: {
    markNotificationAsRead: async (_, { notificationId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const notification = await Notification.findById(notificationId);
      if (!notification) throw new Error('Notification not found');
      if (notification.user.toString() !== user.id) throw new Error('Not authorized');
      notification.isRead = true;
      await notification.save();
      return notification;
    },
  },
  Notification: {
    user: async (parent) => {
      return await User.findById(parent.user);
    },
  },
};

module.exports = notificationResolvers;
