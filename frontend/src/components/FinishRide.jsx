import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FinishRide = ({ finishRidePanelOpen, setFinishRidePanelOpen, ride }) => {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage("");
    }
  }, [finishRidePanelOpen]);

  const handleFinishRide = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Unable to complete ride."
      );
    }
  };

  return (
    <div
      ref={panelRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-x-0 bottom-0 bg-white p-6 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.22)] rounded-t-[2rem] border-t border-slate-200 translate-y-full"
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setFinishRidePanelOpen(false);
        }}
        className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-5 cursor-pointer"
      />

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Complete Ride</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Passenger Profile" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 capitalize leading-tight">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">UberGo Passenger</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="mt-1 flex flex-col items-center">
              <i className="ri-map-pin-2-fill text-xl text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop-off Reached</p>
              <h5 className="text-sm font-semibold text-slate-800">{ride?.destination || "Destination"}</h5>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment
              </p>

              <p className="text-sm font-semibold capitalize">
                {ride?.paymentMethod}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fare
              </p>

              <p className="text-2xl font-black text-emerald-600">
                ₹{ride?.fare}
              </p>
            </div>

          </div>
        </div>
      </div>



      {errorMessage && (
        <p className="text-red-500 text-sm font-semibold text-center mb-3">{errorMessage}</p>
      )}

      {/* Action Controls */}
      <div className="flex flex-col gap-2.5 pt-2">
        <button
          onClick={handleFinishRide}
          className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all cursor-pointer shadow-md text-center"
        >
          Finish Ride
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
  );
};

export default FinishRide;