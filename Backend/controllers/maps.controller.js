const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;
    try {
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { input } = req.query;
        
        // 1. Check the database for the active user's chosen country
        let countryCode = ''; 
        if (req.user && req.user._id) {
            const activeUser = await userModel.findById(req.user._id);
            if (activeUser && activeUser.country) {
                countryCode = activeUser.country;
            }
        }

        // 2. Feed the country code to Mapbox to prioritize local suggestions!
        const suggestions = await mapService.getAutoCompleteSuggestions(input, countryCode);
        res.status(200).json(suggestions);

    } catch (err) {
        console.error("[CONTROLLER_ERROR] Suggestions fetch failed:", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}