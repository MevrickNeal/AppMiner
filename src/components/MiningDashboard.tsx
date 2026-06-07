"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Zap, Cpu, BarChart3, Hash, Thermometer, Wind, Truck, Cloud, Home, Wrench, ShieldCheck, Package } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

// Localized Dashboard Mappings
const DASH_I18N: Record<string, any> = {
  EN: {
    liveOps: "Live Operations",
    mining: "Mining",
    dashboard: "Dashboard",
    allOnline: "All Systems Online",
    liveHashrate: "Live Hashrate",
    powerDraw: "Power Draw",
    activeDevices: "Active Devices",
    todayEarnings: "Today's Earnings",
    networkHashrate: "Network Hashrate",
    weeklyEarnings: "Weekly Earnings",
    deviceEfficiency: "Device Efficiency",
    systemUptime: "System Uptime",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    statusOptimal: "Optimal",
    statusThrottled: "Throttled",
    clusterA: "Cluster A — BTC",
    clusterB: "Cluster B — DOGE",
    clusterC: "Cluster C — LTC",
  },
  AR: {
    liveOps: "العمليات المباشرة",
    mining: "لوحة تحكم",
    dashboard: "التعدين",
    allOnline: "جميع الأنظمة متصلة بالإنترنت",
    liveHashrate: "الهاش المباشر",
    powerDraw: "استهلاك الطاقة",
    activeDevices: "الأجهزة النشطة",
    todayEarnings: "أرباح اليوم",
    networkHashrate: "هاش الشبكة الإجمالي",
    weeklyEarnings: "العائد الأسبوعي",
    deviceEfficiency: "كفاءة الأجهزة",
    systemUptime: "وقت تشغيل النظام",
    days: ["اثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"],
    statusOptimal: "مثالي",
    statusThrottled: "محدود",
    clusterA: "المجموعة أ — بيتكوين",
    clusterB: "المجموعة ب — دوج",
    clusterC: "المجموعة ج — لايتكوين",
  },
  HI: {
    liveOps: "लाइव ऑपरेशन्स",
    mining: "माइनिंग",
    dashboard: "डैशबोर्ड",
    allOnline: "सभी सिस्टम ऑनलाइन हैं",
    liveHashrate: "लाइव हैशरेट",
    powerDraw: "बिजली की खपत",
    activeDevices: "सक्रिय उपकरण",
    todayEarnings: "आज की कमाई",
    networkHashrate: "नेटवर्क हैशरेट",
    weeklyEarnings: "साप्ताहिक कमाई",
    deviceEfficiency: "उपकरण दक्षता",
    systemUptime: "सिस्टम अपटाइम",
    days: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
    statusOptimal: "इष्टतम",
    statusThrottled: "सीमित",
    clusterA: "क्लस्टर ए — BTC",
    clusterB: "क्लस्टर बी — DOGE",
    clusterC: "क्लस्टर सी — LTC",
  },
  DE: {
    liveOps: "Live-Betrieb",
    mining: "Mining-",
    dashboard: "Dashboard",
    allOnline: "Alle Systeme online",
    liveHashrate: "Live-Hashrate",
    powerDraw: "Stromverbrauch",
    activeDevices: "Aktive Geräte",
    todayEarnings: "Heutiger Ertrag",
    networkHashrate: "Netzwerk-Hashrate",
    weeklyEarnings: "Wöchentlicher Ertrag",
    deviceEfficiency: "Geräteeffizienz",
    systemUptime: "System-Uptime",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    statusOptimal: "Optimal",
    statusThrottled: "Gedrosselt",
    clusterA: "Cluster A — BTC",
    clusterB: "Cluster B — DOGE",
    clusterC: "Cluster C — LTC",
  },
  FR: {
    liveOps: "Opérations en Direct",
    mining: "Tableau",
    dashboard: "de Minage",
    allOnline: "Tous les Systèmes en Ligne",
    liveHashrate: "Hashrate en Direct",
    powerDraw: "Consommation",
    activeDevices: "Appareils Actifs",
    todayEarnings: "Gains du Jour",
    networkHashrate: "Hashrate Réseau",
    weeklyEarnings: "Rendement Hebdo",
    deviceEfficiency: "Efficacité Appareil",
    systemUptime: "Uptime Système",
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    statusOptimal: "Optimal",
    statusThrottled: "Limité",
    clusterA: "Cluster A — BTC",
    clusterB: "Cluster B — DOGE",
    clusterC: "Cluster C — LTC",
  },
  ES: {
    liveOps: "Operaciones en Vivo",
    mining: "Panel de",
    dashboard: "Minería",
    allOnline: "Sistemas Online",
    liveHashrate: "Tasa de Hash en Vivo",
    powerDraw: "Consumo Eléctrico",
    activeDevices: "Dispositivos Activos",
    todayEarnings: "Rendimiento Diario",
    networkHashrate: "Tasa de Hash de Red",
    weeklyEarnings: "Rendimiento Semanal",
    deviceEfficiency: "Eficiencia de Dispositivo",
    systemUptime: "Tiempo de Actividad",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    statusOptimal: "Óptimo",
    statusThrottled: "Limitado",
    clusterA: "Clúster A — BTC",
    clusterB: "Clúster B — DOGE",
    clusterC: "Clúster C — LTC",
  },
  BN: {
    liveOps: "লাইভ কার্যক্রম",
    mining: "মাইনিং",
    dashboard: "ড্যাশবোর্ড",
    allOnline: "সকল সিস্টেম অনলাইন রয়েছে",
    liveHashrate: "লাইভ হ্যাশরেট",
    powerDraw: "বিদ্যুৎ খরচ",
    activeDevices: "সক্রিয় ডিভাইস",
    todayEarnings: "আজকের মোট আয়",
    networkHashrate: "নেটওয়ার্ক হ্যাশরেট",
    weeklyEarnings: "সাপ্তাহিক আয়",
    deviceEfficiency: "ডিভাইস কার্যক্ষমতা",
    systemUptime: "সিস্টেম আপটাইম",
    days: ["সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি", "রবি"],
    statusOptimal: "সেরা",
    statusThrottled: "ধীরগতির",
    clusterA: "ক্লাস্টার এ — BTC",
    clusterB: "ক্লাস্টার বি — DOGE",
    clusterC: "ক্লাস্টার সি — LTC",
  }
};

const NODES_I18N: Record<string, any> = {
  EN: {
    connectedNodes: "Your Connected Nodes",
    noNodes: "No nodes connected yet.",
    status: "Status",
    region: "Region",
    power: "Power",
    hashrate: "Hashrate",
  },
  AR: {
    connectedNodes: "العقد المتصلة الخاصة بك",
    noNodes: "لا توجد عقد متصلة بعد.",
    status: "الحالة",
    region: "المنطقة",
    power: "الطاقة",
    hashrate: "الهاش",
  },
  HI: {
    connectedNodes: "आपके कनेक्टेड नोड्स",
    noNodes: "अभी तक कोई नोड कनेक्ट नहीं हुआ है।",
    status: "स्थिति",
    region: "क्षेत्र",
    power: "बिजली",
    hashrate: "हैशरेट",
  },
  DE: {
    connectedNodes: "Ihre verbundenen Knoten",
    noNodes: "Noch keine Knoten verbunden.",
    status: "Status",
    region: "Region",
    power: "Leistung",
    hashrate: "Hashrate",
  },
  FR: {
    connectedNodes: "Vos nœuds connectés",
    noNodes: "Aucun nœud connecté pour le moment.",
    status: "Statut",
    region: "Région",
    power: "Énergie",
    hashrate: "Hashrate",
  },
  ES: {
    connectedNodes: "Tus Nodos Conectados",
    noNodes: "Aún no hay nodos conectados.",
    status: "Estado",
    region: "Región",
    power: "Energía",
    hashrate: "Tasa de Hash",
  },
  BN: {
    connectedNodes: "আপনার সংযুক্ত নোড",
    noNodes: "এখনও কোনো নোড সংযুক্ত নেই।",
    status: "অবস্থা",
    region: "অঞ্চল",
    power: "শক্তি",
    hashrate: "হ্যাশরেট",
  },
};

// Simulated live data generator
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

function generateEarningsData(days: string[]) {
  return days.map((d) => ({ day: d, btc: +(Math.random() * 0.004 + 0.001).toFixed(5) }));
}

// ─── Live Sparkline SVG ──────────────────────────────────────
function Sparkline({ data }: { data: { time: string; value: number }[] }) {
  const W = 600; const H = 120;
  if (!data || data.length === 0) {
    return <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none" />;
  }
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
        const parts = pts[pts.length - 1].split(",");
        const x = Number(parts[0] || 0);
        const y = Number(parts[1] || 0);
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
  if (!data || data.length === 0) return <div className="h-full w-full" />;
  const max = Math.max(...data.map((d) => d.btc)) || 0.005;
  return (
    <div className="flex items-end gap-2 h-full w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
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

// ─── NodeCardComponent ───────────────────────────────────────
function NodeCardComponent({ 
  node, 
  handleRemoteControl, 
  nl 
}: { 
  node: any; 
  handleRemoteControl: (id: string, stat: string) => void; 
  nl: any;
}) {
  const baseHash = parseFloat(node.hashrate) || 0;
  const unit = node.hashrate.replace(/[0-9.]/g, "").trim() || "TH/s";
  
  const [fluctuatedHash, setFluctuatedHash] = useState(node.status === "online" ? baseHash : 0);
  const [temp, setTemp] = useState(node.status === "online" ? 70.4 : 32.0);
  const [fan, setFan] = useState(node.status === "online" ? 4180 : 0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (node.status === "online") {
        // Fluctuate hashrate by ±1.5% for live physics feel
        const variance = (Math.random() - 0.5) * 0.03 * baseHash;
        setFluctuatedHash(Number((baseHash + variance).toFixed(2)));
        
        // Warm up or hover temperature between 68.0°C and 74.0°C
        setTemp(prev => {
          if (prev < 68) return prev + 2.5;
          return 70 + (Math.random() - 0.5) * 2;
        });

        // Warm up or hover fan speed between 3800 and 4400 RPM
        setFan(prev => {
          if (prev < 3800) return prev + 350;
          return 4100 + Math.round((Math.random() - 0.5) * 120);
        });
      } else {
        // Drop hashrate to 0 instantly
        setFluctuatedHash(0);
        
        // Cooling down to room temp
        setTemp(prev => {
          if (prev > 34) return prev - 2.0;
          return 32.0;
        });

        // Stop fans spinning
        setFan(prev => {
          if (prev > 0) return Math.max(0, prev - 450);
          return 0;
        });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [node.status, baseHash]);

  const conditionText = () => {
    if (node.status === "online") return "Optimal Performance";
    if (node.status === "paused") return "Mining Paused (Standby)";
    if (node.status === "shutdown") return "System Offline";
    return "Pool Handshake Active";
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h5 className="text-lg font-black text-white">{node.productName}</h5>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">{node.id.slice(0, 8)}...</p>
              <span className="text-gray-700 font-black text-[9px]">•</span>
              <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                node.hosting_type === "physical" ? "text-emerald-400" : "text-[#00f2ff]/80"
              }`}>
                {node.hosting_type === "physical" ? (
                  <><Home size={10} /> Local Connection</>
                ) : (
                  <><Cloud size={10} /> Remote Hosted</>
                )}
              </span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
            node.status === "online" 
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
              : node.status === "paused" 
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" 
                : node.status === "shutdown"
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              node.status === "online" 
                ? "bg-emerald-400 animate-pulse" 
                : node.status === "paused" 
                  ? "bg-amber-400" 
                  : node.status === "shutdown"
                    ? "bg-red-400"
                    : "bg-[#00f2ff] animate-ping"
            }`} />
            {node.status === "activating" ? (
              <>
                {(() => {
                  const elapsed = Date.now() - new Date(node.created_at || Date.now()).getTime();
                  const remaining = Math.max(0, Math.ceil((120000 - elapsed) / 1000));
                  return remaining > 0 ? `Activating (${remaining}s)` : "Online";
                })()}
              </>
            ) : (
              node.status
            )}
          </div>
        </div>
        
        {/* Real-time physics telemetry */}
        <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/5">
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{nl.hashrate}</p>
            <p className="text-sm font-black text-white font-mono">{node.status === "online" ? `${fluctuatedHash.toFixed(2)} ${unit}` : `0.00 ${unit}`}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{nl.power}</p>
            <p className="text-sm font-black text-white font-mono">{node.status === "online" ? node.power : "0 W"}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer size={14} className="text-[#00f2ff]/60" />
            <div>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Core Temp</p>
              <p className={`text-xs font-black font-mono ${temp > 72 ? "text-amber-400" : "text-white"}`}>
                {temp.toFixed(1)}°C
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} className="text-[#00f2ff]/60" />
            <div>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Fan Speed</p>
              <p className="text-xs font-black text-white font-mono">{fan.toLocaleString()} RPM</p>
            </div>
          </div>
          <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
            <div>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Status Telemetry</p>
              <p className="text-[10px] font-bold text-[#00f2ff]/80 uppercase tracking-wider">{conditionText()}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Yield Rate</p>
              <p className={`text-[10px] font-black uppercase tracking-wider ${
                node.hosting_type === "remote" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {node.hosting_type === "remote" ? "85% (-15% Fee)" : "100% Yield"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Remote Controls */}
      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
        {node.status === "online" && (
          <>
            <button
              onClick={() => handleRemoteControl(node.id, "paused")}
              className="flex-1 py-1.5 px-3 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider transition-colors"
            >
              Pause
            </button>
            <button
              onClick={() => handleRemoteControl(node.id, "shutdown")}
              className="flex-1 py-1.5 px-3 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider transition-colors"
            >
              Shutdown
            </button>
          </>
        )}
        {node.status === "paused" && (
          <>
            <button
              onClick={() => handleRemoteControl(node.id, "online")}
              className="flex-1 py-1.5 px-3 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider transition-colors"
            >
              Resume
            </button>
            <button
              onClick={() => handleRemoteControl(node.id, "shutdown")}
              className="flex-1 py-1.5 px-3 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider transition-colors"
            >
              Shutdown
            </button>
          </>
        )}
        {node.status === "shutdown" && (
          <button
            onClick={() => handleRemoteControl(node.id, "online")}
            className="w-full py-1.5 px-3 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider transition-colors"
          >
            Start Mining
          </button>
        )}
        {node.status === "activating" && (
          <div className="w-full text-center text-xs text-[#00f2ff] font-bold uppercase tracking-wider animate-pulse py-1">
            Connecting to pool...
          </div>
        )}
      </div>
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

export default function MiningDashboard({
  nodes,
  setNodes,
  usdBalance,
  onRemoteControl
}: {
  nodes?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  usdBalance?: number;
  onRemoteControl?: (nodeId: string, newStatus: string) => void;
}) {
  const { language, isRtl } = useTranslation();
  const code = language.code;
  const labels = DASH_I18N[code] || DASH_I18N.EN;
  const nl = NODES_I18N[code] || NODES_I18N.EN;

  const [mounted, setMounted] = useState(false);
  const [hashrateData, setHashrateData] = useState<{ time: string; value: number }[]>([]);
  const [earningsData, setEarningsData] = useState<{ day: string; btc: number }[]>([]);
  const [liveHashrate, setLiveHashrate] = useState(180);
  const [uptime] = useState(99.94);
  const [purchasedNodes, setPurchasedNodes] = useState<any[]>([]);
  const [secondsTick, setSecondsTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTick(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayedNodes = nodes !== undefined ? nodes : purchasedNodes;

  const handleSetupNode = async (nodeId: string, updates: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("nodes")
      .update(updates)
      .eq("id", nodeId)
      .eq("user_id", session.user.id);

    if (!error) {
      if (setNodes) {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
      }
      setPurchasedNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
    } else {
      alert("Node setup failed: " + error.message);
    }
  };

  const activeNodes = displayedNodes.filter(
    (n) => n.setup_configured === true || (n.status !== "pending_setup" && n.status !== "shipping" && n.status !== "delivered")
  );

  const inventoryNodes = displayedNodes.filter(
    (n) => n.setup_configured !== true && (n.status === "pending_setup" || n.status === "shipping" || n.status === "delivered")
  );

  const handleRemoteControl = async (nodeId: string, newStatus: string) => {
    if (onRemoteControl) {
      onRemoteControl(nodeId, newStatus);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("nodes")
      .update({ status: newStatus })
      .eq("id", nodeId)
      .eq("user_id", session.user.id);

    if (!error) {
      if (setNodes) {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: newStatus } : n));
      }
      setPurchasedNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: newStatus } : n));
    } else {
      alert("Remote control failed: " + error.message);
    }
  };

  // Initialize and re-generate charts on mount or language switch
  useEffect(() => {
    setMounted(true);
    const initialHashrate = generateHashrateData(30);
    setHashrateData(initialHashrate);
    setEarningsData(generateEarningsData(labels.days));
    setLiveHashrate(initialHashrate[initialHashrate.length - 1]?.value ?? 180);

    // Fetch real nodes from Supabase
    async function fetchNodes() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("nodes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data && !error) {
        const mappedNodes = data.map(n => ({
          id: n.id,
          productName: n.product_name,
          hashrate: n.hashrate,
          power: n.power,
          region: n.region,
          status: n.status,
          hosting_type: n.hosting_type || "remote",
          setup_configured: n.setup_configured !== undefined && n.setup_configured !== null ? n.setup_configured : false,
          shipping_address: n.shipping_address || null,
          shipping_started_at: n.shipping_started_at || null,
          created_at: n.created_at
        }));
        setPurchasedNodes(mappedNodes);
        if (setNodes) setNodes(mappedNodes);
      }
    }
    fetchNodes();
  }, [code, labels.days, setNodes]);

  // Push a new data point every 2s to simulate live feed
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHashrateData((prev) => {
        if (!prev || prev.length === 0) return prev;
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

  const activeCount = activeNodes.filter(n => n.status === "online" || n.status === "activating" || n.status === "paused").length;
  const totalCount = displayedNodes.length;

  const STATS = [
    { icon: Hash,       label: labels.liveHashrate,   value: `${liveHashrate} TH/s`, color: "#00f2ff" },
    { icon: Zap,        label: labels.powerDraw,      value: "4,850 W",              color: "#f59e0b" },
    { icon: Cpu,        label: labels.activeDevices,  value: `${activeCount} / ${totalCount}`, color: "#10b981" },
    { icon: TrendingUp, label: labels.todayEarnings,  value: "0.00341 BTC",          color: "#7c3aed" },
  ];

  const EFFICIENCY_DATA = [
    { label: "T200 Pro", pct: 94, color: "#00f2ff" },
    { label: "F100 Pro", pct: 88, color: "#7c3aed" },
    { label: "F50 Pro",  pct: 82, color: "#f59e0b" },
    { label: "Mini",     pct: 71, color: "#10b981" },
    { label: "Nano",     pct: 65, color: "#f97316" },
  ];

  return (
    <section className="py-24 bg-[#080808] text-white border-t border-white/5" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] uppercase mb-4">{labels.liveOps}</h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {labels.mining} <br /><span className="text-gray-600">{labels.dashboard}</span>
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">{labels.allOnline}</span>
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

          {/* Hashrate sparkline */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{labels.networkHashrate}</p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{labels.weeklyEarnings}</p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">{labels.deviceEfficiency}</p>
            <div className="flex flex-wrap items-center justify-around gap-6">
              {EFFICIENCY_DATA.map((e) => (
                <Gauge key={e.label} pct={e.pct} color={e.color} label={e.label} />
              ))}
            </div>
          </div>

          {/* Uptime card */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{labels.systemUptime}</p>
              <p className="text-5xl font-black text-white tabular-nums">{uptime.toFixed(2)}<span className="text-2xl text-gray-500">%</span></p>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: labels.clusterA, status: labels.statusOptimal,   ok: true },
                { label: labels.clusterB, status: labels.statusOptimal,   ok: true },
                { label: labels.clusterC, status: labels.statusThrottled, ok: false },
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

        {/* Active Connected Nodes */}
        <div className="mt-12">
          <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Cpu size={18} className="text-[#00f2ff]" /> Active Mining Array
          </h4>
          
          {activeNodes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeNodes.map((node) => (
                <NodeCardComponent 
                  key={node.id} 
                  node={node} 
                  handleRemoteControl={handleRemoteControl} 
                  nl={nl} 
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-gray-500">
              <p className="text-sm font-black uppercase tracking-widest">No active mining nodes connected. Complete setup below.</p>
            </div>
          )}
        </div>

        {/* Hardware Inventory & Pending Setups */}
        <div className="mt-12 pt-12 border-t border-white/5">
          <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Package size={18} className="text-[#00f2ff]" /> Hardware Inventory & Setups
          </h4>
          
          {inventoryNodes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventoryNodes.map((node) => (
                <InventoryCardComponent 
                  key={node.id} 
                  node={node}
                  handleSetupNode={handleSetupNode}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-gray-500">
              <p className="text-sm font-black uppercase tracking-widest">No pending setups. Purchase hardware from the Shop to expand your fleet.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

// ─── InventoryCardComponent ──────────────────────────────────
function InventoryCardComponent({
  node,
  handleSetupNode
}: {
  node: any;
  handleSetupNode: (id: string, updates: any) => void;
}) {
  const [setupMode, setSetupMode] = useState<"choose" | "shipping_input" | "physical_verify" | null>(null);
  const [address, setAddress] = useState("");
  const [physicalKey, setPhysicalKey] = useState("");

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }
    handleSetupNode(node.id, {
      hosting_type: "physical",
      status: "shipping",
      shipping_address: address,
      shipping_started_at: new Date().toISOString()
    });
    setSetupMode(null);
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!physicalKey.trim()) {
      alert("Please enter a physical key.");
      return;
    }
    handleSetupNode(node.id, {
      status: "activating",
      setup_configured: true,
      created_at: new Date().toISOString()
    });
    setSetupMode(null);
  };

  let shippingProgress = 0;
  if (node.status === "shipping" && node.shipping_started_at) {
    const elapsed = Date.now() - new Date(node.shipping_started_at).getTime();
    shippingProgress = Math.min(100, Math.floor((elapsed / 30000) * 100));
  }

  return (
    <div className="glass-card p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff]/30" />
      <div>
        <div className="flex justify-between items-start mb-4 pl-2">
          <div>
            <h5 className="text-lg font-black text-white">{node.productName}</h5>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">SKU // {node.id.slice(0, 8)}...</p>
          </div>
          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
            node.status === "pending_setup" 
              ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20" 
              : node.status === "shipping" 
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {node.status === "pending_setup" && <Wrench size={10} />}
            {node.status === "shipping" && <Truck size={10} className="animate-bounce" />}
            {node.status === "delivered" && <Package size={10} />}
            {node.status === "pending_setup" ? "Awaiting Setup" : node.status}
          </span>
        </div>

        {node.status === "pending_setup" && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-4 pl-2">
            {setupMode === null && (
              <>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  Select a deployment type for your new hardware below to add it to your active mining nodes.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      handleSetupNode(node.id, {
                        hosting_type: "remote",
                        status: "activating",
                        setup_configured: true,
                        created_at: new Date().toISOString()
                      });
                    }}
                    className="py-3 px-2.5 rounded-xl bg-white/5 hover:bg-[#00f2ff]/10 border border-white/10 hover:border-[#00f2ff]/30 text-left transition-all flex flex-col justify-between h-28 group/btn text-white"
                  >
                    <Cloud size={18} className="text-[#00f2ff]" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider block">Remote Hosting</span>
                      <span className="text-[8px] font-bold text-gray-500 block leading-tight mt-1">Instant deploy. 15% surcharge.</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSetupMode("shipping_input")}
                    className="py-3 px-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-left transition-all flex flex-col justify-between h-28 group/btn text-white"
                  >
                    <Truck size={18} className="text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider block">Physical Ship</span>
                      <span className="text-[8px] font-bold text-gray-500 block leading-tight mt-1">Delivered home. 100% yields.</span>
                    </div>
                  </button>
                </div>
              </>
            )}

            {setupMode === "shipping_input" && (
              <form onSubmit={handleShipSubmit} className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enter Delivery Address</p>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Blockchain Ave, London"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/60"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSetupMode(null)}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider hover:bg-white/10 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider hover:bg-emerald-400"
                  >
                    Confirm & Ship
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {node.status === "shipping" && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3 pl-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Transit Address: <span className="text-white font-mono">{node.shipping_address}</span>
            </p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-widest">
                <span>In Transit</span>
                <span>{shippingProgress}%</span>
              </div>
              <div className="w-full bg-white/5 border border-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-1000" 
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
            <p className="text-[8px] font-bold text-amber-500/80 uppercase tracking-widest italic animate-pulse">
              Simulating fast carrier dispatch (30s transit time)...
            </p>
          </div>
        )}

        {node.status === "delivered" && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3 pl-2">
            {setupMode === null && (
              <>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold leading-relaxed">
                  <span className="block font-black uppercase mb-1">Package Delivered</span>
                  Hardware has arrived at your address. Connect it to your account locally to begin mining at 100% efficiency.
                </div>
                <button
                  onClick={() => setSetupMode("physical_verify")}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                >
                  <ShieldCheck size={14} /> Connect Device
                </button>
              </>
            )}

            {setupMode === "physical_verify" && (
              <form onSubmit={handleKeySubmit} className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enter Security Key</p>
                <input
                  type="text"
                  required
                  placeholder="Enter Physical Key (e.g. AT-KEY-85)"
                  value={physicalKey}
                  onChange={(e) => setPhysicalKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/60"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSetupMode(null)}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider hover:bg-white/10 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider hover:bg-emerald-400"
                  >
                    Verify & Link
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
