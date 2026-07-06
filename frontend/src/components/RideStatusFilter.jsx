import React from "react";

const RideStatusFilter = ({ selectedStatus, setSelectedStatus }) => {

    const filters = [
        "All",
        "Completed",
        "Ongoing",
        "Accepted",
        "Pending",
        "Cancelled"
    ];

    return (

        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">

            {filters.map((filter) => (

                <button
                    key={filter}
                    onClick={() => setSelectedStatus(filter)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                        selectedStatus === filter
                            ? "bg-black text-white shadow-lg"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                    {filter}
                </button>

            ))}

        </div>

    );
};

export default RideStatusFilter;