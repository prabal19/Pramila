const express = require('express');
const router = express.Router();
const Request = require('../../models/Request');
const User = require('../../models/User');

// @route   POST api/requests/support
// @desc    Create a new support ticket
// @access  Private (should be secured)
router.post('/support', async (req, res) => {
    const { userId, subject, category, orderId, message } = req.body;

    if (!userId || !subject || !category || !message) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const newRequest = new Request({
            type: 'Support',
            status: 'Open',
            userId,
            contactEmail: user.email,
            contactName: `${user.firstName} ${user.lastName}`,
            subject,
            category,
            orderId,
            messages: [{
                sender: 'user',
                senderName: `${user.firstName} ${user.lastName}`,
                message,
            }]
        });

        const request = await newRequest.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/contact
// @desc    Create a new contact request
// @access  Public
router.post('/contact', async (req, res) => {
    const { name, email, message, isUrgent } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Name, email, and message are required.' });
    }
    try {
        const newRequest = new Request({
            type: 'Contact',
            status: 'Open',
            contactName: name,
            contactEmail: email,
            subject: isUrgent ? 'URGENT Contact Form Submission' : 'Contact Form Submission',
            message: message,
        });
        await newRequest.save();
        res.status(201).json({ msg: 'Your message has been sent successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/newsletter
// @desc    Create a newsletter subscription request
// @access  Public
router.post('/newsletter', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ msg: 'Name and email are required.' });
    }
    try {
        const existingSub = await Request.findOne({ type: 'Newsletter', contactEmail: email });
        if (existingSub) {
            return res.status(400).json({ msg: 'This email is already subscribed.' });
        }
        const newRequest = new Request({
            type: 'Newsletter',
            status: 'New Subscriber',
            contactName: name,
            contactEmail: email,
            subject: 'Newsletter Subscription',
        });
        await newRequest.save();
        res.status(201).json({ msg: 'Subscription successful!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/requests/user/:userId
// @desc    Get all tickets for a user
// @access  Private (should be secured)
router.get('/user/:userId', async (req, res) => {
    try {
        const requests = await Request.find({ userId: req.params.userId, type: 'Support' }).sort({ updatedAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requests/admin
// @desc    Get all requests for admin view
// @access  Private (should be secured)
router.get('/admin', async (req, res) => {
    try {
        const requests = await Request.find().populate('userId', 'firstName lastName email').sort({ updatedAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/requests/:id
// @desc    Get a single request by its DB _id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id).populate('userId', 'firstName lastName email');
        if (!request) {
            return res.status(404).json({ msg: 'Request not found.' });
        }
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/requests/:id/message
// @desc    Add a new message to a ticket
// @access  Private
router.put('/:id/message', async (req, res) => {
    const { sender, senderName, message } = req.body;
    if (!sender || !senderName || !message) {
        return res.status(400).json({ msg: 'Sender, name, and message are required.' });
    }

    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ msg: 'Request not found.' });
        }

        request.messages.push({ sender, senderName, message });
        request.status = sender === 'support' ? 'Pending' : 'Open';
        
        await request.save();
        const populatedRequest = await Request.findById(req.params.id).populate('userId', 'firstName lastName email');
        res.json(populatedRequest);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/requests/:id/status
// @desc    Update ticket status (admin only)
// @access  Private
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Open', 'Pending', 'Closed', 'New Subscriber'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status.' });
    }

    try {
        const request = await Request.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('userId', 'firstName lastName email');

        if (!request) {
            return res.status(404).json({ msg: 'Request not found.' });
        }
        
        res.json(request);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
