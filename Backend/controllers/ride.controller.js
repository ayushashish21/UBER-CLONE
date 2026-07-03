const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model'); // Fixed Population Crash

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ 
            user: req.user._id, 
            pickup, 
            destination, 
            vehicleType 
        });
        
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        
        // Handle Mapbox 'lat' vs 'ltd' naming
        const pickupLat = pickupCoordinates.ltd !== undefined ? pickupCoordinates.ltd : pickupCoordinates.lat;
        const pickupLng = pickupCoordinates.lng;

        if (!pickupLat || !pickupLng) {
            console.error("Socket broadcast skipped: Invalid coordinates from Mapbox", pickupCoordinates);
            return; 
        }

        const captainsInRadius = await rideService.getCaptainsInTheRadius(pickupLat, pickupLng, 2);

        ride.otp = ""; // Hide OTP from broadcast

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, 'new-ride', rideWithUser);
        });

    } catch (err) {
        if (!res.headersSent) {
            return res.status(400).json({ error: err.message });
        } else {
            console.error("Socket broadcast failed:", err.message);
        }
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { pickup, destination } = req.query;
    
    try {
        const fare = await rideService.getFare(pickup, destination);
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