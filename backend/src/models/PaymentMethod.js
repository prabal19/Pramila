const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  methodType: {
    type: String,
    enum: ['card'],
    default: 'card',
    required: true,
  },
  cardLast4: {
    type: String,
    required: true,
  },
  cardBrand: {
    type: String,
    required: true,
  },
  cardExpiry: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('paymentMethod', PaymentMethodSchema);
