import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';

const WaitingForDriver = ({ selectedRide, pickup, destination, onCancel }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  if (!selectedRide) return null;

  return (
    <div ref={containerRef} className="mt-6 space-y-4">
      {/* Top Driver Info Card */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* Synced Driver Profile Image */}
            <img 
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
              alt="Driver Arjun Sharma" 
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
          </div>
          <div className="text-left">
            <h5 className="font-semibold text-base tracking-wide">Arjun Sharma</h5>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <i className="ri-star-fill text-amber-400" /> 4.9 • MH-12-GQ-4321
            </p>
          </div>
        </div>
      </div>

      {/* Main Trip Details Section */}
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
          {/* Vehicle Info */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center h-12 w-16">
                <span className="absolute animate-ping inline-flex h-8 w-12 rounded-full bg-sky-400 opacity-40"></span>
                <span className="absolute animate-pulse inline-flex h-12 w-16 rounded-full bg-blue-500 opacity-25 blur-md"></span>
                <img 
                  src={selectedRide.image} 
                  alt={selectedRide.name} 
                  className="relative z-10 h-full w-full object-contain" 
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 tracking-wide">
                  {selectedRide.name === "Motorbike" ? "Motor Bike" : selectedRide.name}
                </p>
                <p className="text-xs mt-0.5 font-medium text-emerald-600 animate-pulse">
                  Driver arriving in 3 mins
                </p>
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

      {/* Action Controls */}
      <div className="pt-1">
        <button 
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-95 transition-all font-semibold text-sm text-red-600 cursor-pointer"
        >
          <i className="ri-close-circle-fill text-lg" />
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;