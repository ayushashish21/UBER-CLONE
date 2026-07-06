import React from "react";

const RideHistorySkeleton = () => {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 animate-pulse">

            {/* Top Row */}
            <div className="flex items-center justify-between mb-5">
                <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-slate-200"></div>
                    <div className="h-4 w-24 rounded bg-slate-200"></div>
                </div>

                <div className="h-10 w-10 rounded-full bg-slate-200"></div>
            </div>

            {/* Pickup */}
            <div className="flex gap-3 mb-4">
                <div className="h-5 w-5 rounded-full bg-slate-200"></div>

                <div className="flex-1">
                    <div className="h-4 w-20 rounded bg-slate-200 mb-2"></div>
                    <div className="h-5 w-full rounded bg-slate-200"></div>
                </div>
            </div>

            {/* Destination */}
            <div className="flex gap-3 mb-5">
                <div className="h-5 w-5 rounded-full bg-slate-200"></div>

                <div className="flex-1">
                    <div className="h-4 w-24 rounded bg-slate-200 mb-2"></div>
                    <div className="h-5 w-5/6 rounded bg-slate-200"></div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-4">

                <div>
                    <div className="h-3 w-14 rounded bg-slate-200 mb-2"></div>
                    <div className="h-5 w-16 rounded bg-slate-200"></div>
                </div>

                <div>
                    <div className="h-3 w-20 rounded bg-slate-200 mb-2"></div>
                    <div className="h-5 w-20 rounded bg-slate-200"></div>
                </div>

                <div>
                    <div className="h-3 w-16 rounded bg-slate-200 mb-2"></div>
                    <div className="h-5 w-20 rounded bg-slate-200"></div>
                </div>

            </div>

        </div>
    );
};

export default RideHistorySkeleton;