import React from 'react';
import 'remixicon/fonts/remixicon.css';

const CaptainDetails = ({ captain }) => {
  if (!captain) {
    return <div className="text-center py-4">Loading driver details...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-900 border-2 border-slate-200 flex items-center justify-center text-white text-xl font-bold uppercase shadow-sm relative">
            {captain.fullname?.firstname?.[0] || 'C'}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-slate-900 capitalize tracking-wide">
              {captain.fullname?.firstname} {captain.fullname?.lastname}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
               <i className="ri-star-fill text-amber-400"></i> 4.9 • Captain
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm mt-4">
        <div className="text-center flex-1">
          <i className="ri-steering-2-line text-xl font-light text-slate-500 mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rides</p>
          <h5 className="text-lg font-black text-slate-900">12</h5>
        </div>
        
        <div className="text-center flex-1 border-x border-slate-200">
          <i className="ri-money-rupee-circle-line text-xl font-light text-slate-500 mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earned</p>
          <h5 className="text-lg font-black text-emerald-600">₹2,450</h5>
        </div>
        
        <div className="text-center flex-1">
          <i className="ri-map-pin-time-line text-xl font-light text-slate-500 mb-1" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distance</p>
          <h5 className="text-lg font-black text-slate-900">64 Km</h5>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;