"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Zap, Cpu, BarChart3, Hash } from "lucide-react";
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize and re-generate charts on mount or language switch
  useEffect(() => {
    setMounted(true);
    const initialHashrate = generateHashrateData(30);
    setHashrateData(initialHashrate);
    setEarningsData(generateEarningsData(labels.days));
    setLiveHashrate(initialHashrate[initialHashrate.length - 1]?.value ?? 180);

    // Fetch real nodes from Supabase
    async function fetchNodes() {
      const isDemoMode = typeof window !== "undefined" && localStorage.getItem("appsminers_demo") === "true";
      if (isDemoMode) {
        const localNodesStr = localStorage.getItem("appsminers_purchased_nodes");
        if (localNodesStr) {
          setPurchasedNodes(JSON.parse(localNodesStr));
        } else {
          const defaultNodes = [
            { id: "demo-n1", productName: "AppsMiners Nano Premium", hashrate: "10 TH/s", power: "10 W", region: "Europe-West", status: "online" },
            { id: "demo-n2", productName: "AppsMiners Pocket Pro", hashrate: "110.2 TH/s", power: "550 W", region: "US-East", status: "online" },
            { id: "demo-n3", productName: "AppsMiners Mini Enterprise", hashrate: "220.5 TH/s", power: "1200 W", region: "Asia-Pacific", status: "online" }
          ];
          localStorage.setItem("appsminers_purchased_nodes", JSON.stringify(defaultNodes));
          setPurchasedNodes(defaultNodes);
        }
        return;
      }

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
          status: n.status
        }));
        setPurchasedNodes(mappedNodes);
      }
    }
    fetchNodes();
  }, [code, labels.days]);

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

  const STATS = [
    { icon: Hash,       label: labels.liveHashrate,   value: `${liveHashrate} TH/s`, color: "#00f2ff" },
    { icon: Zap,        label: labels.powerDraw,      value: "4,850 W",              color: "#f59e0b" },
    { icon: Cpu,        label: labels.activeDevices,  value: "12 / 12",              color: "#10b981" },
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

        {/* Third Row: Connected Nodes */}
        <div className="mt-8">
          <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Cpu size={18} className="text-[#00f2ff]" /> {nl.connectedNodes}
          </h4>
          
          {purchasedNodes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedNodes.map((node) => (
                <div key={node.id} className="glass-card p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="text-lg font-black text-white">{node.productName}</h5>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{node.id}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
                      {node.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{nl.hashrate}</p>
                      <p className="text-sm font-black text-white">{node.hashrate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{nl.power}</p>
                      <p className="text-sm font-black text-white">{node.power}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{nl.region}</p>
                      <p className="text-sm font-black text-white">{node.region}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-gray-500">
              <p className="text-sm font-black uppercase tracking-widest">{nl.noNodes}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
