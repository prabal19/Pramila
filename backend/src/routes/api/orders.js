const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

// @route   POST api/orders
// @desc    Create an order
// @access  Private (should be secured)
router.post('/', async (req, res) => {
  const { userId, items, totalAmount, shippingAddress } = req.body;
  try {
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
    });
    const order = await newOrder.save();
    
    // Clear the user's cart after creating the order
    await Cart.findOneAndDelete({ userId });

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


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


// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private (should be secured)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed / Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status provided.' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();
    
    // Repopulate user details for consistency
    const updatedOrder = await Order.findById(req.params.id).populate('userId', 'firstName lastName email');
    res.json(updatedOrder);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
