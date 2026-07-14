import React from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const EmptyRideHistory = ({
  icon = "ri-roadster-fill",
  title = "No rides yet",
  description = "Your completed rides will appear here. Book your first trip and start building your ride history.",
  ctaLabel = "Book a Ride",
  ctaIcon = "ri-car-fill",
  ctaTo = "/home",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">

      {/* Icon */}

      <div className="h-28 w-28 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
        <i className={`${icon} text-6xl text-slate-400`}></i>
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      {/* Description */}

      <p className="mt-3 max-w-sm text-slate-500 leading-7">
        {description}
      </p>

      {/* Button */}

      <button
        onClick={() => navigate(ctaTo)}
        className="mt-8 bg-black hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <i className={ctaIcon}></i>

        {ctaLabel}
      </button>

    </div>
  );
};

export default EmptyRideHistory;