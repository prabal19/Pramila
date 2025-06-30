const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../models/PaymentMethod');

// @route   POST api/payment
// @desc    Save a payment method
// @access  Private (should be secured)
router.post('/', async (req, res) => {
  const { userId, email, cardLast4, cardBrand, cardExpiry } = req.body;
  try {
    const newPaymentMethod = new PaymentMethod({
      userId,
      email,
      cardLast4,
      cardBrand,
      cardExpiry,
      methodType: 'card',
    });
    const paymentMethod = await newPaymentMethod.save();
    res.json(paymentMethod);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payment/:userId
// @desc    Get user's saved payment methods
// @access  Private (should be secured)
router.get('/:userId', async (req, res) => {
    try {
        const methods = await PaymentMethod.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(methods);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
