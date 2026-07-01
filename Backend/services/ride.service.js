const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const crypto = require("crypto");

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination
    );

    const distanceInKm = distanceTime.distance / 1000;
    const durationInMinutes = distanceTime.duration / 60;

    return {
        motorcycle: Math.round(
            20 + distanceInKm * 6 + durationInMinutes
        ),

        auto: Math.round(
            30 + distanceInKm * 10 + durationInMinutes * 2
        ),

        car: Math.round(
            50 + distanceInKm * 15 + durationInMinutes * 3
        ),
    };
}

/**
 * Generate numeric OTP
 */
function generateOtp(num) {

    if (!Number.isInteger(num) || num <= 0) {
        throw new Error("Invalid OTP length");
    }

    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;

    return crypto.randomInt(min, max + 1).toString();
}

module.exports.getFare = getFare;

module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
}) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error(
            "User, pickup, destination and vehicle type are required"
        );
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        otp: generateOtp(6),
    });

    return ride;
};