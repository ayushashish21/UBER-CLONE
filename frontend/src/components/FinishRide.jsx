import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';

const FinishRide = ({ finishRidePanelOpen, setFinishRidePanelOpen }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (finishRidePanelOpen) {
      gsap.to(panelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    } else {
      gsap.to(panelRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power3.in"
      });
    }
  }, [finishRidePanelOpen]);

  return (
    <div 
      ref={panelRef}
      // Added onClick protection to stop container panel selection leaks
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-x-0 bottom-0 bg-white p-6 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.22)] rounded-t-3xl border-t border-slate-200 translate-y-full"
    >
      {/* Top drag strip handle hook */}
      <div 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setFinishRidePanelOpen(false);
        }}
        className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-5 cursor-pointer" 
      />

      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h4 className="text-xl font-black text-slate-950 tracking-wide">Finish this Ride?</h4>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Ensure you have collected the cash fare amount from the rider.
          </p>
        </div>

        {/* Passenger Profile Metadata Box */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-left">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
              alt="Rider Profile Summary" 
              className="h-11 w-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            <div>
              <h5 className="font-bold text-sm text-slate-900 leading-none">Rayan Daniels</h5>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">UberGo Passenger</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fare</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">₹199</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("Ride Successfully Finished!");
              window.location.href = "/captain-home"; 
            }}
            className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all cursor-pointer shadow-md text-center"
          >
            Complete Ride Payment & Finish
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFinishRidePanelOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 active:scale-[0.99] transition-all cursor-pointer text-center"
          >
            Go Back to Map Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;