import React from "react";
import "remixicon/fonts/remixicon.css";
import TransactionCard from "./TransactionCard";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Custom", value: "custom" },
];

// Range filtering already happened server-side (see getCaptainWallet) — the
// `transactions` prop arriving here is already scoped to selectedRange.
// Search stays client-side since it's just a substring match over a page
// of data that's already in memory.
const TransactionHistory = ({
  transactions = [],
  search,
  setSearch,
  selectedRange,
  setSelectedRange,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
}) => {
  const visible = transactions.filter((t) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();

    return (
      t.passenger?.toLowerCase().includes(q) ||
      t.pickup?.toLowerCase().includes(q) ||
      t.destination?.toLowerCase().includes(q) ||
      String(t.id).toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900">Transactions</h3>
        <span className="text-xs text-slate-400">
          {visible.length} {visible.length === 1 ? "ride" : "rides"}
        </span>
      </div>

      <div className="relative mb-3">
        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search passenger, location, transaction ID..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto mb-2 scrollbar-hide">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => setSelectedRange(r.value)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all duration-300 ${
              selectedRange === r.value
                ? "bg-black text-white shadow"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {selectedRange === "custom" && (
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-black"
          />
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>
      )}

      {visible.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">
          No transactions match this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <TransactionCard key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;