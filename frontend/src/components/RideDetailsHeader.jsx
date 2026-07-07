import React from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const RideDetailsHeader = () => {

    const navigate = useNavigate();

    return (

        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">

            <div className="flex items-center justify-between px-5 py-4">

                <button
                    onClick={() => navigate(-1)}
                    className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Ride Details
                    </h1>

                    <p className="text-sm text-slate-500">
                        Complete Trip Information
                    </p>

                </div>

                <div className="w-11"></div>

            </div>

        </div>

    );

};

export default RideDetailsHeader;