import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import axios from "axios";

const RideHistoryCard = ({ ride }) => {
    const [expanded, setExpanded] = useState(false);
    const [repeating, setRepeating] = useState(false);
    const navigate = useNavigate();

    const vehicleName = {
        car: "UberGo",
        auto: "UberAuto",
        motorcycle: "Motor Bike",
    };

    const vehicleIcon = {
        car: "ri-steering-2-fill",
        auto: "ri-taxi-fill",
        motorcycle: "ri-motorbike-fill"
    };

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

    const vehicle = ride.vehicleType || "car";

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

    const TimelineItem = ({ icon, title, value, color }) => (
        <div className="flex items-start gap-3 animate-fade-in">
            <div
                className={`h-9 w-9 rounded-full ${color} flex items-center justify-center animate-soft-pulse shadow`}            >
                <i className={`${icon} text-white`} />
            </div>

            <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-slate-500">{value}</p>
            </div>
        </div>
    );

    const handleCardClick = () => {
        navigate(`/rides/${ride._id}`);
    };

    const repeatRide = async () => {
        if (repeating) return;

        setRepeating(true);

        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/repeat/${ride._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/home", {
                state: {
                    repeatRide: data
                }
            });
        } catch (err) {
            console.error(err.response?.data);
        } finally {
            setRepeating(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* CLICKABLE HEADER */}

            <div
                onClick={handleCardClick}
                className="cursor-pointer p-5"
            >
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                            <i
                                className={`${vehicleIcon[vehicle]} text-2xl text-slate-800`}
                            />

                        </div>

                        <div>

                            <h3 className="font-bold">
                                {vehicleName[vehicle]}
                            </h3>

                            <p className="text-xs text-slate-500">
                                ₹{ride.fare}
                            </p>

                        </div>

                    </div>

                    <div className="text-right">

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[ride.status] ||
                                "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {ride.status}
                        </span>

                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition"
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

                        <p className="text-xs uppercase text-slate-400">
                            Pickup
                        </p>

                        <p className="font-medium">
                            {ride.pickup}
                        </p>

                    </div>

                    <div className="relative">

                        <i className="ri-map-pin-fill absolute -left-7 text-red-500 bg-white" />

                        <p className="text-xs uppercase text-slate-400">
                            Destination
                        </p>

                        <p className="font-medium">
                            {ride.destination}
                        </p>

                    </div>

                </div>
            </div>

            {/* EXPANDABLE SECTION */}

            <div
                className={`transition-all duration-500 overflow-hidden ${expanded ? "max-h-[900px]" : "max-h-0"
                    }`}
            >
                <div className="px-5 pb-5">

                    <div className="border-t pt-5">

                        {/* Captain */}

                        <div className="flex justify-between mb-4">

                            <div>

                                <p className="text-xs text-slate-500">
                                    Captain
                                </p>

                                <p className="font-semibold">

                                    {ride.captain
                                        ? `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}`
                                        : "Not Assigned"}

                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-slate-500">
                                    Fare
                                </p>

                                <p className="font-bold text-xl">
                                    ₹{ride.fare}
                                </p>

                            </div>

                        </div>

                        {/* Payment */}

                        <div className="flex justify-between mb-6">

                            <div>

                                <p className="text-xs text-slate-500">
                                    Payment Method
                                </p>

                                <p className="capitalize">
                                    {ride.paymentMethod}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-slate-500">
                                    Payment Status
                                </p>

                                <p
                                    className={`font-bold capitalize ${paymentStyle[ride.paymentStatus]}`}
                                >
                                    {ride.paymentStatus}
                                </p>

                            </div>

                        </div>

                        {/* Timeline */}

                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><i className="ri-time-line"></i>
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

                        {/* Footer */}

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button
                                disabled={repeating}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    repeatRide();
                                }}
                                className="py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <i className="ri-repeat-line"></i>
                                {repeating ? "Loading..." : "Repeat Ride"}
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(false);
                                }}
                                className="py-3 rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                            >
                                <i className="ri-eye-off-line"></i>
                                Hide Details
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            {!expanded && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(true);
                    }}
                    className="w-full mt-6 py-3 rounded-xl bg-black text-white hover:bg-slate-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2"                >
                    <i className="ri-eye-line" />
                    View Details
                </button>
            )}
        </div>
    );
};

export default RideHistoryCard;