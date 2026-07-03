import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';

const RidePopup = ({ ride, ridePopupOpen, setRidePopupOpen, setConfirmRidePopupOpen }) => {
  const popupRef = useRef(null);

  // THIS IS THE MAGIC FIX: 
  // It watches 'ridePopupOpen'. When the socket turns it true, it slides up automatically!
  useGSAP(() => {
    if (ridePopupOpen) {
      gsap.to(popupRef.current, { 
        transform: 'translateY(0)', 
        duration: 0.4, 
        ease: "power3.out" 
      });
    } else {
      gsap.to(popupRef.current, { 
        transform: 'translateY(100%)', 
        duration: 0.4, 
        ease: "power3.in" 
      });
    }
  }, [ridePopupOpen]);

  return (
    <div 
      ref={popupRef} 
      // Ensure the initial state is pushed off the bottom of the screen (translate-y-full)
      className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-5 py-6 pt-12 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)]"
    >
      {/* Top Drag Handle (Optional visual flair) */}
      <div className="w-12 h-1.5 bg-slate-200 rounded-full absolute top-4 left-1/2 -translate-x-1/2"></div>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-bold text-slate-900">New Ride Request</h3>
        <h5 className="text-lg font-black text-slate-900">
          ₹{ride?.fare || "0"}
        </h5>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 mb-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold uppercase shadow-sm">
            {ride?.user?.fullname?.firstname?.[0] || 'U'}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 capitalize tracking-wide">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              <i className="ri-map-pin-user-fill text-blue-500 mr-1"></i>
              Cash Payment
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 mb-6">
        <div className="relative">
          <i className="ri-record-circle-fill absolute -left-6 top-0.5 text-xs text-slate-900 bg-white z-10" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pickup</p>
          <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5 break-words">
            {ride?.pickup || "Fetching location..."}
          </p>
        </div>
        <div className="relative">
          <i className="ri-map-pin-fill absolute -left-[26px] top-0.5 text-base text-red-500 bg-white z-10" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drop-off</p>
          <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5 break-words">
            {ride?.destination || "Fetching destination..."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => setRidePopupOpen(false)} 
          className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 active:scale-95 transition-all"
        >
          Ignore
        </button>
        <button 
          onClick={setConfirmRidePopupOpen} 
          className="flex-[2] py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <i className="ri-check-line text-lg"></i>
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default RidePopup;