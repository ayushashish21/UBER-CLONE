import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';

const ConfirmRidePopup = ({ confirmRidePopupOpen, setConfirmRidePopupOpen, setRidePopupOpen, ride }) => {
  const fullScreenRef = useRef(null);
  
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (confirmRidePopupOpen) {
      gsap.to(fullScreenRef.current, {
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    } else {
      gsap.to(fullScreenRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in"
      });
      setOtp("");
      setErrorMessage("");
    }
  }, [confirmRidePopupOpen]);

  const handleCancel = () => {
    setConfirmRidePopupOpen(false);
    if (setRidePopupOpen) {
      setRidePopupOpen(true);
    }
  };

  const handleConfirmVerification = () => {
    // Reads directly from the returned ride data token
    if (otp === ride?.otp) {
      setErrorMessage("");
      window.location.href = "/captain-riding";
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div 
      ref={fullScreenRef}
      className="absolute inset-0 h-screen w-full bg-white z-50 flex flex-col justify-between p-5 overflow-hidden translate-y-full"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
        <button 
          onClick={handleCancel}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-800 active:scale-95 transition-all cursor-pointer"
          aria-label="Go back"
        >
          <i className="ri-arrow-left-line text-xl" />
        </button>
        <h4 className="text-lg font-extrabold text-slate-900 tracking-wide">Confirm this ride</h4>
        <div className="w-10 h-10" /> 
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
        
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 px-4 rounded-2xl w-full">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
              alt="Rider Profile" 
              className="h-12 w-14 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            />
            <div className="text-left flex flex-col justify-center">
              <h5 className="font-extrabold text-sm text-slate-900 leading-tight capitalize">
                {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
              </h5>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
                <span className="flex items-center gap-1"><i className="ri-user-3-line text-slate-400" /> Passenger</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-0.5 text-slate-700"><i className="ri-star-fill text-amber-500" /> 4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm text-left">
          <div className="flex gap-4 items-start relative">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <i className="ri-checkbox-blank-circle-fill text-[10px] text-blue-600 bg-slate-50 z-10" />
              <div className="w-0.5 h-10 bg-slate-300 absolute top-3.5 left-[4px] z-0" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Location</p>
              <p className="text-xs font-semibold text-slate-800 leading-snug break-words">
                {ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start pt-1">
            <div className="flex flex-col items-center flex-shrink-0 mt-0.5 z-10">
              <i className="ri-flag-2-fill text-sm text-red-500 bg-slate-50" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination Location</p>
              <p className="text-xs font-semibold text-slate-800 leading-snug break-words">
                {ride?.destination}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl">
          <div className="flex items-center gap-3 text-left">
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg flex-shrink-0">
              <i className="ri-money-rupee-circle-fill" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Fare Collection</p>
              <p className="text-[10px] text-emerald-600/80 font-semibold mt-0.5">Collect cash or online payment</p>
            </div>
          </div>
          <h3 className="text-xl font-black text-emerald-700 ml-2 flex-shrink-0">₹{ride?.fare}</h3>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100 flex-shrink-0 bg-white">
        
        {errorMessage && (
          <div className="flex items-center gap-2 bg-rose-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl">
            <i className="ri-error-warning-fill text-sm" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all duration-200 text-left">
          <i className="ri-lock-password-fill absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
          <input
            type="text"
            pattern="[0-9]*"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent pl-7 font-mono text-base font-bold tracking-[0.2em] text-slate-900 outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-400"
            placeholder="Enter 6-digit ride OTP"
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmVerification}
            className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;