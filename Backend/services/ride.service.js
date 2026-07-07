const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const captainModel = require("../models/captain.model");
const crypto = require("crypto");

/*
=========================================
CALCULATE FARE
=========================================
*/
async function getFare(pickup, destination, userCountry) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination,
        userCountry
    );

    if (
        !distanceTime ||
        (!distanceTime.distance && !distanceTime.duration)
    ) {
        throw new Error("Could not fetch distance/time.");
    }

    const distance =
        distanceTime.distance.value !== undefined
            ? distanceTime.distance.value
            : distanceTime.distance;

    const duration =
        distanceTime.duration.value !== undefined
            ? distanceTime.duration.value
            : distanceTime.duration;

    if (isNaN(distance) || isNaN(duration)) {
        throw new Error("Invalid distance or duration.");
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
        fare: {
            auto: Math.round(
                baseFare.auto +
                (distance / 1000) * perKmRate.auto +
                (duration / 60) * perMinuteRate.auto
            ),

            car: Math.round(
                baseFare.car +
                (distance / 1000) * perKmRate.car +
                (duration / 60) * perMinuteRate.car
            ),

            motorcycle: Math.round(
                baseFare.motorcycle +
                (distance / 1000) * perKmRate.motorcycle +
                (duration / 60) * perMinuteRate.motorcycle
            ),
        },

        distance,
        duration,
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
    userCountry
}) => {

    if (!user || !pickup || !destination || !vehicleType || !paymentMethod) {
        throw new Error("All fields are required.");
    }

    const fareResult = await getFare(
        pickup,
        destination,
        userCountry
    );

    if (
        fareResult.fare[vehicleType] === undefined ||
        isNaN(fareResult.fare[vehicleType])
    ) {
        throw new Error(
            `Invalid fare for vehicle type: ${vehicleType}`
        );
    }

    const ride = await rideModel.create({

        user,

        pickup,

        destination,

        vehicleType,

        fare: fareResult.fare[vehicleType],

        distance: fareResult.distance,

        duration: fareResult.duration,

        paymentMethod,

        otp: getOtp(6),

        status: "pending",

        acceptedAt: null,

        startedAt: null,

        completedAt: null,

        paidAt: null,

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
                acceptedAt: new Date()
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
    otp,
}) => {

    if (!rideId || !captain || !otp) {
        throw new Error("Ride ID, Captain and OTP are required.");
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            captain: captain._id,
            status: "accepted",
        })
        .select("+otp")
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (String(ride.otp).trim() !== String(otp).trim()) {
        throw new Error("Invalid OTP.");
    }

    ride.status = "ongoing";
    ride.startedAt = new Date();

    await ride.save();

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
    
}) => {

    if (!rideId || !captain ) {
        throw new Error("Ride ID, Captain are required.");
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            captain: captain._id,
            status: "ongoing",
        })
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found.");
    }

    

    ride.status = "completed";
    ride.completedAt = new Date();

    // Cash rides are immediately paid.
    if (ride.paymentMethod === "cash") {
        ride.paymentStatus = "paid";
        ride.paidAt = new Date();
    }

    await ride.save();

    return ride;
};

/*
=========================================
MARK RIDE AS PAID
=========================================
*/
module.exports.markRideAsPaid = async ({
    rideId,
    paymentId,
    orderId,
    signature,
}) => {

    if (!rideId || !paymentId || !orderId || !signature) {
        throw new Error("Payment details are required.");
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
        throw new Error("Ride not found.");
    }

    if (ride.paymentStatus === "paid") {
        return ride;
    }

    ride.paymentStatus = "paid";
    ride.paymentID = paymentId;
    ride.orderId = orderId;
    ride.signature = signature;

    // Timeline
    ride.paidAt = new Date();

    await ride.save();

    return ride;
};

/*
=========================================
GET USER RIDE HISTORY
=========================================
*/
module.exports.getRideHistory = async (userId) => {

    if (!userId) {
        throw new Error("User ID is required.");
    }

    const rides = await rideModel
        .find({ user: userId })
        .populate({
            path: "captain",
            select: "fullname vehicle",
        })
        .sort({ createdAt: -1 });

    return rides;
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

/*
=========================================
GET SINGLE RIDE
=========================================
*/
module.exports.getRideById = async ({ rideId, userId }) => {

    if (!rideId) {
        throw new Error("Ride ID is required.");
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            user: userId
        })
        .populate({
            path: "captain",
            select: "fullname vehicle"
        })
        .populate({
            path: "user",
            select: "fullname email"
        });

    if (!ride) {
        throw new Error("Ride not found.");
    }

    return ride;

};