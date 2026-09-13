const notificationsService = require('../services/notifications.service');

const getMyNotifications = async (req, res) => {
  try {
    const onlyUnread = req.query.unread === 'true';
    const notifications = await notificationsService.getUserNotifications(req.user.id, onlyUnread);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationsService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationsService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: 'تم تحديد كل الإشعارات كمقروءة' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationsService.deleteNotification(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'تم حذف الإشعار' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
