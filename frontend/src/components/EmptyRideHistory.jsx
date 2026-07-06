import React from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const EmptyRideHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">

      {/* Icon */}

      <div className="h-28 w-28 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
        <i className="ri-roadster-fill text-6xl text-slate-400"></i>
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-2xl font-bold text-slate-900">
        No rides yet
      </h2>

      {/* Description */}

      <p className="mt-3 max-w-sm text-slate-500 leading-7">
        Your completed rides will appear here.
        Book your first trip and start building your ride history.
      </p>

      {/* Button */}

      <button
        onClick={() => navigate("/home")}
        className="mt-8 bg-black hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <i className="ri-car-fill"></i>

        Book a Ride
      </button>

    </div>
  );
};

export default EmptyRideHistory;