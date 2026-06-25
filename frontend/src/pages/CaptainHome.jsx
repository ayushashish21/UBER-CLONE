import React, { useState } from "react";
import 'remixicon/fonts/remixicon.css';
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup"; 

const CaptainHome = () => {
  const [ridePopupOpen, setRidePopupOpen] = useState(false);

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      <a 
        href="/captain/logout" 
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        aria-label="Log out"
      >
        <i className="ri-logout-box-r-line text-xl" />
      </a>

      <div className="absolute inset-0 h-full w-full z-0">
        <img
          className="w-full h-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTkHb14vVfomlEOWqrpKvN6xHaP6rHYlw0HnrqcTEEw&s=10"
          alt="captain navigation map"
        />
      </div>

      <button 
        onClick={() => setRidePopupOpen(!ridePopupOpen)}
        className="absolute top-20 left-5 z-20 bg-slate-900 text-white text-xs px-3 py-2 rounded-full font-medium shadow-md active:scale-95 transition-all"
      >
        {ridePopupOpen ? "Hide Notification" : "Simulate New Ride Notification"}
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-white px-6 py-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-none border-t border-slate-200">
        <CaptainDetails />
      </div>

      <RidePopup ridePopupOpen={ridePopupOpen} setRidePopupOpen={setRidePopupOpen} />
    </div>
  );
};

export default CaptainHome;