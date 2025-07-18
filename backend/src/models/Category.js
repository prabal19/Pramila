const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  parent: {
    type: String,
    required: true,
    enum: ['collection', 'accessory'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('category', CategorySchema);
