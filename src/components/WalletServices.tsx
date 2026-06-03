"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Snowflake, Shield, Lock, Zap, CheckCircle2,
  ArrowRight, Eye, EyeOff, ChevronDown
} from "lucide-react";

const WALLET_TYPES = [
  {
    id: "hot",
    icon: Flame,
    accentColor: "#f97316",
    glowColor: "rgba(249,115,22,0.15)",
    label: "Hot Wallet",
    subtitle: "Instant Access",
    description:
      "Multi-signature hot wallets for daily operations. Funds stay liquid and accessible 24/7 while protected by enterprise-grade security.",
    balance: "4.2831 BTC",
    usd: "$274,139",
    stats: [
      { label: "Max Balance",  value: "$500K" },
      { label: "Tx Speed",     value: "< 2s" },
      { label: "Signatories",  value: "3 of 5 Multi-Sig" },
    ],
    features: [
      "Multi-signature authorization",
      "Real-time transaction monitoring",
      "Instant settlement to exchange",
      "Auto-sweep to cold at threshold",
    ],
    cta: "Access Hot Wallet",
  },
  {
    id: "cold",
    icon: Snowflake,
    accentColor: "#00f2ff",
    glowColor: "rgba(0,242,255,0.12)",
    label: "Cold Storage",
    subtitle: "Maximum Security",
    description:
      "Air-gapped cold storage vaults for long-term asset protection. Your primary holdings stay offline and beyond any remote attack vector.",
    balance: "38.9210 BTC",
    usd: "$2,491,944",
    stats: [
      { label: "Insurance",  value: "$150M Policy" },
      { label: "Locations",  value: "5 Geographies" },
      { label: "Encryption", value: "AES-256 + HSM" },
    ],
    features: [
      "Air-gapped hardware vaults",
      "Geographically distributed backups",
      "Biometric + hardware key auth",
      "Quarterly third-party audits",
    ],
    cta: "Open Cold Vault",
  },
];

const SECURITY_LAYERS = [
  { icon: Shield,       label: "Multi-Sig (3/5)",         desc: "No single point of compromise" },
  { icon: Lock,         label: "HSM Encryption",           desc: "Hardware Security Module protected" },
  { icon: Zap,          label: "Auto-Sweep Rules",         desc: "Threshold-based cold transfers" },
  { icon: CheckCircle2, label: "$150M Insurance",          desc: "Fully insured holdings" },
];

// Fake balance bar
function BalanceMeter({ hot, cold }: { hot: number; cold: number }) {
  const total = hot + cold;
  const hotPct = (hot / total) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
        <span>Portfolio Allocation</span>
        <span>{total.toFixed(4)} BTC Total</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hotPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full rounded-l-full"
          style={{ background: "linear-gradient(to right, #f97316, #fb923c)" }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${100 - hotPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute right-0 top-0 h-full rounded-r-full"
          style={{ background: "linear-gradient(to left, #00f2ff, #22d3ee)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-black text-gray-500">
        <span className="text-orange-400">🔥 {hotPct.toFixed(0)}% Hot</span>
        <span className="text-[#00f2ff]">❄️ {(100 - hotPct).toFixed(0)}% Cold</span>
      </div>
    </div>
  );
}

export default function WalletServices() {
  const [activeWallet, setActiveWallet] = useState<"hot" | "cold">("hot");
  const [showBalance, setShowBalance] = useState(true);

  const active = WALLET_TYPES.find((w) => w.id === activeWallet)!;
  const Ico = active.icon;

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">Asset Security</h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Hybrid <br /><span className="text-gray-600">Wallet System</span>
            </h3>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed font-medium">
              AppsMiner&apos;s layered wallet architecture keeps your liquid funds accessible and your long-term holdings impenetrable.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">

          {/* Left panel — toggle + details */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Wallet toggle tabs */}
            <div className="glass-card p-1.5 flex gap-1">
              {WALLET_TYPES.map((w) => {
                const WIco = w.icon;
                const isActive = activeWallet === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setActiveWallet(w.id as "hot" | "cold")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive ? "text-black" : "text-gray-600 hover:text-gray-400"
                    }`}
                    style={isActive ? { background: w.accentColor } : {}}
                  >
                    <WIco size={14} />
                    {w.label}
                  </button>
                );
              })}
            </div>

            {/* Balance card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWallet}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-6"
                style={{ boxShadow: `0 0 40px ${active.glowColor}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${active.accentColor}22` }}>
                      <Ico size={16} style={{ color: active.accentColor }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{active.label}</p>
                      <p className="text-xs font-bold text-gray-400">{active.subtitle}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBalance((v) => !v)} className="text-gray-600 hover:text-white transition-colors">
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <p className="text-3xl font-black mb-1" style={{ color: active.accentColor }}>
                  {showBalance ? active.balance : "••••• BTC"}
                </p>
                <p className="text-gray-600 text-sm font-bold mb-6">
                  {showBalance ? active.usd : "$•••,•••"}
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {active.stats.map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">{s.label}</p>
                      <p className="text-xs font-black text-white">{s.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ background: active.accentColor, color: "#000" }}
                >
                  {active.cta} <ArrowRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Allocation meter */}
            <div className="glass-card p-5">
              <BalanceMeter hot={4.2831} cold={38.921} />
            </div>
          </div>

          {/* Right panel — features + security */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Feature list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`feat-${activeWallet}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 flex-1"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">{active.label} — Features</p>
                <p className="text-gray-400 leading-relaxed mb-8 text-sm">{active.description}</p>
                <ul className="space-y-4">
                  {active.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${active.accentColor}22` }}>
                        <CheckCircle2 size={12} style={{ color: active.accentColor }} />
                      </div>
                      <span className="text-sm font-bold text-gray-300">{f}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Security layers */}
            <div className="glass-card p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-5">Security Architecture</p>
              <div className="grid grid-cols-2 gap-3">
                {SECURITY_LAYERS.map((l) => (
                  <motion.div
                    key={l.label}
                    whileHover={{ scale: 1.03, borderColor: "rgba(0,242,255,0.3)" }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/8 cursor-default"
                  >
                    <l.icon size={18} className="text-[#00f2ff] mb-2" />
                    <p className="text-xs font-black text-white mb-0.5">{l.label}</p>
                    <p className="text-[10px] text-gray-600">{l.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
