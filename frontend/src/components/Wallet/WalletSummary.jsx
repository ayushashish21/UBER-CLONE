import React from "react";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);

const WalletSummary = ({ today = 0, week = 0, month = 0 }) => {
  const cards = [
    {
      title: "Today",
      value: today,
      icon: "ri-sun-line",
      bg: "from-amber-50 to-white",
      iconColor: "text-amber-600",
    },
    {
      title: "This week",
      value: week,
      icon: "ri-calendar-2-line",
      bg: "from-blue-50 to-white",
      iconColor: "text-blue-600",
    },
    {
      title: "This month",
      value: month,
      icon: "ri-calendar-check-line",
      bg: "from-emerald-50 to-white",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.06 }}
          className={`rounded-2xl bg-gradient-to-br ${card.bg} border border-white/60 shadow-sm p-3`}
        >
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center bg-white shadow-sm ${card.iconColor} mb-2`}
          >
            <i className={`${card.icon} text-base`} />
          </div>

          <p className="text-[11px] font-medium text-slate-500 leading-tight">
            {card.title}
          </p>

          <p className="mt-1 text-base font-bold text-slate-900 truncate">
            ₹{formatCurrency(card.value)}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default WalletSummary;