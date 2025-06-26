const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true }, // This will be the hashed password
  otp: { type: String, required: true }, // This will be the hashed OTP
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document will be automatically deleted after 10 minutes
  },
});

module.exports = mongoose.model('verification', VerificationSchema);
