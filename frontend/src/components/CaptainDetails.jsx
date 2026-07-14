import React from "react";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import AnimatedNumber from "./AnimatedNumber";
import { useNavigate } from "react-router-dom";

const CaptainDetails = ({ captain, dashboard }) => {

  const navigate = useNavigate();

  if (!captain || !dashboard) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-12 rounded-2xl bg-gray-200"></div>
        <div className="space-y-2.5">
          <div className="h-16 rounded-2xl bg-gray-200"></div>
          <div className="h-16 rounded-2xl bg-gray-200"></div>
          <div className="h-16 rounded-2xl bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-14 rounded-2xl bg-gray-200"></div>
          <div className="h-14 rounded-2xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const formatDistance = (value = 0) => {
    if (value >= 1000000) return { num: (value / 1000000).toFixed(2), unit: "M km" };
    if (value >= 1000) return { num: (value / 1000).toFixed(1), unit: "k km" };
    return { num: value.toFixed(1), unit: "km" };
  };

  const distance = formatDistance(dashboard.totalDistance || 0);

  const cards = [
    {
      title: "Total Rides",
      icon: "ri-road-map-line",
      iconColor: "text-slate-900",
      bg: "from-slate-50 to-white",
      render: () => <AnimatedNumber value={dashboard.totalRides || 0} />,
    },
    {
      title: "Earnings",
      icon: "ri-money-rupee-circle-line",
      iconColor: "text-emerald-600",
      bg: "from-emerald-50 to-white",
      render: () => (
        <AnimatedNumber
          value={dashboard.totalEarnings || 0}
          prefix="₹"
          formatter={(v) =>
            new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)
          }
        />
      ),
    },
    {
      title: "Distance",
      icon: "ri-route-line",
      iconColor: "text-blue-600",
      bg: "from-blue-50 to-white",
      render: () => (
        <span>
          {distance.num}
          <span className="text-sm font-semibold text-slate-500 ml-1">{distance.unit}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Drag handle */}
      <div className="flex justify-center mb-3">
        <div className="w-10 h-1 rounded-full bg-gray-300"></div>
      </div>

      {/* Captain header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-900 to-black ring-2 ring-white shadow flex items-center justify-center text-white text-lg font-bold uppercase">
              {captain.fullname.firstname.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>

          <div>
            <h2 className="text-lg font-bold capitalize leading-tight">
              {captain.fullname.firstname} {captain.fullname.lastname}
            </h2>

            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[11px] font-semibold">
                ⭐ 4.9
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold capitalize">
                {captain.vehicle.vehicleType}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
                Online
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="space-y-2.5">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className={`rounded-2xl bg-gradient-to-br ${card.bg} border border-white/60 shadow-sm p-3.5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{card.render()}</h3>
              </div>
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center bg-white shadow-sm ${card.iconColor}`}
              >
                <i className={`${card.icon} text-lg`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions — info cards, mirror dashboard stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 gap-3 mt-4"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/captain-ride-history")}
          className="flex items-center gap-3 h-14 px-3.5 rounded-2xl bg-slate-900 text-white shadow-sm active:shadow-none transition-all"
        >
          <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
            <i className="ri-history-line text-lg"></i>
          </div>
          <div className="text-left leading-tight min-w-0">
            <p className="text-[13px] font-semibold truncate">Ride History</p>
            <p className="text-[11px] text-white/60">
              <AnimatedNumber value={dashboard.totalRides || 0} suffix=" rides" />
            </p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/captain-wallet")}
          className="flex items-center gap-3 h-14 px-3.5 rounded-2xl bg-emerald-600 text-white shadow-sm active:shadow-none transition-all"
        >
          <div className="w-9 h-9 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
            <i className="ri-wallet-3-line text-lg"></i>
          </div>
          <div className="text-left leading-tight min-w-0">
            <p className="text-[13px] font-semibold truncate">Wallet</p>
            <p className="text-[11px] text-white/70">
              <AnimatedNumber
                value={dashboard.totalEarnings || 0}
                prefix="₹"
                formatter={(v) =>
                  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)
                }
              />
            </p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CaptainDetails;