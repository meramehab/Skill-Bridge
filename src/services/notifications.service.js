const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type, relatedId }) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type: type || 'info',
    relatedId: relatedId || null,
  });
};

const getUserNotifications = async (userId, onlyUnread = false) => {
  const query = { user: userId };
  if (onlyUnread) query.isRead = false;

  return Notification.find(query).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    const error = new Error('الإشعار مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return { success: true };
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notification) {
    const error = new Error('الإشعار مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return notification;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
