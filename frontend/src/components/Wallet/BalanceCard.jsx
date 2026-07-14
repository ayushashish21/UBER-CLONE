import React from "react";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);

const BalanceCard = ({ balance = 0 }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-black text-white p-5 shadow-lg">
      <p className="text-sm text-white/60">Available balance</p>
      <h2 className="text-3xl font-bold mt-1">₹{formatCurrency(balance)}</h2>
    </div>
  );
};

export default BalanceCard;