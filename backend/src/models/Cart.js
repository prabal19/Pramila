const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  size: {
    type: String,
    required: true,
  }
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('cart', CartSchema);
