import React from "react";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);

// Hand-rolled SVG chart rather than pulling in recharts/chart.js — keeps this
// dependency-free. Swap the <svg> block below for a chart library if you'd
// rather standardize on one across the app.
const EarningsChart = ({ data = [] }) => {
  const width = 300;
  const height = 150;
  const padding = { top: 16, right: 8, bottom: 8, left: 8 };

  const values = data.map((d) => d.amount);
  const max = Math.max(1, ...values);

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x =
      padding.left +
      (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2);
    const y = padding.top + plotHeight - (d.amount / max) * plotHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + plotHeight).toFixed(1)} Z`
      : "";

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-900">Earnings</h3>
        <span className="text-xs text-slate-400">Last 7 days</span>
      </div>

      <p className="text-2xl font-bold text-slate-900 mb-4">
        ₹{formatCurrency(total)}
      </p>

      {total === 0 ? (
        <div className="h-36 flex items-center justify-center text-sm text-slate-400">
          No earnings in this period yet.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-36"
          preserveAspectRatio="none"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + plotHeight * f}
              y2={padding.top + plotHeight * f}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#earningsGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#059669"
              stroke="white"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      )}

      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[11px] text-slate-400 flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EarningsChart;