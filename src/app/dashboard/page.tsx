"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, Wallet, Cpu, LogOut, Shield, 
  Settings, Bell, ChevronRight, User, Terminal
} from "lucide-react";
import MiningDashboard from "@/components/MiningDashboard";
import WalletServices from "@/components/WalletServices";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "mining" | "wallet" | "settings">("overview");

  // In production, you would fetch user session details from the database here
  const [user, setUser] = useState({
    name: "Enterprise Operator #402",
    email: "operator@appsminer.com",
    role: "System Administrator",
    joined: "June 2026",
    avatar: "/Products/icon blue.png"
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-[#070707] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-6 gap-8 z-20">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <Image
              src="/Products/icon blue.png"
              alt="AppsMiner"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-black tracking-tighter text-white block leading-none">APPSMINER</span>
            <span className="text-[9px] font-bold text-[#00f2ff] tracking-widest uppercase">Secured Terminal</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20">
            <User size={18} className="text-[#00f2ff]" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-black text-white truncate">{user.name}</h4>
            <p className="text-[10px] text-gray-500 font-medium truncate">{user.role}</p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "overview" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={14} />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab("mining")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "mining" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cpu size={14} />
            Mining Progress
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "wallet" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wallet size={14} />
            Wallet Status
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "settings" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings size={14} />
            Terminal Settings
          </button>
        </nav>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase px-2">
            <span className="flex items-center gap-1.5"><Shield size={10} className="text-emerald-500" /> Secure Link</span>
            <span>v2.4.0</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 text-red-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#030303] overflow-y-auto relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00f2ff]/3 rounded-full blur-[100px] pointer-events-none" />

        {/* Dashboard Header Banner */}
        <div className="border-b border-white/5 px-6 py-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050505]/40 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
              {activeTab === "overview" && "Operator Terminal Overview"}
              {activeTab === "mining" && "Live Mining Infrastructure"}
              {activeTab === "wallet" && "Asset Allocation Vault"}
              {activeTab === "settings" && "Terminal Settings"}
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              Secure Session ID: <span className="text-white/80 font-mono">session_ams_0994cf8e23b</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Network Online</span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-6 md:p-10">
          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 bg-[#00f2ff] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Aggregate Hashrate</p>
                  <h3 className="text-3xl font-black text-white">415.82 TH/s</h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <span>+12.4% vs last hour</span>
                  </div>
                </div>

                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 bg-amber-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Wallet Vault Value</p>
                  <h3 className="text-3xl font-black text-[#00f2ff]">$2,766,083 USD</h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-bold">
                    <span>43.2041 BTC total</span>
                  </div>
                </div>

                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                  <div className="absolute top-0 left-0 h-1 bg-emerald-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Active Node Clusters</p>
                  <h3 className="text-3xl font-black text-white">5 / 5 Systems</h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <span>All operational (99.99%)</span>
                  </div>
                </div>
              </div>

              {/* Quick links to details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveTab("mining")}
                  className="glass-card p-8 border border-white/5 hover:border-[#00f2ff]/30 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-colors">
                      <Cpu size={20} />
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">Manage Mining Nodes</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">View real-time efficiency metrics, adjust performance profiles, and check active system telemetry.</p>
                </div>

                <div 
                  onClick={() => setActiveTab("wallet")}
                  className="glass-card p-8 border border-white/5 hover:border-[#00f2ff]/30 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-colors">
                      <Wallet size={20} />
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">Access Secure Wallets</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Review hot and cold wallet allocations, access transaction logs, and configure security thresholds.</p>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="glass-card p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <Terminal size={14} className="text-[#00f2ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security event log</span>
                </div>
                <div className="font-mono text-[11px] text-gray-500 space-y-2">
                  <p><span className="text-gray-700">[22:34:10]</span> SECURE SOCKET ESTABLISHED WITH CLIENT (IP: 192.168.1.109)</p>
                  <p><span className="text-gray-700">[22:35:12]</span> HASH NODE #3 AUTOSCALED. LOAD: 89.2% EFFICIENCY: 99.8%</p>
                  <p><span className="text-[#00f2ff]/80">[22:38:00]</span> AUTO-SWEEP RULE CHECK: BALANCES ARE BELOW TRANSITION THRESHOLD</p>
                  <p><span className="text-gray-700">[22:38:58]</span> CLIENT REQUESTS TRANSLATION ENGINE TO DEPLOY OVER MULTI-LOCALE PATHS</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mining" && (
            <div className="space-y-6">
              <div className="glass-card p-2 border border-white/5 bg-[#050505]/40">
                <MiningDashboard />
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="glass-card p-2 border border-white/5 bg-[#050505]/40">
                <WalletServices />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8 py-4">
              <div className="glass-card p-8 space-y-6 border border-white/5">
                <h3 className="text-lg font-black uppercase tracking-tight">Operator Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold">Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] text-gray-500">Requires a security key on every authentication request.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00f2ff] rounded-full p-1 cursor-pointer flex items-center justify-end">
                      <div className="w-4 h-4 rounded-full bg-black" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold">Auto-Sweep to Cold Storage</p>
                      <p className="text-[10px] text-gray-500">Sweeps hot wallet funds to cold vault above 5.0 BTC.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00f2ff] rounded-full p-1 cursor-pointer flex items-center justify-end">
                      <div className="w-4 h-4 rounded-full bg-black" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-xs font-bold">Real-time Node Alerts</p>
                      <p className="text-[10px] text-gray-500">SMS alerts if aggregate node hashrate drops below 300 TH/s.</p>
                    </div>
                    <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer flex items-center justify-start">
                      <div className="w-4 h-4 rounded-full bg-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
