
const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

// @route   POST api/orders
// @desc    Create an order and deduct product quantity
// @access  Private (should be secured)
router.post('/', async (req, res) => {
  const { userId, items, totalAmount, shippingAddress, phone } = req.body;
  
  try {
    // Basic validation
    if (!userId || !items || items.length === 0 || !totalAmount || !shippingAddress || !phone) {
      return res.status(400).json({ msg: 'Missing required order information.' });
    }

    // Check stock availability before creating the order
    for (const item of items) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.name} not found.` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${item.name}. Only ${product.quantity} left.` });
      }
    }

    // All products are in stock, proceed to create order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      phone,
    });
    
    // Deduct quantities from products
    for (const item of items) {
       await Product.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { quantity: -item.quantity } }
      );
    }
    
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
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/user/:userId
// @desc    Get all orders for a specific user
// @access  Private (should be secured)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private (should be secured)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Order not found' });
    }
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
