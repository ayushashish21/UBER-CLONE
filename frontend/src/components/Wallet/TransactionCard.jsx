import React from "react";
import "remixicon/fonts/remixicon.css";

const statusStyle = {
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  cancelled: "bg-red-100 text-red-700 border border-red-300",
};

const paymentIcon = {
  cash: "ri-money-rupee-circle-line",
  online: "ri-bank-card-line",
};

const formatRelative = (date) => {
  if (!date) return "--";

  const d = new Date(date);
  const now = new Date();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  if (sameDay(d, now)) return `Today • ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return `Yesterday • ${time}`;

  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • ${time}`;
};

const TransactionCard = ({ transaction }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm uppercase">
            {transaction.passenger?.charAt(0) || "?"}
          </div>

          <div>
            <p className="font-semibold text-sm">{transaction.passenger}</p>
            <p className="text-xs text-slate-400">{formatRelative(transaction.date)}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-slate-900">₹{transaction.amount}</p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
              statusStyle[transaction.status] || "bg-slate-100 text-slate-600"
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-start gap-1.5 mb-1">
        <i className="ri-map-pin-2-fill text-green-600 mt-0.5"></i>
        <span className="truncate">{transaction.pickup}</span>
      </div>

      <div className="text-xs text-slate-500 flex items-start gap-1.5">
        <i className="ri-map-pin-fill text-red-500 mt-0.5"></i>
        <span className="truncate">{transaction.destination}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 capitalize">
        <i className={paymentIcon[transaction.paymentMethod] || "ri-wallet-line"}></i>
        {transaction.paymentMethod}
      </div>
    </div>
  );
};

export default TransactionCard;