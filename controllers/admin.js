// controllers/admin.js
const { roles } = require('../enum');
const User = require('../models/user');

exports.addDeliveryBoy = async (req, res) => {
  try {
    const { username, email, password, phone,location } = req.body;

    const newDeliveryBoy = new User({
      username,
      email,
      password,
      phone,
      role: roles.DELIVERY_BOY,
      location:location
    });

    await newDeliveryBoy.save();

    res.status(201).json({ message: 'Delivery boy added successfully.',newDeliveryBoy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding delivery boy.' });
  }
};
