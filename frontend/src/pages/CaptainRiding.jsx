import React, { useState } from "react";
import 'remixicon/fonts/remixicon.css';
import FinishRide from "../components/FinishRide";
import { useLocation } from "react-router-dom";
import LiveTracking from "../components/LiveTracking"; 

const CaptainRiding = () => {
  const [finishRidePanelOpen, setFinishRidePanelOpen] = useState(false);
  const location = useLocation();
  const rideData = location.state?.ride;

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden flex flex-col">
      
      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      <a 
        href="/captain/logout" 
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        aria-label="Log out"
      >
        <i className="ri-logout-box-r-line text-xl" />
      </a>

      {/* Map View */}
      <div className="h-4/5 w-full relative z-0">
        <LiveTracking />
      </div>

      {/* Control Panel */}
      <div 
        onClick={(e) => {
          e.preventDefault(); 
          setFinishRidePanelOpen(true);
        }}
        className="h-1/5 w-full bg-amber-400 px-6 py-4 flex flex-col justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-10 cursor-pointer hover:bg-amber-500 transition-colors duration-150"
      >
        <div className="flex items-center justify-between w-full pointer-events-none">
          <h5 className="font-extrabold text-base text-slate-900 tracking-wide uppercase">
            On Trip
          </h5>
          <p className="font-black text-slate-900 flex items-center gap-1 text-sm bg-white/40 px-3 py-1 rounded-full">
            <i className="ri-road-map-line text-base" />
            Navigating...
          </p>
        </div>

        <button 
          className="w-full py-3.5 bg-slate-950 rounded-xl text-white text-sm font-bold shadow-lg shadow-black/20 hover:bg-black active:scale-[0.99] transition-all"
        >
          Complete Ride
        </button>
      </div>

      <FinishRide 
        ride={rideData}
        finishRidePanelOpen={finishRidePanelOpen} 
        setFinishRidePanelOpen={setFinishRidePanelOpen} 
      />
    </div>
  );
};

export default CaptainRiding;