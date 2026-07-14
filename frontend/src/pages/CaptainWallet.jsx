import React, { useEffect, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import WalletHeader from "../components/Wallet/WalletHeader";
import BalanceCard from "../components/Wallet/BalanceCard";
import WalletSummary from "../components/Wallet/WalletSummary";
import EarningsChart from "../components/Wallet/EarningsChart";
import TransactionHistory from "../components/Wallet/TransactionHistory";
import WalletSkeleton from "../components/Wallet/WalletSkeleton";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);

// paymentMethod icon/color per method — extend this if the schema ever
// grows beyond "cash" / "online" (the mockup mentioned a third "Wallet"
// method, but that isn't a real paymentMethod value in ride.model yet).
const paymentMeta = {
  cash: { icon: "ri-money-rupee-circle-line", color: "text-emerald-600" },
  online: { icon: "ri-bank-card-line", color: "text-blue-600" },
};

const CaptainWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchWallet = async () => {
      setLoading(true);

      try {
        // NOTE: same assumption as CaptainRideHistory.jsx — the captain's
        // JWT is read from localStorage under "token". Update this if
        // CaptainContext stores it under a different key.
        const token = localStorage.getItem("token");

        const params = { range: selectedRange };
        if (selectedRange === "custom") {
          if (customStart) params.startDate = customStart;
          if (customEnd) params.endDate = customEnd;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/captain-wallet`,
          {
            params,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!cancelled) setWallet(data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (!cancelled) setWallet(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Don't refetch on every keystroke while picking a custom range —
    // wait until both dates are set.
    if (selectedRange !== "custom" || (customStart && customEnd)) {
      fetchWallet();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedRange, customStart, customEnd]);

  if (loading || !wallet) {
    return (
      <div className="min-h-screen bg-slate-50">
        <WalletHeader />
        <WalletSkeleton />
      </div>
    );
  }

  const paymentEntries = Object.entries(wallet.paymentBreakdown || {});

  return (
    <div className="min-h-screen bg-slate-50">
      <WalletHeader />

      <div className="px-5 py-4 space-y-4">
        <BalanceCard balance={wallet.availableBalance} />

        <WalletSummary
          today={wallet.todayEarnings}
          week={wallet.weekEarnings}
          month={wallet.monthEarnings}
        />

        <EarningsChart data={wallet.chart} />

        {paymentEntries.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Payment breakdown</h3>
            <div className="space-y-2.5">
              {paymentEntries.map(([method, amount]) => {
                const meta = paymentMeta[method] || {
                  icon: "ri-wallet-line",
                  color: "text-slate-500",
                };
                return (
                  <div key={method} className="flex items-center justify-between">
                    <span className="capitalize text-sm text-slate-600 flex items-center gap-2">
                      <i className={`${meta.icon} ${meta.color}`}></i>
                      {method}
                    </span>
                    <span className="font-semibold text-slate-900">
                      ₹{formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <TransactionHistory
          transactions={wallet.transactions}
          search={search}
          setSearch={setSearch}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
        />
      </div>
    </div>
  );
};

export default CaptainWallet;