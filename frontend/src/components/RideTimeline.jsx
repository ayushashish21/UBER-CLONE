import React from "react";
import "remixicon/fonts/remixicon.css";

const RideTimeline = ({ ride }) => {
    const formatDate = (date) => {
        if (!date) return "--";

        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const timeline = [
        {
            title: "Ride Created",
            value: ride.createdAt,
            icon: "ri-add-circle-fill",
            color: "bg-slate-500",
        },

        {
            title: "Captain Accepted",
            value: ride.acceptedAt,
            icon: "ri-user-star-fill",
            color: "bg-blue-500",
        },

        {
            title: "Ride Started",
            value: ride.startedAt,
            icon: "ri-road-map-fill",
            color: "bg-indigo-500",
        },

        {
            title: "Ride Completed",
            value: ride.completedAt,
            icon: "ri-flag-fill",
            color: "bg-emerald-500",
        },

        {
            title: "Payment Completed",
            value: ride.paidAt,
            icon: "ri-bank-card-fill",
            color: "bg-green-600",
        },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">

            <h2 className="text-lg font-bold mb-6">
                Ride Timeline
            </h2>

            <div className="relative">

                {timeline.map((item, index) => {

                    if (!item.value) return null;

                    return (

                        <div
                            key={index}
                            className="relative flex gap-4 pb-8 last:pb-0"
                        >

                            {index !== timeline.length - 1 && (
                                <div className="absolute left-[18px] top-10 w-[2px] h-full bg-slate-200" />
                            )}

                            <div
                                className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center shrink-0`}
                            >
                                <i
                                    className={`${item.icon} text-white`}
                                />
                            </div>

                            <div>

                                <h3 className="font-semibold">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {formatDate(item.value)}
                                </p>

                            </div>

                        </div>

                    );
                })}
            </div>

        </div>
    );
};

export default RideTimeline;