const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  imageUrl: { type: String, required: true },
  buttonText: { type: String },
  buttonLink: { type: String },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' },
  position: { 
    type: String, 
    enum: ['top-of-page', 'after-section', 'bottom-of-page'],
    required: true,
  },
  targetPages: { type: [String], required: true },
  sectionIdentifier: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  animation: {
    type: String,
    enum: ['none', 'fade', 'slide', 'zoom'],
    default: 'none'
  },
  clickableImage: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('banner', BannerSchema);
