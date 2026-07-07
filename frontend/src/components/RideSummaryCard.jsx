import React from "react";
import "remixicon/fonts/remixicon.css";

const RideSummaryCard = ({ ride }) => {

    const vehicleName = {
        car: "UberGo",
        auto: "UberAuto",
        motorcycle: "Motor Bike"
    };

    const vehicleIcon = {
        car: "ri-steering-2-fill",
        auto: "ri-taxi-fill",
        motorcycle: "ri-motorbike-fill"
    };

    const statusStyle = {
        pending: "bg-yellow-100 text-yellow-700",
        accepted: "bg-sky-100 text-sky-700",
        ongoing: "bg-indigo-100 text-indigo-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700"
    };

    const formatDate = (date) => {

        if (!date) return "--";

        return new Date(date).toLocaleString("en-IN", {

            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"

        });

    };

    return (

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Top */}

            <div className="p-6 flex justify-between items-center">

                <div className="flex items-center gap-4">

                    <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">

                        <i
                            className={`${vehicleIcon[ride.vehicleType]} text-3xl text-slate-800`}
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            {vehicleName[ride.vehicleType]}

                        </h2>

                        <p className="text-slate-500">

                            Ride ID

                        </p>

                        <p className="text-xs font-mono">

                            {ride._id.slice(-8).toUpperCase()}

                        </p>

                    </div>

                </div>

                <div className="text-right">

                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusStyle[ride.status]}`}
                    >
                        {ride.status}
                    </span>

                    <h2 className="text-3xl font-bold mt-3">

                        ₹{ride.fare}

                    </h2>

                </div>

            </div>

            <div className="border-t"></div>

            {/* Pickup */}

            <div className="p-6">

                <div className="relative pl-8 before:absolute before:left-[12px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">

                    <div className="relative mb-6">

                        <i className="ri-map-pin-2-fill absolute -left-8 text-green-600 text-lg bg-white"></i>

                        <p className="text-xs uppercase text-slate-400">

                            Pickup

                        </p>

                        <p className="font-semibold mt-1">

                            {ride.pickup}

                        </p>

                    </div>

                    <div className="relative">

                        <i className="ri-map-pin-fill absolute -left-8 text-red-500 text-lg bg-white"></i>

                        <p className="text-xs uppercase text-slate-400">

                            Destination

                        </p>

                        <p className="font-semibold mt-1">

                            {ride.destination}

                        </p>

                    </div>

                </div>

            </div>

            <div className="border-t"></div>

            {/* Bottom Stats */}

            <div className="grid grid-cols-3">

                <div className="p-5 text-center border-r">

                    <i className="ri-calendar-event-line text-xl text-slate-600"></i>

                    <p className="text-xs text-slate-500 mt-2">

                        Date

                    </p>

                    <p className="text-sm font-semibold mt-1">

                        {formatDate(ride.createdAt)}

                    </p>

                </div>

                <div className="p-5 text-center border-r">

                    <i className="ri-route-fill text-xl text-slate-600"></i>

                    <p className="text-xs text-slate-500 mt-2">

                        Distance

                    </p>

                    <p className="text-sm font-semibold mt-1">

                        {ride.distance
                            ? `${(ride.distance / 1000).toFixed(1)} km`
                            : "--"}

                    </p>

                </div>

                <div className="p-5 text-center">

                    <i className="ri-time-line text-xl text-slate-600"></i>

                    <p className="text-xs text-slate-500 mt-2">

                        Duration

                    </p>

                    <p className="text-sm font-semibold mt-1">

                        {ride.duration
                            ? `${Math.round(ride.duration / 60)} mins`
                            : "--"}

                    </p>

                </div>

            </div>

        </div>

    );

};

export default RideSummaryCard;