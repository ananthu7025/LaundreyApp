// routes/notification.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification');

router.get('/user/:userId', NotificationController.getUserNotifications);
router.put('/:notificationId/mark-read', NotificationController.markNotificationAsRead);
router.post('/send-to-delivery-boys', NotificationController.sendNotificationsToDeliveryBoys);

module.exports = router;




