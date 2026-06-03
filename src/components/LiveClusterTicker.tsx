"use client";

import { Activity, Zap } from "lucide-react";

const NODES = [
  { symbol: "BTC", color: "text-[#F7931A]", hashrate: "982.50 TH/s", diff: "4,200,000" },
  { symbol: "DOGE", color: "text-[#C2A633]", hashrate: "145.20 TH/s", diff: "1,150,000" },
  { symbol: "ETH", color: "text-[#627EEA]", hashrate: "56.40 TH/s", diff: "2,840,000" },
  { symbol: "LTC", color: "text-[#345D9D]", hashrate: "89.10 TH/s", diff: "3,100,000" },
  { symbol: "XMR", color: "text-[#FF6600]", hashrate: "12.30 TH/s", diff: "800,000" },
  { symbol: "SOL", color: "text-[#14F195]", hashrate: "430.00 TH/s", diff: "5,500,000" },
  { symbol: "KAS", color: "text-[#70C1B3]", hashrate: "32.10 TH/s", diff: "450,000" },
  { symbol: "BCH", color: "text-[#8BC34A]", hashrate: "115.80 TH/s", diff: "1,800,000" },
];

export default function LiveClusterTicker() {
  const tickerItems = [...NODES, ...NODES, ...NODES]; // duplicate for loop

  return (
    <section className="bg-black border-t border-primary/20 overflow-hidden py-3 select-none flex relative">
      <div className="bg-primary px-4 py-1 flex items-center gap-2 z-10 shadow-[5px_0_20px_rgba(0,242,255,0.3)] absolute left-0 h-full">
        <Activity size={14} className="text-black animate-pulse" />
        <span className="text-black font-black text-[10px] uppercase tracking-tighter">Live Mining Cluster</span>
      </div>
      <div className="flex whitespace-nowrap items-center ticker-track w-max pl-56">
        {tickerItems.map((node, i) => (
          <div key={i} className="flex items-center gap-6 px-6">
            <div className="flex items-center gap-2">
              <span className={`font-black text-xs ${node.color}`}>{node.symbol}</span>
              <span className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">Active Nodes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-gray-500 text-[8px] uppercase font-black tracking-widest text-left">Hashrate</span>
                <span className="text-primary font-mono text-xs tabular-nums text-left">{node.hashrate}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[8px] uppercase font-black tracking-widest text-left">Target Diff</span>
                <span className="text-white font-mono text-xs tabular-nums text-left">{node.diff}</span>
              </div>
              <Zap size={10} className="text-accent-light animate-bounce" />
            </div>
            <div className="w-1 h-1 bg-primary rotate-45 mx-2"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
