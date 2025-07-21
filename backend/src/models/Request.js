const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'support'],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RequestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Support', 'Contact', 'Newsletter'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'Pending', 'Closed', 'New Subscriber'],
    default: 'Open',
  },
  // For Contact/Newsletter
  contactName: { type: String },
  contactEmail: { type: String, required: true },
  message: { type: String }, // For Contact Form
  
  // For Support Tickets
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  subject: { type: String },
  category: { type: String },
  orderId: { type: String },
  messages: [MessageSchema],
}, {
  timestamps: true,
});

RequestSchema.plugin(AutoIncrement, { inc_field: 'ticketId', start_seq: 10001 });

module.exports = mongoose.model('request', RequestSchema);
