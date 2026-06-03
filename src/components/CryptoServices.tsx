"use client";

import { Shield, Wallet, Repeat } from "lucide-react";

export default function CryptoServices() {
  return (
    <section className="py-32 bg-[#080808] text-white relative z-20">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">
              Financial Infrastructure
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
              Institutional <br />
              <span className="text-gray-600">Trading &amp; Storage</span>
            </h3>
          </div>
          <p className="text-gray-500 font-medium max-w-sm mb-2 text-sm leading-relaxed">
            Beyond mining, Apps Miner offers an enterprise-grade crypto trading house and hybrid hot/cold wallet service.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trading House */}
          <div className="glass-card-dark p-10 md:p-14 group">
            <Repeat size={36} className="text-[#00f2ff] mb-10" />
            <h4 className="text-3xl font-black mb-4 tracking-tight text-white">Crypto Trading House</h4>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              Execute high-volume trades with zero slippage. Our matching engine handles millions of
              transactions per second, providing diamond-grade liquidity.
            </p>
            <ul className="space-y-4 mb-12">
              {["0.05% Maker/Taker Fees", "Direct Mining Pool Integration", "API Access for Quants"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                  <span className="text-sm font-bold text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-4 bg-white text-black hover:bg-[#00f2ff] rounded-full text-[11px] font-black tracking-widest uppercase transition-colors w-full hover:scale-[1.02] transition-all">
              Enter Exchange
            </button>
          </div>

          {/* Hybrid Wallets */}
          <div className="glass-card-dark p-10 md:p-14 group">
            <Wallet size={36} className="text-[#00f2ff] mb-10" />
            <h4 className="text-3xl font-black mb-4 tracking-tight text-white">Hybrid Wallet Services</h4>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              The ultimate balance of accessibility and security. Keep operating funds in our Multi-Sig
              Hot Wallets while your bulk assets are air-gapped in deep Cold Storage vaults.
            </p>
            <ul className="space-y-4 mb-12">
              {["$150M Insurance Policy", "Geographically Distributed Nodes", "Instant Hot-to-Cold Sweeps"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                  <span className="text-sm font-bold text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-4 bg-white text-black hover:bg-[#00f2ff] rounded-full text-[11px] font-black tracking-widest uppercase transition-colors w-full hover:scale-[1.02] transition-all">
              Open Vault
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
