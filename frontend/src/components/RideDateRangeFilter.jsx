import React from "react";

const ranges = [
    { label: "Today", value: "today" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
    { label: "All time", value: "all" },
];

const RideDateRangeFilter = ({ selectedRange, setSelectedRange }) => {
    return (
        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">

            {ranges.map((range) => (

                <button
                    key={range.value}
                    onClick={() => setSelectedRange(range.value)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                        selectedRange === range.value
                            ? "bg-black text-white shadow-lg"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                    {range.label}
                </button>

            ))}

        </div>
    );
};

export default RideDateRangeFilter;