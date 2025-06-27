const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');

// @route   POST api/reviews
// @desc    Create a new review
// @access  Public
router.post('/', async (req, res) => {
  const { productId, name, email, rating, title, text, imageUrl } = req.body;

  if (!productId || !name || !email || !rating || !title || !text) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    const newReview = new Review({
      productId,
      name,
      email,
      rating,
      title,
      text,
      imageUrl
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;