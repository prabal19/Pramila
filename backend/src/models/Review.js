const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    ref: 'product'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('review', ReviewSchema);