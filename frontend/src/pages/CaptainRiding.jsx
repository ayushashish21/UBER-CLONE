import React, { useState } from "react";
import 'remixicon/fonts/remixicon.css';
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanelOpen, setFinishRidePanelOpen] = useState(false);

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden flex flex-col">
      
      {/* Top Left: Uber Logo */}
      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      {/* Top Right: Logout Button */}
      <a 
        href="/captain/logout" 
        onClick={(e) => e.stopPropagation()} // Stop propagation here
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        aria-label="Log out"
      >
        <i className="ri-logout-box-r-line text-xl" />
      </a>

      {/* Upper Part (4/5 Height): Map View */}
      <div className="h-4/5 w-full relative z-0">
        <img
          className="w-full h-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTkHb14vVfomlEOWqrpKvN6xHaP6rHYlw0HnrqcTEEw&s=10"
          alt="Active trip navigation map"
        />
      </div>

      {/* Bottom Part (1/5 Height): Yellow Info Control Panel */}
      <div 
        onClick={(e) => {
          e.preventDefault(); // Protect layout actions
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
            4.2 km remaining
          </p>
        </div>

        <button 
          className="w-full py-3.5 bg-slate-950 rounded-xl text-white text-sm font-bold tracking-wide shadow-md pointer-events-none"
        >
          Complete Ride
        </button>
      </div>

      {/* Sliding Bottom Drawer Panel */}
      <FinishRide 
        finishRidePanelOpen={finishRidePanelOpen} 
        setFinishRidePanelOpen={setFinishRidePanelOpen} 
      />

    </div>
  );
};

export default CaptainRiding;