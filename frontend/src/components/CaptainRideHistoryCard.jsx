import React, { useState } from "react";
import "remixicon/fonts/remixicon.css";

const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    accepted: "bg-sky-100 text-sky-700 border border-sky-300",
    ongoing: "bg-indigo-100 text-indigo-700 border border-indigo-300",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    cancelled: "bg-red-100 text-red-700 border border-red-300",
};

const paymentStyle = {
    paid: "text-emerald-600",
    pending: "text-amber-600",
    failed: "text-red-600",
};

const vehicleName = {
    car: "UberGo",
    auto: "UberAuto",
    motorcycle: "Motor Bike",
};

const vehicleIcon = {
    car: "ri-steering-2-fill",
    auto: "ri-taxi-fill",
    motorcycle: "ri-motorbike-fill",
};

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

const formatRelative = (date) => {
    if (!date) return "--";

    const d = new Date(date);
    const now = new Date();
    const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
    const sameDay = (a, b) => a.toDateString() === b.toDateString();

    if (sameDay(d, now)) return `Today • ${time}`;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (sameDay(d, yesterday)) return `Yesterday • ${time}`;

    return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • ${time}`;
};

const TimelineItem = ({ icon, title, value, color }) => (
    <div className="flex items-start gap-3 animate-fade-in">
        <div
            className={`h-9 w-9 rounded-full ${color} flex items-center justify-center animate-soft-pulse shadow`}
        >
            <i className={`${icon} text-white`} />
        </div>

        <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-slate-500">{value}</p>
        </div>
    </div>
);

const CaptainRideHistoryCard = ({ ride }) => {
    const [expanded, setExpanded] = useState(false);

    const riderName = ride.user
        ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`
        : "Rider unavailable";

    const riderInitial = ride.user?.fullname?.firstname?.charAt(0) || "?";
    const vehicle = ride.vehicleType || "car";

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

            <div className="p-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase shadow-sm">
                            {riderInitial}
                        </div>

                        <div>
                            <h3 className="font-bold">{riderName}</h3>
                            <p className="text-xs text-slate-500">
                                {formatRelative(ride.completedAt || ride.createdAt)}
                            </p>
                        </div>

                    </div>

                    <div className="text-right">

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                statusStyle[ride.status] || "bg-slate-100 text-slate-600"
                            }`}
                        >
                            {ride.status}
                        </span>

                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition ml-auto"
                            >
                                <i
                                    className={`ri-arrow-${expanded ? "up" : "down"}-s-line text-xl transition-transform duration-300`}
                                />
                            </button>
                        </div>

                    </div>

                </div>

                {/* Route */}

                <div className="mt-6 relative pl-7 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">

                    <div className="relative mb-5">
                        <i className="ri-map-pin-2-fill absolute -left-7 text-green-600 bg-white" />
                        <p className="text-xs uppercase text-slate-400">Pickup</p>
                        <p className="font-medium">{ride.pickup}</p>
                    </div>

                    <div className="relative">
                        <i className="ri-map-pin-fill absolute -left-7 text-red-500 bg-white" />
                        <p className="text-xs uppercase text-slate-400">Destination</p>
                        <p className="font-medium">{ride.destination}</p>
                    </div>

                </div>

                {/* Fare + payment strip, visible without expanding — matches the compact list view */}

                <div className="mt-5 flex items-center gap-3 text-sm">
                    <span className="font-bold text-slate-900">₹{ride.fare}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="capitalize text-slate-500">{ride.paymentMethod}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1 text-slate-500">
                        <i className={`${vehicleIcon[vehicle]} text-slate-400`} />
                        {vehicleName[vehicle]}
                    </span>
                </div>

            </div>

            {/* EXPANDABLE SECTION */}

            <div
                className={`transition-all duration-500 overflow-hidden ${
                    expanded ? "max-h-[900px]" : "max-h-0"
                }`}
            >
                <div className="px-5 pb-5">

                    <div className="border-t pt-5">

                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="text-xs text-slate-500">Rider</p>
                                <p className="font-semibold">{riderName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Fare</p>
                                <p className="font-bold text-xl">₹{ride.fare}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="text-xs text-slate-500">Vehicle</p>
                                <p className="font-semibold flex items-center gap-1.5">
                                    <i className={`${vehicleIcon[vehicle]} text-slate-500`} />
                                    {vehicleName[vehicle]}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between mb-6">
                            <div>
                                <p className="text-xs text-slate-500">Payment Method</p>
                                <p className="capitalize">{ride.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Payment Status</p>
                                <p
                                    className={`font-bold capitalize ${
                                        paymentStyle[ride.paymentStatus] || "text-slate-600"
                                    }`}
                                >
                                    {ride.paymentStatus || "--"}
                                </p>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <i className="ri-time-line"></i>
                            Ride Timeline
                        </h3>

                        <div className="space-y-4">
                            <TimelineItem
                                icon="ri-add-circle-fill"
                                title="Ride Created"
                                value={formatDate(ride.createdAt)}
                                color="bg-slate-500"
                            />

                            {ride.acceptedAt && (
                                <TimelineItem
                                    icon="ri-checkbox-circle-fill"
                                    title="Ride Accepted"
                                    value={formatDate(ride.acceptedAt)}
                                    color="bg-blue-500"
                                />
                            )}

                            {ride.startedAt && (
                                <TimelineItem
                                    icon="ri-road-map-fill"
                                    title="Ride Started"
                                    value={formatDate(ride.startedAt)}
                                    color="bg-indigo-500"
                                />
                            )}

                            {ride.completedAt && (
                                <TimelineItem
                                    icon="ri-flag-fill"
                                    title="Ride Completed"
                                    value={formatDate(ride.completedAt)}
                                    color="bg-emerald-500"
                                />
                            )}

                            {ride.paidAt && (
                                <TimelineItem
                                    icon="ri-bank-card-fill"
                                    title="Payment Completed"
                                    value={formatDate(ride.paidAt)}
                                    color="bg-green-600"
                                />
                            )}
                        </div>

                        <button
                            onClick={() => setExpanded(false)}
                            className="w-full mt-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                        >
                            <i className="ri-eye-off-line"></i>
                            Hide Details
                        </button>

                    </div>

                </div>
            </div>

            {!expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="w-full mt-6 py-3 rounded-xl bg-black text-white hover:bg-slate-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                    <i className="ri-eye-line" />
                    View Details
                </button>
            )}

        </div>
    );
};

export default CaptainRideHistoryCard;