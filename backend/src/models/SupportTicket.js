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

const SupportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Order Issue', 'Payment', 'Delivery', 'Account', 'Product Inquiry', 'Other'],
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Open', 'Pending', 'Closed'],
    default: 'Open',
  },
  messages: [MessageSchema],
}, {
  timestamps: true,
});

SupportTicketSchema.plugin(AutoIncrement, { inc_field: 'ticketId', start_seq: 10001 });

module.exports = mongoose.model('supportTicket', SupportTicketSchema);
