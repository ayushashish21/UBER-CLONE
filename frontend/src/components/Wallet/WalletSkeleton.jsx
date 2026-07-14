import React from "react";

const WalletSkeleton = () => {
  return (
    <div className="px-5 py-4 space-y-4 animate-pulse">
      <div className="h-40 rounded-3xl bg-gray-200"></div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-24 rounded-2xl bg-gray-200"></div>
        <div className="h-24 rounded-2xl bg-gray-200"></div>
        <div className="h-24 rounded-2xl bg-gray-200"></div>
      </div>

      <div className="h-56 rounded-3xl bg-gray-200"></div>

      <div className="space-y-3">
        <div className="h-28 rounded-2xl bg-gray-200"></div>
        <div className="h-28 rounded-2xl bg-gray-200"></div>
        <div className="h-28 rounded-2xl bg-gray-200"></div>
      </div>
    </div>
  );
};

export default WalletSkeleton;