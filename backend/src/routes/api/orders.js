const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

// @route   GET api/orders
// @desc    Get all orders (for admin)
// @access  Private (should be secured)
router.get('/', async (req, res) => {
  try {
    // Populate user details to get customer name/email
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
