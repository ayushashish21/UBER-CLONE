import React from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const WalletHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-5">
        <button
          onClick={() => navigate("/captain-home")}
          className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>

        <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>

        <div className="w-11"></div>
      </div>
    </div>
  );
};

export default WalletHeader;