const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const User = require('../../models/User');

// @route   POST api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('Admin credentials not set in .env file');
        return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    if (email === adminEmail && password === adminPassword) {
        res.json({ success: true, message: 'Admin authenticated successfully' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// @route   GET api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (should be secured later)
router.get('/stats', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();
        res.json({
            productCount,
            orderCount,
            userCount,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (should be secured)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/user-details/:id
// @desc    Get a single user's full details (profile, orders)
// @access  Private (should be secured)
router.get('/user-details/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });

        res.json({ user, orders });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
