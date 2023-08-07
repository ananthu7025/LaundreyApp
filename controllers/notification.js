
// controllers/notification.js

const { roles } = require('../enum');
const Notification = require('../models/notification');
const User = require('../models/user');

exports.sendNotificationsToDeliveryBoys = async (req, res) => {
  try {
    // Fetch all active delivery boys
    const deliveryBoys = await User.find({ role: roles.DELIVERY_BOY});

    // Create notifications for each delivery boy
    const notificationMessage = 'New order available. Please check your orders.';
    const notificationPromises = deliveryBoys.map(async (deliveryBoy) => {
      const newNotification = new Notification({
        user_id: deliveryBoy._id,
        message: notificationMessage,
      });
      return newNotification.save();
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ message: 'Notifications sent to delivery boys.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending notifications.' });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ user_id: userId }).sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching notifications.' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.is_read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while marking notification as read.' });
  }
};
