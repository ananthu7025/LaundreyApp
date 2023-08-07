// controllers/deliveryBoy.js
const RequestedOrder = require('../models/requestedOrder');
const Notification = require('../models/notification');

exports.deliveryBoyRespond = async (req, res) => {
  try {
    const orderRequestId = req.params.orderRequestId;
    const response = req.body.status; // 'accepted' or 'rejected'

    const requestedOrder = await RequestedOrder.findById(orderRequestId);
    if (!requestedOrder) {
      return res.status(404).json({ message: 'Requested order not found.' });
    }

    // Update the requested order's status based on the response
    requestedOrder.status = response;
    await requestedOrder.save();

    // Send notification to the user based on the response
    let notificationMessage;
    if (response === 'accepted') {
      notificationMessage = 'Your order has been accepted.';
    } else if (response === 'rejected') {
      notificationMessage = 'Your order has been rejected.';
    }

    const newNotification = new Notification({
      user_id: requestedOrder.user_id,
      message: notificationMessage,
    });
    await newNotification.save();

    res.status(200).json({ message: 'Response recorded.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while recording response.' });
  }
};
