// models/order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup_date: { type: Date, required: true },
  pickup_time: { type: String, required: true },
  delivery_date: { type: Date, required: true },
  delivery_time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'inProgress', 'completed'], default: 'pending' },
  items: [
    {
      item_name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total_price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
