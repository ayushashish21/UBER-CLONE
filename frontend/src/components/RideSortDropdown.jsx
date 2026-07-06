import React from "react";
import "remixicon/fonts/remixicon.css";

const RideSortDropdown = ({ sortBy, setSortBy }) => {
    return (
        <div className="flex justify-end">

            <div className="relative">

                <i className="ri-sort-desc absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none shadow-sm cursor-pointer"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highestFare">Highest Fare</option>
                    <option value="lowestFare">Lowest Fare</option>
                </select>

            </div>
 
        </div>
    );
};

export default RideSortDropdown;