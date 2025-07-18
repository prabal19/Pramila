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


// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'Name is required.' });
    }
    try {
        const newSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
        if (existingCategory) {
            return res.status(400).json({ msg: 'Another category with this name already exists.' });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            { name, slug: newSlug }, 
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
