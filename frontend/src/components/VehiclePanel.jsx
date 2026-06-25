import React from "react";

const VehiclePanel = ({ rides, pickup, destination, setSelectedRide, setPanelOpen }) => {
  return (
    <div className="w-full overflow-hidden bg-white flex flex-col pointer-events-auto">
      <div className="px-5 py-2 flex-shrink-0 text-left">
        <h5 className="text-lg font-semibold text-slate-900 tracking-wide">
          {pickup && destination ? "Choose a Ride" : "Recent places"}
        </h5>
      </div>
      
      <div className="space-y-3 pb-4">
        {rides.map((ride) => (
          <button
            key={ride.id}
            onClick={() => {
              setTimeout(() => {
                setSelectedRide(ride);
                setPanelOpen(false);
              }, 200);
            }}
            className="flex flex-col w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition-all duration-200 hover:border-slate-400 hover:bg-slate-100/50 focus:ring-2 focus:ring-black focus:border-black active:bg-slate-200 active:scale-[0.99] text-center"
          >
            <img src={ride.image} alt={ride.name} className="h-10 w-16 object-contain mx-auto" />
            <div>
              <p className="inline-flex items-center justify-center gap-1 font-semibold text-slate-900 tracking-wide">
                {ride.name === "Motorbike" ? "Motor Bike" : ride.name}
                <span className="inline-flex items-center gap-0.5 text-xs font-normal text-slate-400 ml-1">
                  <i className="ri-user-fill text-[11px]" /> {ride.seats}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{ride.time} • {ride.description}</p>
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">{ride.price}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehiclePanel;