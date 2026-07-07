import React from "react";
import "remixicon/fonts/remixicon.css";

const CaptainCard = ({ captain }) => {
    if (!captain) {
        return (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">Captain</h2>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                        <i className="ri-user-3-fill text-3xl text-slate-500" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">
                            Captain not assigned
                        </h3>

                        <p className="text-sm text-slate-500">
                            A captain had not accepted this ride.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const vehicle = captain.vehicle || {};

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

            <h2 className="font-bold text-lg mb-5">
                Captain
            </h2>

            <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">

                    <i className="ri-user-3-fill text-3xl" />

                </div>

                <div className="flex-1">

                    <h3 className="font-bold text-lg">

                        {captain.fullname.firstname}{" "}
                        {captain.fullname.lastname}

                    </h3>

                    <p className="text-sm text-slate-500">

                        Professional Driver

                    </p>

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 mb-1">

                        Vehicle

                    </p>

                    <p className="font-semibold">

                        {vehicle.vehicleType || "Not Available"}

                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 mb-1">

                        Plate Number

                    </p>

                    <p className="font-semibold">

                        {vehicle.plate || "Not Available"}

                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 mb-1">

                        Vehicle Model

                    </p>

                    <p className="font-semibold">

                        {vehicle.model || "Not Available"}

                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 mb-1">

                        Capacity

                    </p>

                    <p className="font-semibold">

                        {vehicle.capacity || "-"}

                    </p>

                </div>

            </div>

        </div>
    );
};

export default CaptainCard;