const Ride = require("../models/ride.model");

/**
 * Get dashboard statistics for a captain
 */
module.exports.getCaptainDashboard = async (captainId) => {

    // Fetch all rides of this captain
    const rides = await Ride.find({
        captain: captainId
    });



    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let totalDistance = 0;
    let totalEarnings = 0;
    let todayRides = 0;
    let todayEarnings = 0;
    let completedRides = 0;
    let ongoingRides = 0;
    let cancelledRides = 0;

    rides.forEach((ride) => {

        totalDistance += ride.distance || 0;

        // Count earnings only after completion
        if (ride.status === "completed") {

            completedRides++;

            totalEarnings += ride.fare || 0;

            if (
                ride.completedAt &&
                new Date(ride.completedAt) >= today
            ) {
                todayRides++;
                todayEarnings += ride.fare || 0;
            }
        }

        if (ride.status === "ongoing") {
            ongoingRides++;
        }

        if (ride.status === "cancelled") {
            cancelledRides++;
        }

    });

    const averageFare =
        completedRides === 0
            ? 0
            : Math.round(totalEarnings / completedRides);

    const completionRate =
  rides.length === 0
    ? 0
    : Math.round((completedRides / rides.length) * 100);
    
    return {
        totalRides: rides.length,

        completedRides,

        ongoingRides,

        cancelledRides,

        todayRides,

        totalEarnings,

        todayEarnings,

        totalDistance: Number(totalDistance.toFixed(2)),

        averageFare,

        completionRate,
    }
};