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
DATE RANGE HELPER (for ride history filters)
=========================================
*/
function getDateThreshold(range) {
    const now = new Date();

    switch (range) {
        case "today": {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            return start;
        }
        case "week": {
            const start = new Date(now);
            start.setDate(start.getDate() - 7);
            return start;
        }
        case "month": {
            const start = new Date(now);
            start.setDate(start.getDate() - 30);
            return start;
        }
        default:
            return null;
    }
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
    repeatedFrom,
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
        repeatedFrom,
        otp: getOtp(6),
        status: "pending",
        acceptedAt: null,
        startedAt: null,
        completedAt: null,
        paidAt: null,
    });
    if (repeatedFrom) {
    await rideModel.findByIdAndUpdate(
        repeatedFrom,
        {
            $inc: {
                repeatCount: 1,
            },
        }
    );
}

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

    if (!rideId || !captain) {
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
GET CAPTAIN RIDE HISTORY
=========================================
*/
module.exports.getCaptainRideHistory = async ({
    captainId,
    status,
    range,
}) => {

    if (!captainId) {
        throw new Error("Captain ID is required.");
    }

    const query = { captain: captainId };

    if (status && status !== "all") {
        query.status = status;
    }

    const threshold = getDateThreshold(range);

    if (threshold) {
        query.createdAt = { $gte: threshold };
    }

    const rides = await rideModel
        .find(query)
        .populate({
            path: "user",
            select: "fullname email",
        })
        .sort({ createdAt: -1 });

    return rides;
};

/*
=========================================
CAPTAIN WALLET — derived entirely from completed rides.
No Wallet collection: everything below is computed on read.
=========================================
*/
function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function sumFares(rides) {
    return rides.reduce((total, ride) => total + (ride.fare || 0), 0);
}

module.exports.getCaptainWallet = async ({ captainId, range, from, to }) => {
    if (!captainId) {
        throw new Error("Captain ID is required.");
    }

    const completedRides = await rideModel
        .find({ captain: captainId, status: "completed" })
        .populate({ path: "user", select: "fullname" })
        .sort({ createdAt: -1 });

    const now = new Date();
    const todayStart = startOfDay(now);

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 30);

    const todayEarnings = sumFares(
        completedRides.filter((r) => new Date(r.createdAt) >= todayStart)
    );
    const weekEarnings = sumFares(
        completedRides.filter((r) => new Date(r.createdAt) >= weekStart)
    );
    const monthEarnings = sumFares(
        completedRides.filter((r) => new Date(r.createdAt) >= monthStart)
    );

    // No withdrawal ledger exists yet, so "available balance" is lifetime
    // completed-ride earnings. Once withdrawals are persisted somewhere,
    // subtract the withdrawn total from this.
    const availableBalance = sumFares(completedRides);

    // Last 7 calendar days, oldest -> newest, for the chart.
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const total = sumFares(
            completedRides.filter((r) => {
                const created = new Date(r.createdAt);
                return created >= dayStart && created < dayEnd;
            })
        );

        last7Days.push({
            date: dayStart.toISOString().slice(0, 10),
            label: dayStart.toLocaleDateString("en-IN", { weekday: "short" }),
            total,
        });
    }

    // Only cash/online exist as real paymentMethod values in this schema.
    const paymentBreakdown = {
        cash: sumFares(completedRides.filter((r) => r.paymentMethod === "cash")),
        online: sumFares(completedRides.filter((r) => r.paymentMethod === "online")),
    };

    // Transaction list respects the range/custom filter; summary cards
    // above always reflect their fixed windows regardless of this filter.
    let transactionRides = completedRides;

    if (range === "today") {
        transactionRides = transactionRides.filter((r) => new Date(r.createdAt) >= todayStart);
    } else if (range === "week") {
        transactionRides = transactionRides.filter((r) => new Date(r.createdAt) >= weekStart);
    } else if (range === "month") {
        transactionRides = transactionRides.filter((r) => new Date(r.createdAt) >= monthStart);
    } else if (range === "custom" && from) {
        const fromDate = startOfDay(new Date(from));
        const toDate = to ? new Date(to) : now;
        toDate.setHours(23, 59, 59, 999);

        transactionRides = transactionRides.filter((r) => {
            const created = new Date(r.createdAt);
            return created >= fromDate && created <= toDate;
        });
    }

    const transactions = transactionRides.map((ride) => ({
        id: ride._id,
        passenger: ride.user
            ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`
            : "Rider unavailable",
        pickup: ride.pickup,
        destination: ride.destination,
        amount: ride.fare,
        paymentMethod: ride.paymentMethod,
        paymentStatus: ride.paymentStatus,
        status: ride.status,
        date: ride.completedAt || ride.createdAt,
    }));

    return {
        availableBalance,
        todayEarnings,
        weekEarnings,
        monthEarnings,
        last7Days,
        paymentBreakdown,
        // No persisted withdrawal record exists — always null from the
        // backend until a real withdrawal ledger is added.
        lastWithdrawal: null,
        transactions,
    };
};

/*
=========================================
GET CAPTAIN WALLET

No separate Wallet model — everything here is derived from the
Ride collection at request time. That means:
  - "availableBalance" is the sum of every completed ride whose
    paymentStatus is "paid" (cash rides are marked paid the moment
    the ride ends; online rides are marked paid once markRideAsPaid
    runs after the Razorpay webhook/verify step).
  - There is no record of past withdrawals anywhere, so this
    function cannot report a "last withdrawal" — that needs its own
    persisted record once withdrawals are actually implemented.
=========================================
*/
module.exports.getCaptainWallet = async ({
    captainId,
    range,
    startDate,
    endDate,
}) => {

    if (!captainId) {
        throw new Error("Captain ID is required.");
    }

    const allCompletedRides = await rideModel
        .find({ captain: captainId, status: "completed" })
        .populate({
            path: "user",
            select: "fullname email",
        })
        .sort({ completedAt: -1 });

    const paidRides = allCompletedRides.filter(
        (ride) => ride.paymentStatus === "paid"
    );

    const sumFare = (rides) =>
        rides.reduce((total, ride) => total + (ride.fare || 0), 0);

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const weekThreshold = getDateThreshold("week");
    const monthThreshold = getDateThreshold("month");

    const isOnOrAfter = (date, threshold) =>
        date && threshold && new Date(date) >= threshold;

    const availableBalance = sumFare(paidRides);

    const todayEarnings = sumFare(
        paidRides.filter((ride) => isOnOrAfter(ride.completedAt, startOfToday))
    );

    const weekEarnings = sumFare(
        paidRides.filter((ride) => isOnOrAfter(ride.completedAt, weekThreshold))
    );

    const monthEarnings = sumFare(
        paidRides.filter((ride) => isOnOrAfter(ride.completedAt, monthThreshold))
    );

    // Last 7 calendar days (oldest -> newest) for the earnings chart.
    const chart = [];

    for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(now.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const dayTotal = sumFare(
            paidRides.filter((ride) => {
                if (!ride.completedAt) return false;
                const completed = new Date(ride.completedAt);
                return completed >= dayStart && completed < dayEnd;
            })
        );

        chart.push({
            date: dayStart.toISOString(),
            label: dayStart.toLocaleDateString("en-IN", { weekday: "short" }),
            amount: dayTotal,
        });
    }

    // Grouped by whatever paymentMethod values actually show up in the
    // data (currently "cash" / "online" per the ride model) rather than
    // a fixed list, so this doesn't silently omit a method later.
    const paymentBreakdown = paidRides.reduce((acc, ride) => {
        const method = ride.paymentMethod || "unknown";
        acc[method] = (acc[method] || 0) + (ride.fare || 0);
        return acc;
    }, {});

    // The transaction list respects the range/custom filter; the summary
    // cards above always reflect true totals regardless of this filter.
    let transactionRides = allCompletedRides;

    if (range === "custom" && (startDate || endDate)) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        transactionRides = transactionRides.filter((ride) => {
            if (!ride.completedAt) return false;
            const completed = new Date(ride.completedAt);
            if (start && completed < start) return false;
            if (end && completed > end) return false;
            return true;
        });
    } else if (range && range !== "all" && range !== "custom") {
        const threshold = getDateThreshold(range);

        if (threshold) {
            transactionRides = transactionRides.filter(
                (ride) => ride.completedAt && new Date(ride.completedAt) >= threshold
            );
        }
    }

    const transactions = transactionRides.map((ride) => ({
        id: ride._id,
        passenger: ride.user
            ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`
            : "Rider unavailable",
        pickup: ride.pickup,
        destination: ride.destination,
        amount: ride.fare,
        paymentMethod: ride.paymentMethod,
        paymentStatus: ride.paymentStatus,
        status: ride.status,
        date: ride.completedAt || ride.createdAt,
    }));

    return {
        availableBalance,
        todayEarnings,
        weekEarnings,
        monthEarnings,
        chart,
        paymentBreakdown,
        transactions,
    };
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