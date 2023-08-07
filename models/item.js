// models/item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item_name: String,
  price: Number,
});

module.exports = mongoose.model('Item', itemSchema);
