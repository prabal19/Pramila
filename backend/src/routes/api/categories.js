const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private (should be secured)
router.post('/', async (req, res) => {
  const { name, parent } = req.body;
  if (!name || !parent) {
    return res.status(400).json({ msg: 'Name and parent are required.' });
  }

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    let category = await Category.findOne({ $or: [{ name }, { slug }] });
    if (category) {
      return res.status(400).json({ msg: 'Category with this name or slug already exists.' });
    }

    category = new Category({ name, slug, parent });
    await category.save();
    res.json(category);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
