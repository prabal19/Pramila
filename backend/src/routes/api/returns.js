
const express = require('express');
const router = express.Router();
const Return = require('../../models/Return');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

// @route   POST api/returns
// @desc    Create a return request
// @access  Private (should be secured)
router.post('/', async (req, res) => {
    const { userId, orderId, orderItemId, productId, reason, description } = req.body;

    if (!userId || !orderId || !orderItemId || !productId || !reason) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const order = await Order.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.status(404).json({ msg: 'Order not found or does not belong to user.' });
        }

        const item = order.items.id(orderItemId);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found in order.' });
        }
        
        if(item.returnStatus) {
            return res.status(400).json({ msg: 'A return has already been requested for this item.' });
        }

        const newReturn = new Return({
            userId,
            orderId,
            orderItemId,
            productId,
            reason,
            description,
        });

        await newReturn.save();
        
        item.returnStatus = 'Requested';
        await order.save();

        res.status(201).json(newReturn);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const fetchAndPopulateReturns = async (query) => {
    const returnsResult = await query.lean();
    if (!returnsResult) return [];

    const returnsArray = Array.isArray(returnsResult) ? returnsResult : [returnsResult];
    if (returnsArray.length === 0) return [];
    
    const productIds = [...new Set(returnsArray.map(r => r.productId))];

    const products = await Product.find({ productId: { $in: productIds } }).lean();
    const productMap = new Map(products.map(p => [p.productId, { ...p, id: p.productId } ]));
    
    return returnsArray.map(ret => {
        const productData = productMap.get(ret.productId);
        return {
            ...ret,
            product: productData || null
        }
    });
};


// @route   GET api/returns/user/:userId
// @desc    Get all return requests for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
    try {
        const query = Return.find({ userId: req.params.userId })
            .populate({
                path: 'orderId',
                select: 'createdAt totalAmount'
            })
            .sort({ createdAt: -1 });

        const populatedReturns = await fetchAndPopulateReturns(query);
        res.json(populatedReturns);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/returns/admin
// @desc    Get all return requests for admin
// @access  Private
router.get('/admin', async (req, res) => {
    try {
         const query = Return.find()
            .populate('userId', 'firstName lastName email')
            .populate({
                path: 'orderId',
                select: 'createdAt totalAmount'
            })
            .sort({ createdAt: -1 });

        const populatedReturns = await fetchAndPopulateReturns(query);
        res.json(populatedReturns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/returns/:id
// @desc    Get a single return request by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const query = Return.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate({
                path: 'orderId',
                select: 'createdAt totalAmount'
            });

        const populatedReturns = await fetchAndPopulateReturns(query);
        
        if (!populatedReturns || populatedReturns.length === 0) {
            return res.status(404).json({ msg: 'Return request not found' });
        }
        
        res.json(populatedReturns[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/returns/:id/status
// @desc    Update return status (admin)
// @access  Private
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending Approval', 'Approved', 'Rejected', 'Item Picked Up', 'Refunded'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        let returnRequest = await Return.findById(req.params.id);
        if (!returnRequest) {
            return res.status(404).json({ msg: 'Return request not found.' });
        }
        
        // Update the return request status
        returnRequest.status = status;
        await returnRequest.save();

        // Find the corresponding order and update the specific item's returnStatus
        await Order.findOneAndUpdate(
            { "_id": returnRequest.orderId, "items._id": returnRequest.orderItemId },
            { 
                "$set": { "items.$.returnStatus": status }
            }
        );
        
        const query = Return.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate({
                path: 'orderId',
                select: 'createdAt totalAmount'
            });

        const populatedReturns = await fetchAndPopulateReturns(query);
        res.json(populatedReturns[0]);

    } catch (err) {
        console.error("Error in PUT /api/returns/:id/status:", err);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
