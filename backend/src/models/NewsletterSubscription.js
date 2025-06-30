const mongoose = require('mongoose');

const NewsletterSubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('newsletterSubscription', NewsletterSubscriptionSchema);
