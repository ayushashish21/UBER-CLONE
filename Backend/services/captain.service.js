const captainModel = require('../models/captain.model');

/**
 * Create a new captain
 */
module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, country
}) => {
    // ADDED: country to the validation check
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType || !country) {
        throw new Error('All fields are required');
    }
    
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        country, // ADDED: Save country to database
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    return captain;
};

/**
 * Find nearby active captains based on coordinates (Haversine formula)
 */
module.exports.getCaptainsInTheRadius = async (lat, lng, radiusInKm) => {
    const activeCaptains = await captainModel.find({ status: 'active' });

    return activeCaptains.filter(captain => {
        if (!captain.location || !captain.location.lat || !captain.location.lng) return false;

        const R = 6371; // Earth's radius in km
        const dLat = (captain.location.lat - lat) * Math.PI / 180;
        const dLng = (captain.location.lng - lng) * Math.PI / 180;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(captain.location.lat * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
                  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance <= radiusInKm;
    });
}