const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Order = require('../../models/Order');

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
        res.json({
            productCount,
            orderCount,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
