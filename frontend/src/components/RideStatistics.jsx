import React from "react";
import "remixicon/fonts/remixicon.css";

const RideStatistics = ({ rides }) => {

    const totalRides = rides.length;

    const completed = rides.filter(
        ride => ride.status === "completed"
    ).length;

    const totalSpent = rides.reduce(
        (sum, ride) => sum + (ride.fare || 0),
        0
    );

    const onlinePayments = rides.filter(
        ride =>
            ride.paymentMethod === "online" &&
            ride.paymentStatus === "paid"
    ).length;

    const cards = [
        {
            title: "Total Rides",
            value: totalRides,
            icon: "ri-roadster-fill",
            color: "bg-blue-100 text-blue-700"
        },
        {
            title: "Completed",
            value: completed,
            icon: "ri-checkbox-circle-fill",
            color: "bg-emerald-100 text-emerald-700"
        },
        {
            title: "Money Spent",
            value: `₹${totalSpent}`,
            icon: "ri-wallet-3-fill",
            color: "bg-amber-100 text-amber-700"
        },
        {
            title: "Online Paid",
            value: onlinePayments,
            icon: "ri-bank-card-fill",
            color: "bg-violet-100 text-violet-700"
        }
    ];

    return (

        <div className="grid grid-cols-2 gap-4">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100"
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs text-slate-500">
                                {card.title}
                            </p>

                            <h2 className="text-2xl font-bold mt-2">
                                {card.value}
                            </h2>

                        </div>

                        <div
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center ${card.color}`}
                        >
                            <i className={`${card.icon} text-2xl`} />
                        </div>

                    </div>

                </div>

            ))}

        </div>

    );
};

export default RideStatistics;