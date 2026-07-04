import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ConfirmRidePopup = ({ confirmRidePopupOpen, setConfirmRidePopupOpen, setRidePopupOpen, ride }) => {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();
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
      setErrorMessage("");
    }
  }, [confirmRidePopupOpen]);

  const handleCancel = () => {
    setConfirmRidePopupOpen(false);
    if (setRidePopupOpen) {
      setRidePopupOpen(true);
    }
  };

  const handleStartRide = async () => {
    if (!ride?._id) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start`,
        { rideId: ride._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Navigate and pass the ride data to the next screen
        navigate('/captain-riding', { state: { ride: ride } });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to start ride.");
    }
  };

  return (
    <div 
      ref={fullScreenRef}
      className="absolute inset-0 h-screen w-full bg-slate-900 z-50 translate-y-full flex flex-col justify-end"
    >
      <div className="bg-white h-[90vh] w-full rounded-t-[2rem] px-5 py-6 flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.2)]">
        
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <h5 className="text-xl font-black text-slate-900 tracking-tight">Trip Details</h5>
          <button onClick={handleCancel} className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
              <img 
                className="h-full w-full object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                alt="Passenger" 
              />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 capitalize leading-tight">
                {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
              </h4>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5 tracking-wide">
                User
              </p>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start gap-4">
               <div className="mt-1 flex flex-col items-center">
                 <i className="ri-map-pin-user-fill text-xl text-blue-500" />
                 <div className="h-8 w-0.5 bg-slate-200 my-1 rounded-full" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup Location</p>
                 <h5 className="text-sm font-semibold text-slate-800">{ride?.pickup || "Fetching..."}</h5>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="mt-1 flex flex-col items-center">
                 <i className="ri-map-pin-2-fill text-xl text-red-500" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop-off Destination</p>
                 <h5 className="text-sm font-semibold text-slate-800">{ride?.destination || "Fetching..."}</h5>
               </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
               <div className="mt-1 flex flex-col items-center">
                 <i className="ri-bank-card-fill text-xl text-emerald-500" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Payment Method • Cash</p>
                 <h5 className="text-xl font-black text-slate-900">₹{ride?.fare || "0"}</h5>
               </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm font-semibold text-center mb-3">{errorMessage}</p>
        )}

        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button 
            onClick={handleStartRide}
            className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-lg text-center"
          >
            Start Ride
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmRidePopup;