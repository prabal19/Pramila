const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

// @route   GET api/cart/:userId
// @desc    Get user's cart
// @access  Private (should be secured)
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            // If no cart, return a new empty cart structure
            return res.json({ userId: req.params.userId, items: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cart/:userId
// @desc    Add/update item in cart
// @access  Private (should be secured)
router.post('/:userId', async (req, res) => {
    const { productId, quantity, size } = req.body;
    const { userId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        
        const existingItemIndex = cart.items.findIndex(
            item => item.productId === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ productId, quantity, size });
        }

        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/cart/:userId/items/:itemId
// @desc    Update item quantity in cart
// @access  Private
router.put('/:userId/items/:itemId', async (req, res) => {
    const { quantity } = req.body;
    const { userId, itemId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/cart/:userId/items/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:userId/items/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;
    
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        
        res.json(cart);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
