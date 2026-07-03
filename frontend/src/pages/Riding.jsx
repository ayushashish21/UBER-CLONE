import React, { useEffect, useState, useContext } from "react";
import LiveTracking from "../components/LiveTracking";
import { SocketContext } from "../context/SocketContext";
import 'remixicon/fonts/remixicon.css';

const Riding = ({ selectedRide, pickup, destination }) => {
  const [captainLocation, setCaptainLocation] = useState(null);
  const { receiveMessage } = useContext(SocketContext);

  // Listen for live location updates during the ride
  useEffect(() => {
    const cleanup = receiveMessage('captain-location-update', (location) => {
      setCaptainLocation(location);
    });
    return cleanup; 
  }, [receiveMessage]);

  const ride = selectedRide || {
    name: "UberGo",
    price: "₹199",
    image: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
  };

  return (
    <div className="relative h-screen bg-slate-950 overflow-hidden flex flex-col">
      <a href="/home" className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer" aria-label="Go to home">
        <i className="ri-home-3-line text-xl" />
      </a>

      {/* REPLACED STATIC IMAGE WITH LIVE TRACKING MAP */}
      <div className="h-[45%] w-full relative z-0">
        <LiveTracking captainLocation={captainLocation} />
      </div>

      <div className="flex-1 bg-white px-5 py-3.5 flex flex-col justify-between z-10 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] overflow-y-auto rounded-none">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-3.5 text-white shadow-md">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img className="h-11 w-11 rounded-full border-2 border-white/20 object-cover" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt="Driver" />
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

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center h-12 w-16">
                    <span className="absolute animate-ping inline-flex h-8 w-12 rounded-full bg-sky-400 opacity-40"></span>
                    <span className="absolute animate-pulse inline-flex h-12 w-16 rounded-full bg-blue-500 opacity-25 blur-md"></span>
                    <img src={ride.image} alt={ride.name} className="relative z-10 h-full w-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 tracking-wide">{ride.name === "Motorbike" ? "Motor Bike" : ride.name}</p>
                    <p className="text-xs text-blue-600 mt-0.5 font-medium animate-pulse">Trip in progress...</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900">{ride.price}</p>
              </div>

              <div className="space-y-4 text-left relative pl-6 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <i className="ri-map-pin-fill absolute -left-[26px] top-0.5 text-base text-red-500 bg-white z-10" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heading to</p>
                  <p className="text-sm font-medium text-slate-800 leading-tight mt-0.5 break-words">{destination || "25B, Etwari Bazar, CKP, Jharkhand"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-black hover:bg-slate-800 active:scale-[0.99] transition-all font-semibold text-sm text-white cursor-pointer shadow-md">
            <i className="ri-bank-card-line text-lg" />
            Make a Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;