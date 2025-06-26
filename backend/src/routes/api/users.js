const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private (for now, public, but should be secured)
router.put('/:id', async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ msg: 'No fields to update' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   POST api/users/:id/addresses
// @desc    Add an address for a user
// @access  Private (for now, public)
router.post('/:id/addresses', async (req, res) => {
  const { fullAddress } = req.body;

  if (!fullAddress) {
    return res.status(400).json({ msg: 'Address field is required' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.addresses.unshift({ fullAddress });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:id/addresses/:address_id
// @desc    Update a user address
// @access  Private (for now, public)
router.put('/:id/addresses/:address_id', async (req, res) => {
    const { fullAddress } = req.body;

    if (!fullAddress) {
        return res.status(400).json({ msg: 'Address field is required' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const address = user.addresses.id(req.params.address_id);
        if (!address) {
            return res.status(404).json({ msg: 'Address not found' });
        }

        address.fullAddress = fullAddress;
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/users/:id/addresses/:address_id
// @desc    Delete an address from user profile
// @access  Private (for now, public)
router.delete('/:id/addresses/:address_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const address = user.addresses.id(req.params.address_id);
    if (!address) {
        return res.status(404).json({ msg: 'Address not found' });
    }
    
    // Mongoose sub-document has its own remove method.
    // However, since we are on Express, we can get its parent array and splice it.
    const removeIndex = user.addresses.map(item => item.id).indexOf(req.params.address_id);
    user.addresses.splice(removeIndex, 1);


    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user account
// @access  Private (for now, public)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = router;
