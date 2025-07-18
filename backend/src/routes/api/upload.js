
const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');

// @route   POST api/upload
// @desc    Upload an image
// @access  Private (should be secured)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }
  try {
    res.json({ url: req.file.path });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
