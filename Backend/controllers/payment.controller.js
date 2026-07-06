const paymentService = require('../services/payment.service');
const { validationResult } = require('express-validator');

/*
POST /payments/create-order
Called by the frontend right after the user clicks "Make Payment".
Returns a Razorpay order_id which the frontend hands to Razorpay Checkout.
*/
module.exports.createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const order = await paymentService.createOrder({ rideId, user: req.user });
        return res.status(200).json(order);
    } catch (err) {
        console.error('[PAYMENT_CREATE_ORDER_ERROR]', err.message);
        return res.status(400).json({ error: err.message });
    }
};

/*
POST /payments/verify
Called by the frontend from the Razorpay Checkout success handler, with the
three fields Razorpay returns: razorpay_order_id, razorpay_payment_id,
razorpay_signature. This is the step that actually confirms the payment
happened — the Checkout success callback alone is not trustworthy on its own.
*/
module.exports.verifyPayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        rideId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    try {
        const ride = await paymentService.verifyPayment({
            rideId,
            user: req.user,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('[PAYMENT_VERIFY_ERROR]', err.message);
        return res.status(400).json({ error: err.message });
    }
};