const express = require('express');
const router = express.Router();
const SupportTicket = require('../../models/SupportTicket');
const User = require('../../models/User');

// @route   POST api/support
// @desc    Create a new support ticket
// @access  Private (should be secured)
router.post('/', async (req, res) => {
    const { userId, subject, category, orderId, message } = req.body;

    if (!userId || !subject || !category || !message) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const newTicket = new SupportTicket({
            userId,
            subject,
            category,
            orderId,
            messages: [{
                sender: 'user',
                senderName: `${user.firstName} ${user.lastName}`,
                message,
            }]
        });

        const ticket = await newTicket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/support/user/:userId
// @desc    Get all tickets for a user
// @access  Private (should be secured)
router.get('/user/:userId', async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/support/admin
// @desc    Get all tickets for admin view
// @access  Private (should be secured)
router.get('/admin', async (req, res) => {
    try {
        const tickets = await SupportTicket.find().populate('userId', 'firstName lastName email').sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/support/:id
// @desc    Get a single ticket by its DB _id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id).populate('userId', 'firstName lastName email');
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found.' });
        }
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/support/:id/message
// @desc    Add a new message to a ticket
// @access  Private
router.put('/:id/message', async (req, res) => {
    const { sender, senderName, message } = req.body;
    if (!sender || !senderName || !message) {
        return res.status(400).json({ msg: 'Sender, name, and message are required.' });
    }

    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found.' });
        }

        ticket.messages.push({ sender, senderName, message });
        ticket.status = sender === 'support' ? 'Pending' : 'Open';
        
        await ticket.save();
        const populatedTicket = await SupportTicket.findById(req.params.id).populate('userId', 'firstName lastName email');
        res.json(populatedTicket);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/support/:id/status
// @desc    Update ticket status (admin only)
// @access  Private
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Open', 'Pending', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status.' });
    }

    try {
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('userId', 'firstName lastName email');

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found.' });
        }
        
        res.json(ticket);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
