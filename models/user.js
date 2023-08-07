const mongoose = require('mongoose');
const { roles } = require('../enum');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: Number, enum: Object.values(roles), default: roles.USER },
  location: {
    type: {
      type: String,
      enum: ['Point'], // You can specify other GeoJSON types if needed
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default to [0, 0] if no coordinates are provided
    },
  },
  created_at: { type: Date, default: Date.now },
});

// Create a 2dsphere index on the location field for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
