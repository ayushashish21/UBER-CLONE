import React from "react";
import 'remixicon/fonts/remixicon.css';

const CaptainDetails = () => {
  return (
    <div className="w-full bg-white flex flex-col gap-5">
      <div className="flex items-center justify-between w-full">
        <div className="text-left">
          <h5 className="font-bold text-lg tracking-wide text-slate-900">Arjun Sharma</h5>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-semibold">
            <i className="ri-star-fill text-amber-500" /> 4.9 <span className="text-slate-300">•</span> Captain
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <img 
            className="h-14 w-14 rounded-full border-2 border-slate-200 object-cover shadow-sm"
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
            alt="Captain Arjun Sharma" 
          />
          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-200" />

      <div className="flex items-center justify-between text-center bg-slate-50 rounded-2xl py-4 px-2 border border-slate-200">
        <div className="flex flex-col items-center flex-1">
          <div className="h-8 w-8 rounded-full bg-slate-200/60 flex items-center justify-center mb-1">
            <i className="ri-speed-up-line text-slate-600 text-base" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider scale-90">Rides</p>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">12</h4>
        </div>

        <div className="h-8 w-[1px] bg-slate-200" />

        <div className="flex flex-col items-center flex-1">
          <div className="h-8 w-8 rounded-full bg-slate-200/60 flex items-center justify-center mb-1">
            <i className="ri-money-rupee-circle-line text-slate-600 text-base" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider scale-90">Earned</p>
          <h4 className="text-base font-black text-emerald-600 mt-0.5">₹2,450</h4>
        </div>

        <div className="h-8 w-[1px] bg-slate-200" />

        <div className="flex flex-col items-center flex-1">
          <div className="h-8 w-8 rounded-full bg-slate-200/60 flex items-center justify-center mb-1">
            <i className="ri-road-map-line text-slate-600 text-base" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider scale-90">Distance</p>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">64<span className="text-xs font-semibold text-slate-500 ml-0.5">Km</span></h4>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;