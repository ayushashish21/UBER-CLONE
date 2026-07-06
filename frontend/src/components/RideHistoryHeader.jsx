import React from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const RideHistoryHeader = ({
  totalRides = 0,
  search,
  setSearch,
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">

      {/* Top Header */}

      <div className="flex items-center justify-between px-5 pt-5">

        <button
          onClick={() => navigate("/home")}
          className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>

        <div className="text-center">

          <h1 className="text-2xl font-bold text-slate-900">
            Ride History
          </h1>

          <p className="text-sm text-slate-500">
            {totalRides} {totalRides === 1 ? "Trip" : "Trips"}
          </p>

        </div>

        <div className="w-11"></div>

      </div>

      {/* Search */}

      <div className="px-5 py-4">

        <div className="relative">

          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pickup, destination..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black"
          />

        </div>

      </div>

    </div>
  );
};

export default RideHistoryHeader;