import React from "react";

const ConfirmRide = ({ selectedRide, pickup, destination, onConfirm, onChangeRide, error }) => {
  if (!selectedRide) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
        <p className="mb-3 text-sm font-semibold text-slate-600 text-center">Selected Ride</p>
        
        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-50">
          {/* Vehicle Info */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center h-12 w-16">
                <span className="absolute animate-ping inline-flex h-8 w-12 rounded-full bg-sky-400 opacity-40"></span>
                <span className="absolute animate-pulse inline-flex h-12 w-16 rounded-full bg-blue-500 opacity-25 blur-md"></span>
                <img src={selectedRide.image} alt={selectedRide.name} className="relative z-10 h-full w-full object-contain" />
              </div>

              <div className="text-left">
                <p className="font-semibold text-slate-900 tracking-wide">
                  {selectedRide.name === "Motorbike" ? "Motor Bike" : selectedRide.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRide.time}</p>
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{selectedRide.price}</p>
          </div>

          {/* Route Details */}
          <div className="space-y-4 text-left relative pl-6 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
            <div className="relative">
              <i className="ri-record-circle-fill absolute -left-6 top-0.5 text-xs text-slate-900 bg-white z-10" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pickup Address</p>
              <p className="text-sm font-medium text-slate-800 leading-tight mt-0.5 break-words">
                {pickup || "Not selected"}
              </p>
            </div>

            <div className="relative">
              <i className="ri-map-pin-fill absolute -left-[26px] top-0.5 text-base text-red-500 bg-white z-10" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</p>
              <p className="text-sm font-medium text-slate-800 leading-tight mt-0.5 break-words">
                {destination || "Not selected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600 text-center">{error}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          onClick={onChangeRide}
          className="flex-1 rounded-3xl bg-slate-200 px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-300 active:scale-95 transition-all cursor-pointer"
        >
          Change Ride
        </button>
        
        <button 
          onClick={onConfirm}
          className="flex-1 rounded-3xl bg-black px-4 py-3 text-center font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;