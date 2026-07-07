const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
    "/create",
    authMiddleware.authUser,
    body("pickup").isString().isLength({ min: 3 }).withMessage("Invalid pickup address"),
    body("destination").isString().isLength({ min: 3 }).withMessage("Invalid destination address"),
    body("vehicleType").isString().isIn(["motorcycle", "auto", "car"]).withMessage("Invalid vehicle type"),
    body("paymentMethod").isIn(["online", "cash"]).withMessage("Invalid payment method"),
    rideController.createRide
);

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
);

// Captain accepts a pending ride
router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.confirmRide
);

// Captain starts the ride (OTP is NO LONGER required here)
router.post(
    "/start",
    authMiddleware.authCaptain,

    body("rideId")
        .isMongoId()
        .withMessage("Invalid ride id"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits"),

    rideController.startRide
);

// Captain completes the ride (OTP IS REQUIRED here now)
router.post(
    "/end",
    authMiddleware.authCaptain,
    body("rideId")
        .isMongoId()
        .withMessage("Invalid ride ID"),
    rideController.endRide
);

router.get(
    "/history",
    authMiddleware.authUser,
    rideController.getRideHistory
);

router.get(
    "/:rideId",
    authMiddleware.authUser,
    rideController.getRideById
);

module.exports = router;