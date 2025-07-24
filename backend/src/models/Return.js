
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ReturnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
    required: true,
  },
  orderItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productId: {
    type: String,
    required: true,
    ref: 'product'
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected', 'Item Picked Up', 'Refunded'],
    default: 'Pending Approval',
  },
}, {
  timestamps: true,
});

ReturnSchema.plugin(AutoIncrement, { inc_field: 'returnId', id: 'returnId_counter', start_seq: 50001 });

module.exports = mongoose.model('return', ReturnSchema);
