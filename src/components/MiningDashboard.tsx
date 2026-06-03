"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Zap, Cpu, BarChart3, Hash } from "lucide-react";

// Simulated live data
function generateHashrateData(points: number) {
  const data: { time: string; value: number }[] = [];
  let val = 180;
  for (let i = points; i >= 0; i--) {
    val = Math.max(120, Math.min(220, val + (Math.random() - 0.48) * 12));
    const d = new Date(Date.now() - i * 5000);
    data.push({
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      value: Math.round(val * 10) / 10,
    });
  }
  return data;
}

function generateEarningsData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({ day: d, btc: +(Math.random() * 0.004 + 0.001).toFixed(5) }));
}

const EFFICIENCY_DATA = [
  { label: "T200 Pro", pct: 94, color: "#00f2ff" },
  { label: "F100 Pro", pct: 88, color: "#7c3aed" },
  { label: "F50 Pro",  pct: 82, color: "#f59e0b" },
  { label: "Mini",     pct: 71, color: "#10b981" },
  { label: "Nano",     pct: 65, color: "#f97316" },
];

// ─── Live Sparkline SVG ──────────────────────────────────────
function Sparkline({ data }: { data: { time: string; value: number }[] }) {
  const W = 600; const H = 120;
  const min = Math.min(...data.map((d) => d.value)) - 10;
  const max = Math.max(...data.map((d) => d.value)) + 10;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.value - min) / (max - min)) * H;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `0,${H} ` + polyline + ` ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkGrad)" />
      <polyline points={polyline} fill="none" stroke="#00f2ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Latest value dot */}
      {pts.length > 0 && (() => {
        const [x, y] = pts[pts.length - 1].split(",").map(Number);
        return (
          <circle cx={x} cy={y} r="4" fill="#00f2ff">
            <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        );
      })()}
    </svg>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────
function BarChart({ data }: { data: { day: string; btc: number }[] }) {
  const max = Math.max(...data.map((d) => d.btc));
  return (
    <div className="flex items-end gap-2 h-full w-full">
      {data.map((d, i) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
            style={{ height: `${(d.btc / max) * 100}%`, transformOrigin: "bottom" }}
            className="w-full rounded-t-lg"
            title={`${d.btc} BTC`}
          >
            <div
              className="w-full h-full rounded-t-lg"
              style={{ background: `linear-gradient(to top, #00f2ff44, #00f2ff)` }}
            />
          </motion.div>
          <span className="text-[9px] font-black text-gray-600 uppercase">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Radial efficiency gauge ─────────────────────────────────
function Gauge({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 28; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
          <motion.circle
            cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">
          {pct}%
        </span>
      </div>
      <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider text-center">{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function MiningDashboard() {
  const [hashrateData, setHashrateData] = useState(() => generateHashrateData(30));
  const [earningsData] = useState(() => generateEarningsData());
  const [liveHashrate, setLiveHashrate] = useState(hashrateData[hashrateData.length - 1]?.value ?? 180);
  const [uptime, setUptime] = useState(99.94);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Push a new data point every 2s to simulate live feed
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHashrateData((prev) => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(120, Math.min(220, last + (Math.random() - 0.48) * 10));
        const rounded = Math.round(next * 10) / 10;
        setLiveHashrate(rounded);
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return [...prev.slice(-40), { time, value: rounded }];
      });
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const STATS = [
    { icon: Hash,       label: "Live Hashrate",   value: `${liveHashrate} TH/s`, color: "#00f2ff" },
    { icon: Zap,        label: "Power Draw",       value: "4,850 W",              color: "#f59e0b" },
    { icon: Cpu,        label: "Active Devices",   value: "12 / 12",              color: "#10b981" },
    { icon: TrendingUp, label: "Today's Earnings", value: "0.00341 BTC",          color: "#7c3aed" },
  ];

  return (
    <section className="py-24 bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">Live Operations</h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Mining <br /><span className="text-gray-600">Dashboard</span>
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">All Systems Online</span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="glass-card p-5 group cursor-default"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">

          {/* Hashrate sparkline — spans 2 cols */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Network Hashrate</p>
                <p className="text-2xl font-black text-[#00f2ff] tabular-nums">{liveHashrate} TH/s</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Activity size={14} className="animate-pulse" />
                LIVE
              </div>
            </div>
            <div className="h-32">
              <Sparkline data={hashrateData} />
            </div>
          </div>

          {/* Weekly earnings bar chart */}
          <div className="glass-card p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Weekly Earnings</p>
            <p className="text-xl font-black text-[#00f2ff] mb-4">BTC / Day</p>
            <div className="h-32">
              <BarChart data={earningsData} />
            </div>
          </div>
        </div>

        {/* Second Row: Efficiency gauges + Uptime */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Device efficiency gauges */}
          <div className="lg:col-span-2 glass-card p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Device Efficiency</p>
            <div className="flex flex-wrap items-center justify-around gap-6">
              {EFFICIENCY_DATA.map((e) => (
                <Gauge key={e.label} pct={e.pct} color={e.color} label={e.label} />
              ))}
            </div>
          </div>

          {/* Uptime card */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">System Uptime</p>
              <p className="text-5xl font-black text-white tabular-nums">{uptime.toFixed(2)}<span className="text-2xl text-gray-500">%</span></p>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: "Cluster A — BTC",  status: "Optimal",  ok: true },
                { label: "Cluster B — DOGE", status: "Optimal",  ok: true },
                { label: "Cluster C — LTC",  status: "Throttled",ok: false },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">{c.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.ok ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
