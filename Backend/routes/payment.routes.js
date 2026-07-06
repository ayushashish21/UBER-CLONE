const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-order',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    paymentController.createOrder
);

router.post('/verify',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('razorpay_order_id').isString().notEmpty().withMessage('Missing razorpay_order_id'),
    body('razorpay_payment_id').isString().notEmpty().withMessage('Missing razorpay_payment_id'),
    body('razorpay_signature').isString().notEmpty().withMessage('Missing razorpay_signature'),
    paymentController.verifyPayment
);

module.exports = router;