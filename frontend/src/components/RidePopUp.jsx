import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';

const RidePopup = ({ ridePopupOpen, setRidePopupOpen, setConfirmRidePopupOpen }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (ridePopupOpen) {
      gsap.to(popupRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    } else {
      gsap.to(popupRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power3.in"
      });
    }
  }, [ridePopupOpen]);

  const handleAccept = () => {
    setRidePopupOpen(false);
    setConfirmRidePopupOpen(true);
  };

  return (
    <div 
      ref={popupRef}
      className="absolute inset-x-0 bottom-0 bg-white p-6 z-30 shadow-[0_-15px_40px_rgba(0,0,0,0.18)] rounded-t-3xl border-t border-slate-200 translate-y-full"
    >
      {/* Decorative drag handle */}
      <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

      <div className="flex flex-col gap-4 text-center">
        <div>
          <h4 className="text-xl font-extrabold text-slate-950 tracking-wide">New Ride Available!</h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Accept to inspect complete customer route matrix</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-4">
          
          {/* Rider Profile Identification Row */}
          <div className="flex items-center justify-between w-full bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                alt="Rider Profile" 
                className="h-11 w-11 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h5 className="font-bold text-sm text-slate-900 leading-none">Rayan Daniels</h5>
                <p className="text-xs font-semibold text-slate-400 mt-1">Passenger</p>
              </div>
            </div>
            
            {/* Proximity Distance Badge */}
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <i className="ri-map-pin-user-fill text-sm" />
              <span>2.5 km away</span>
            </div>
          </div>

          {/* Product Category Info Header Line */}
          <div className="flex justify-between items-center px-1 border-t border-slate-100 pt-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-900 text-white rounded-full">UberGo</span>
            <span className="text-lg font-black text-slate-900">₹199</span>
          </div>

          {/* Core Route Track Display */}
          <div className="space-y-4 text-left relative pl-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            <div className="relative">
              <i className="ri-checkbox-blank-circle-fill absolute -left-[22px] top-0.5 text-[10px] text-blue-600 bg-white z-10" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">Lalpur, Ranchi</p>
            </div>
            <div className="relative">
              <i className="ri-flag-2-fill absolute -left-[25px] top-0.5 text-sm text-red-500 bg-white z-10" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drop Location</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">25B, Etwari Bazar, CKP</p>
            </div>
          </div>
        </div>

        {/* Action Controls Layout Row */}
        <div className="flex gap-3 pt-1">
          <button 
            onClick={() => setRidePopupOpen(false)}
            className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer"
          >
            Ignore
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 py-3 rounded-2xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopup;