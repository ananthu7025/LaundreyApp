
// controllers/order.js
const Order = require('../models/order');
const Item = require('../models/item');
const User = require('../models/user');
const Notification = require('../models/notification');
const { roles } = require('../enum');
const RequestedOrder = require('../models/requestedOrder');
const geolib = require('geolib'); // Import the geolib library for distance calculations

const calculateTotalPrice = async (items) => {
  let total = 0;
  for (const item of items) {
    const dbItem = await Item.findOne({ name: item.item_name });
    if (dbItem) {
      total += dbItem.price * item.quantity;
    }
  }
  return total;
};

exports.createOrder = async (req, res) => {
  try {
    const { user_id, pickup_date, pickup_time, delivery_date, delivery_time, items } = req.body;

    const total_price = await calculateTotalPrice(items);

    const order = new Order({
      user_id,
      pickup_date,
      pickup_time,
      delivery_date,
      delivery_time,
      status: 'pending',
      items,
      total_price,
    });

    const newOrder = await order.save();
    const notificationMessage = 'Your order has been placed successfully.';
    const newNotification = new Notification({
      user_id: user_id, // User who placed the order
      message: notificationMessage,
    });
    await newNotification.save();

    res.status(201).json({ message: 'Order created successfully.', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating order.' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching order.' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching orders.' });
  }
};

exports.createRequestedOrder = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Fetch the user's location
    const user = await User.findById(user_id);
    const userLocation = user.location.coordinates; // Assuming the location is stored as [latitude, longitude]

    const requestedOrder = new RequestedOrder({
      user_id,
    });

    const newRequestedOrder = await requestedOrder.save();

    // Notify only delivery boys within 10 kilometers of the user's location
    const deliveryBoys = await User.find({ role: roles.DELIVERY_BOY });

    const notificationMessage = `New order requested. Order ID for user ${user_id}: ${newRequestedOrder._id}`;

    // Filter delivery boys within 10 kilometers
    const nearbyDeliveryBoys = deliveryBoys.filter((deliveryBoy) => {
      // Calculate the distance between user and delivery boy
      const distance = geolib.getDistance(userLocation, deliveryBoy?.location?.coordinates);
      return distance <= 10000; // 10 kilometers in meters
    });

    if (nearbyDeliveryBoys.length === 0) {
      return res.status(404).json({ message: 'No nearby delivery boys found.' });
    }

    const notificationPromises = nearbyDeliveryBoys.map(async (deliveryBoy) => {
      const newNotification = new Notification({
        user_id: deliveryBoy._id,
        message: notificationMessage,
      });
      await newNotification.save();
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      message: 'Order request created successfully.',
      user_id: user_id,
      order_id: newRequestedOrder._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating order request.' });
  }
};






