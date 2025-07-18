const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by productId
// @access  Public
router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   POST api/products/batch
// @desc    Get multiple products by their IDs
// @access  Public
router.post('/batch', async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ msg: 'Product IDs array is required.' });
    }

    try {
        const products = await Product.find({ 'productId': { $in: ids } });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/products
// @desc    Create a product (for admin purposes)
// @access  Private (should be secured later)
router.post('/', async (req, res) => {
    const { productId, name, description, category, price, strikeoutPrice, images, bestseller, sizes, specifications } = req.body;
    try {
        let product = await Product.findOne({ productId });
        if(product) {
            return res.status(400).json({ msg: 'Product with this ID already exists.' });
        }
        
        product = new Product({
            productId,
            name,
            description,
            category,
            price,
            strikeoutPrice,
            images,
            bestseller,
            sizes,
            specifications
        });

        await product.save();
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/products/:id
// @desc    Update a product by productId
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let product = await Product.findOne({ productId: req.params.id });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        product = await Product.findOneAndUpdate(
            { productId: req.params.id }, 
            { $set: req.body }, 
            { new: true }
        );
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product by productId
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.id });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        await Product.findOneAndDelete({ productId: req.params.id });
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
