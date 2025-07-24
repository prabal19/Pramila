const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  strikeoutPrice: {
    type: Number,
  },
  images: {
    type: [String],
    required: true,
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: [String],
    default: [],
  },
  specifications: {
    type: String,
  },
    washInstructions: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true, // This will add createdAt and updatedAt fields
});

module.exports = mongoose.model('product', ProductSchema);
