const express = require('express');
const router = express.Router();
const Banner = require('../../models/Banner');

// @route   POST api/banners
// @desc    Create a banner
// @access  Private (should be secured)
router.post('/', async (req, res) => {
    try {
        const newBanner = new Banner(req.body);
        const banner = await newBanner.save();
        res.json(banner);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/banners
// @desc    Get all banners
// @access  Private (should be secured)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        res.json(banners);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/banners/:id
// @desc    Update a banner
// @access  Private (should be secured)
router.put('/:id', async (req, res) => {
    try {
        let banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        
        banner = await Banner.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(banner);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/banners/:id
// @desc    Delete a banner
// @access  Private (should be secured)
router.delete('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Banner removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
