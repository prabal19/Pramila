const express = require('express');
const router = express.Router();
const NewsletterSubscription = require('../../models/NewsletterSubscription');

// @route   POST api/newsletter/subscribe
// @desc    Subscribe to the newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let subscription = await NewsletterSubscription.findOne({ email });

    if (subscription) {
      return res.status(400).json({ msg: 'This email is already subscribed.' });
    }

    subscription = new NewsletterSubscription({
      name,
      email,
    });

    await subscription.save();

    res.status(201).json({ msg: 'Subscription successful!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
