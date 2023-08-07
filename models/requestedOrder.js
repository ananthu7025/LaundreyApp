// models/requestedOrder.js
const mongoose = require('mongoose');

const requestedOrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['accepted', 'rejected'], default: 'accepted' },
});

module.exports = mongoose.model('RequestedOrder', requestedOrderSchema);
