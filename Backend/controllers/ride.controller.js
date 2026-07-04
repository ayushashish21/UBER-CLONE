const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;
    console.log(`[RIDE_FLOW] Step 1: Ride creation request processing started for user ${req.user._id}`);

    try {
        const activeUser = await userModel.findById(req.user._id);
        const userCountry = activeUser?.country || 'IN';
        console.log(`[RIDE_FLOW] Step 2: User boundary configuration resolved to country: ${userCountry}`);

        const ride = await rideService.createRide({ 
            user: req.user._id, 
            pickup, 
            destination, 
            vehicleType 
        });
        
        console.log(`[RIDE_FLOW] Step 3: Core document established inside MongoDB collection with ID: ${ride._id}`);
        res.status(201).json(ride);

        console.log(`[RIDE_FLOW] Step 4: Accessing Mapbox APIs for address coordinate structural pairs...`);
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup, userCountry);

        const captainsInRadius = await rideService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 100);
        console.log(`[RIDE_FLOW] Step 5: Haversine scan complete. Matchmaking payload deploying to ${captainsInRadius.length} active drivers.`);

        ride.otp = ""; // Exclude OTP from being broadcasted to captains

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, 'new-ride', rideWithUser);
        });

        console.log(`[RIDE_FLOW_SUCCESS] Matchmaking transactional phase ended cleanly.`);

    } catch (err) {
        console.error(`[RIDE_FLOW_EXCEPTION] Processing pipeline failed at current instruction index: ${err.message}`);
        if (!res.headersSent) {
            return res.status(400).json({ error: err.message });
        }
    }
};

module.exports.getFare = async (req, res) => {
    const { pickup, destination } = req.query;
    try {
        const activeUser = await userModel.findById(req.user._id);
        const userCountry = activeUser?.country || 'IN';
        const fare = await rideService.getFare(pickup, destination, userCountry);
        return res.status(200).json({ fare });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { rideId } = req.body;

    try {
        const confirmedRide = await rideService.confirmRide({ rideId, captain: req.captain });

        if (confirmedRide.user && confirmedRide.user.socketId) {
            sendMessageToSocketId(confirmedRide.user.socketId, 'ride-confirmed', confirmedRide);
        }

        return res.status(200).json(confirmedRide);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { rideId } = req.body;

    try {
        const ride = await rideService.startRide({ rideId, captain: req.captain });

        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, 'ride-started', ride);
        }

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { rideId, otp } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain, otp });

        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, 'ride-ended', ride);
        }

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};