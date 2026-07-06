const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const captainModel = require("../models/captain.model");
const crypto = require("crypto");

/*
=========================================
CALCULATE FARE
=========================================
*/
async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination
    );

    if (
        !distanceTime ||
        (!distanceTime.distance && !distanceTime.duration)
    ) {
        throw new Error("Could not fetch distance/time from Mapbox.");
    }

    const distanceValue =
        distanceTime.distance.value !== undefined
            ? distanceTime.distance.value
            : distanceTime.distance;

    const durationValue =
        distanceTime.duration.value !== undefined
            ? distanceTime.duration.value
            : distanceTime.duration;

    if (isNaN(distanceValue) || isNaN(durationValue)) {
        throw new Error("Invalid distance or duration received.");
    }

    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20,
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8,
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5,
    };

    return {
        auto: Math.round(
            baseFare.auto +
            (distanceValue / 1000) * perKmRate.auto +
            (durationValue / 60) * perMinuteRate.auto
        ),

        car: Math.round(
            baseFare.car +
            (distanceValue / 1000) * perKmRate.car +
            (durationValue / 60) * perMinuteRate.car
        ),

        motorcycle: Math.round(
            baseFare.motorcycle +
            (distanceValue / 1000) * perKmRate.motorcycle +
            (durationValue / 60) * perMinuteRate.motorcycle
        ),
    };
}

module.exports.getFare = getFare;

/*
=========================================
OTP GENERATOR
=========================================
*/
function getOtp(length) {
    return crypto
        .randomInt(
            Math.pow(10, length - 1),
            Math.pow(10, length)
        )
        .toString();
}

/*
=========================================
CREATE RIDE
=========================================
*/
module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
    paymentMethod,
}) => {
    if (!user || !pickup || !destination || !vehicleType || !paymentMethod) {
        throw new Error("All fields are required.");
    }

    const fare = await getFare(pickup, destination);

    if (
        fare[vehicleType] === undefined ||
        isNaN(fare[vehicleType])
    ) {
        throw new Error(
            `Invalid fare for vehicle type: ${vehicleType}`
        );
    }

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        paymentMethod,
        otp: getOtp(6),
        status: "pending",
    });

    return ride;
};

/*
=========================================
CONFIRM RIDE
=========================================
*/
module.exports.confirmRide = async ({
    rideId,
    captain,
}) => {
    if (!rideId || !captain) {
        throw new Error("Ride ID and Captain are required.");
    }

    const ride = await rideModel
        .findOneAndUpdate(
            {
                _id: rideId,
                status: "pending",
            },
            {
                status: "accepted",
                captain: captain._id,
            },
            {
                returnDocument: "after",
            }
        )
        .populate("user")
        .populate("captain")
        .select("+otp");

    if (!ride) {
        throw new Error(
            "Ride not found or already accepted."
        );
    }

    return ride;
};

/*
=========================================
START RIDE
=========================================
*/
module.exports.startRide = async ({
    rideId,
    captain,
}) => {
    if (!rideId || !captain) {
        throw new Error("Ride ID and Captain are required.");
    }

    const ride = await rideModel
        .findOneAndUpdate(
            {
                _id: rideId,
                captain: captain._id,
                status: "accepted",
            },
            {
                status: "ongoing",
            },
            {
                returnDocument: "after",
            }
        )
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error(
            "Ride not found or not accepted by this captain."
        );
    }

    return ride;
};

/*
=========================================
END RIDE
=========================================
*/
module.exports.endRide = async ({
    rideId,
    captain,
    otp,
}) => {
    if (!rideId || !captain || !otp) {
        throw new Error(
            "Ride ID, Captain and OTP are required."
        );
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            captain: captain._id,
            status: "ongoing",
        })
        .select("+otp")
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (
        String(ride.otp).trim() !==
        String(otp).trim()
    ) {
        throw new Error("Invalid OTP.");
    }

    ride.status = "completed";

    if (ride.paymentMethod === "cash") {

        ride.paymentStatus = "paid";

    }

    await ride.save();

    return ride;
};

/*
=========================================
GET NEARBY CAPTAINS
=========================================
*/
module.exports.getCaptainsInTheRadius = async (
    ltd,
    lng,
    radius
) => {
    const radiusInDegrees = radius / 111.12;

    const captains = await captainModel.find({
        socketId: {
            $exists: true,
            $ne: null,
        },

        $or: [
            {
                "location.lat": {
                    $gte: ltd - radiusInDegrees,
                    $lte: ltd + radiusInDegrees,
                },
                "location.lng": {
                    $gte: lng - radiusInDegrees,
                    $lte: lng + radiusInDegrees,
                },
            },
            {
                "location.ltd": {
                    $gte: ltd - radiusInDegrees,
                    $lte: ltd + radiusInDegrees,
                },
                "location.lng": {
                    $gte: lng - radiusInDegrees,
                    $lte: lng + radiusInDegrees,
                },
            },
        ],
    });

    return captains;
};