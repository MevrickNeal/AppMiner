"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, BarChart2, Zap, ChevronRight, X, Cpu,
  Thermometer, Weight, Wifi, Volume2, Box, Activity,
  Shield, Clock, Package
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────
type SpecGroup = { label: string; rows: { key: string; value: string; highlight?: boolean }[] };

type Product = {
  id: string;
  name: string;
  series: string;
  type: "flagship" | "micro" | "bundle";
  hashrate?: string;
  efficiency?: string;
  price: string;
  image: string;
  description: string;
  bundleContents?: string[];
  badge?: string;
  specGroups: SpecGroup[];
};

// ─── Product Data with full spec sheets ──────────────────────
const products: Product[] = [

  // ── T200 Pro ────────────────────────────────────────────────
  {
    id: "t200",
    name: "Appsminer T200 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "200 TH/s",
    efficiency: "25 J/TH",
    price: "$2,499",
    image: "/Products/T200 PRO.png",
    badge: "Best Seller",
    description:
      "Our ultimate flagship — 200 TH/s of raw SHA-256 mining power with enterprise-grade thermal management. Built for 24/7 data-center deployment.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "200 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "5,000 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "25 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "256× Proprietary Gen-4" },
          { key: "Chip Process",          value: "5nm TSMC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "400 × 195 × 290 mm" },
          { key: "Weight",                value: "14.5 kg" },
          { key: "Cooling",               value: "Dual 120mm Industrial Fans" },
          { key: "Noise Level",           value: "75 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP44" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "200 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C19 × 2" },
          { key: "PSU Efficiency",        value: "93% (Platinum rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "Gigabit Ethernet RJ-45" },
          { key: "Management",            value: "Web UI + REST API" },
          { key: "Operating Temp",        value: "0 °C – 40 °C" },
          { key: "Humidity",              value: "5% – 95% non-condensing" },
          { key: "Warranty",              value: "24 months", highlight: true },
        ],
      },
    ],
  },

  // ── F100 Pro ─────────────────────────────────────────────────
  {
    id: "f100",
    name: "Appsminer F100 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "100 TH/s",
    efficiency: "28 J/TH",
    price: "$1,299",
    image: "/Products/F100.png",
    description:
      "The ideal mid-range powerhouse. 100 TH/s in a compact chassis — perfect for serious home rigs and small farm setups.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "100 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "2,800 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "28 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "128× Proprietary Gen-4" },
          { key: "Chip Process",          value: "5nm TSMC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "370 × 195 × 290 mm" },
          { key: "Weight",                value: "12.5 kg" },
          { key: "Cooling",               value: "Dual 120mm Industrial Fans" },
          { key: "Noise Level",           value: "72 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP44" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "200 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C19" },
          { key: "PSU Efficiency",        value: "92% (Gold rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "Gigabit Ethernet RJ-45" },
          { key: "Management",            value: "Web UI + REST API" },
          { key: "Operating Temp",        value: "0 °C – 45 °C" },
          { key: "Humidity",              value: "5% – 95% non-condensing" },
          { key: "Warranty",              value: "18 months", highlight: true },
        ],
      },
    ],
  },

  // ── F50 Pro ──────────────────────────────────────────────────
  {
    id: "f50",
    name: "Appsminer F50 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "50 TH/s",
    efficiency: "30 J/TH",
    price: "$799",
    image: "/Products/F50.png",
    badge: "Entry Pro",
    description:
      "Professional-grade mining in a budget-conscious package. 50 TH/s with whisper-quiet single fan — the gateway to the Pro Series.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "50 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "1,500 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "30 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "64× Proprietary Gen-3" },
          { key: "Chip Process",          value: "7nm Samsung" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "340 × 160 × 230 mm" },
          { key: "Weight",                value: "9.5 kg" },
          { key: "Cooling",               value: "Single 140mm Fan + Heatsink Array" },
          { key: "Noise Level",           value: "65 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP42" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "180 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C13" },
          { key: "PSU Efficiency",        value: "90% (Gold rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "100Mbps Ethernet RJ-45" },
          { key: "Management",            value: "Web UI" },
          { key: "Operating Temp",        value: "0 °C – 45 °C" },
          { key: "Humidity",              value: "10% – 90% non-condensing" },
          { key: "Warranty",              value: "12 months", highlight: true },
        ],
      },
    ],
  },

  // ── Mini ─────────────────────────────────────────────────────
  {
    id: "mini",
    name: "Appsminer Mini",
    series: "Micro Series // Compact",
    type: "micro",
    price: "$99",
    image: "/Products/Appsminermini.png",
    description:
      "Compact desktop miner with whisper-quiet operation. Plug into any wall socket and start earning — no specialist knowledge required.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "500 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256 / Scrypt" },
          { key: "Power Consumption",     value: "45 W", highlight: true },
          { key: "Efficiency",            value: "90 mJ/GH" },
          { key: "ASIC Chips",            value: "4× Gen-2 Micro-ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "150 × 100 × 60 mm" },
          { key: "Weight",                value: "0.8 kg" },
          { key: "Cooling",               value: "Passive fins + 40mm mini fan" },
          { key: "Noise Level",           value: "38 dB(A) @ 1m" },
          { key: "Color",                 value: "Matte Black / Space Gray" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Input",           value: "12V DC (AC adapter included)" },
          { key: "Adapter",               value: "Universal 100 – 240 VAC" },
          { key: "Connector",             value: "Barrel Jack 5.5mm" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB 3.0 + WiFi 802.11n" },
          { key: "Management",            value: "Mobile App (iOS / Android)" },
          { key: "Operating Temp",        value: "0 °C – 50 °C" },
          { key: "Warranty",              value: "12 months", highlight: true },
        ],
      },
    ],
  },

  // ── Nano ─────────────────────────────────────────────────────
  {
    id: "nano",
    name: "Appsminer Nano",
    series: "Micro Series // USB",
    type: "micro",
    price: "$49",
    image: "/Products/appsminer nano.png",
    description:
      "The ultimate USB stick miner. Fully bus-powered — just plug into any USB 3.0 port and you're mining. No setup. No fuss.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "150 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "10 W (bus powered)", highlight: true },
          { key: "Efficiency",            value: "67 mJ/GH" },
          { key: "ASIC Chips",            value: "1× Gen-2 Nano-ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions",            value: "80 × 40 × 20 mm" },
          { key: "Weight",                value: "120 g" },
          { key: "Cooling",               value: "Passive aluminum heatsink" },
          { key: "Noise Level",           value: "0 dB (fanless)", highlight: true },
          { key: "Form Factor",           value: "USB Stick" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Source",          value: "USB 3.0 (5V / 2A)" },
          { key: "Connector",             value: "USB-A 3.0" },
          { key: "Max Draw",              value: "10W" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB 3.0" },
          { key: "Management",            value: "CGMiner / BFGMiner compatible" },
          { key: "OS Support",            value: "Windows, macOS, Linux, Raspberry Pi" },
          { key: "Operating Temp",        value: "0 °C – 60 °C" },
          { key: "Warranty",              value: "6 months", highlight: true },
        ],
      },
    ],
  },

  // ── Pocket ───────────────────────────────────────────────────
  {
    id: "pocket",
    name: "Appsminer Pocket",
    series: "Micro Series // Portable",
    type: "micro",
    price: "$29",
    badge: "World's Smallest",
    image: "/Products/AppsMinerPocket.png",
    description:
      "The world's smallest standalone blockchain mining device. USB-C powered, fully portable, and configurable from any smartphone.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "50 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256 / Multi-algo" },
          { key: "Power Consumption",     value: "5 W", highlight: true },
          { key: "Efficiency",            value: "100 mJ/GH" },
          { key: "ASIC Chips",            value: "1× Pocket ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions",            value: "60 × 30 × 15 mm" },
          { key: "Weight",                value: "48 g" },
          { key: "Cooling",               value: "Passive (no moving parts)", highlight: true },
          { key: "Noise Level",           value: "0 dB (completely silent)", highlight: true },
          { key: "Material",              value: "Anodized aerospace aluminum" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Source",          value: "USB-C (5V / 1A)" },
          { key: "Connector",             value: "USB-C" },
          { key: "Battery Compatible",    value: "Yes — USB-C power banks" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB-C + Bluetooth 5.0" },
          { key: "Management",            value: "AppsMiner Mobile App" },
          { key: "OS Support",            value: "Android / iOS via BLE" },
          { key: "Operating Temp",        value: "-10 °C – 60 °C" },
          { key: "Warranty",              value: "6 months", highlight: true },
        ],
      },
    ],
  },

  // ── Starter Kit ──────────────────────────────────────────────
  {
    id: "starter-kit",
    name: "The Starter Kit",
    series: "Bundle",
    type: "bundle",
    price: "$499",
    badge: "Save 30%",
    image: "/Products/starter kit clearbg..png",
    description:
      "Everything you need to build your first distributed micro-mining farm. 10 devices, 2.15 TH/s combined, ready to run in under 10 minutes.",
    bundleContents: ["4× Appsminer Pocket", "3× Appsminer Mini", "3× Appsminer Nano"],
    specGroups: [
      {
        label: "Bundle Performance",
        rows: [
          { key: "Combined Hashrate",     value: "~2.15 TH/s", highlight: true },
          { key: "Total Power Draw",      value: "185 W", highlight: true },
          { key: "Devices Included",      value: "10 units" },
          { key: "Algorithms",            value: "SHA-256, Scrypt, Multi-algo" },
          { key: "Estimated ROI",         value: "4 – 6 months (market dependent)" },
        ],
      },
      {
        label: "What's in the Box",
        rows: [
          { key: "Appsminer Pocket ×4",   value: "200 GH/s combined" },
          { key: "Appsminer Mini ×3",     value: "1,500 GH/s combined" },
          { key: "Appsminer Nano ×3",     value: "450 GH/s combined" },
          { key: "USB Hub (7-port)",      value: "Powered, included", highlight: true },
          { key: "Power Strip",           value: "Surge-protected, included" },
          { key: "Quick-Start Guide",     value: "Printed + digital PDF" },
        ],
      },
      {
        label: "Setup & Compatibility",
        rows: [
          { key: "Setup Time",            value: "< 10 minutes", highlight: true },
          { key: "OS Support",            value: "Windows, macOS, Linux, Raspberry Pi" },
          { key: "App Required",          value: "AppsMiner Mobile (free)" },
          { key: "Pool Compatibility",    value: "All major pools (Slush, F2Pool, etc.)" },
        ],
      },
      {
        label: "Bundle Value",
        rows: [
          { key: "Individual MSRP",       value: "$613" },
          { key: "Bundle Price",          value: "$499", highlight: true },
          { key: "Savings",               value: "$114 (18.6% off)", highlight: true },
          { key: "Bundle Warranty",       value: "12 months unified" },
        ],
      },
    ],
  },
];

// ─── Icons per spec group ─────────────────────────────────────
const GROUP_ICONS: Record<string, React.ElementType> = {
  "Performance":                Activity,
  "Physical":                   Box,
  "Electrical":                 Zap,
  "Connectivity & Environment": Wifi,
  "Bundle Performance":         BarChart2,
  "What's in the Box":          Package,
  "Setup & Compatibility":      Cpu,
  "Bundle Value":               Shield,
};

// ─────────────────────────────────────────────────────────────
// HardwareCatalog
// ─────────────────────────────────────────────────────────────
export default function HardwareCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const flagships = products.filter((p) => p.type === "flagship");
  const micros    = products.filter((p) => p.type === "micro");
  const bundles   = products.filter((p) => p.type === "bundle");

  return (
    <section className="py-32 bg-[#080808] text-white relative z-20">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">Hardware Catalog</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
              Precision <br /><span className="text-gray-600">Mining</span>
            </h3>
          </div>
          <p className="text-gray-600 text-sm max-w-xs font-medium leading-relaxed">
            Click any device to open its full spec sheet.
          </p>
        </div>

        {/* Flagship */}
        <div className="mb-16">
          <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Zap size={18} className="text-[#00f2ff]" /> Pro Series Flagships
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {flagships.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
          </div>
        </div>

        {/* Micro + Bundles */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
              <Cpu size={18} className="text-[#00f2ff]" /> Micro-Controller Series
            </h4>
            <div className="grid sm:grid-cols-2 gap-6">
              {micros.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
              <ShoppingCart size={18} className="text-[#00f2ff]" /> Bundles
            </h4>
            <div className="grid grid-cols-1 gap-6">
              {bundles.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <motion.div
      layoutId={`card-container-${product.id}`}
      onClick={onClick}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="p-6 flex flex-col cursor-pointer group glass-card relative"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-widest">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative h-[220px] w-full rounded-2xl mb-6 overflow-hidden bg-white/5 border border-white/10">
        <motion.div layoutId={`image-${product.id}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </motion.div>
      </div>

      {/* Text */}
      <div className="mt-auto">
        <p className="text-gray-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">{product.series}</p>
        <motion.h4 layoutId={`title-${product.id}`} className="text-xl font-black tracking-tight mb-4 text-white">
          {product.name}
        </motion.h4>

        {product.hashrate && (
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Hashrate</p>
              <p className="font-black text-[#00f2ff] text-sm">{product.hashrate}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Efficiency</p>
              <p className="font-black text-white text-sm">{product.efficiency}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <motion.span layoutId={`price-${product.id}`} className="text-xl font-black text-white">
            {product.price}
          </motion.span>
          <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#00f2ff] group-hover:text-black text-white flex items-center justify-center transition-colors duration-300">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductModal — tabbed spec sheet
// ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-container-${product.id}`}
          className="glass-card w-full max-w-6xl max-h-[94vh] overflow-hidden pointer-events-auto relative flex flex-col"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all"
          >
            <X size={18} />
          </button>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

            {/* LEFT — image + hero info */}
            <div className="w-full md:w-[40%] flex flex-col border-r border-white/10 flex-shrink-0">

              {/* Image area */}
              <div className="relative flex-1 min-h-[240px] md:min-h-0 bg-white/3 flex items-center justify-center p-8">
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.06)_0%,transparent_70%)]" />
                <motion.div layoutId={`image-${product.id}`} className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-[0_0_60px_rgba(0,242,255,0.2)]"
                  />
                </motion.div>
              </div>

              {/* Info below image */}
              <div className="p-6 border-t border-white/10 bg-white/2">
                {product.badge && (
                  <span className="inline-block mb-3 px-2.5 py-1 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-widest">
                    {product.badge}
                  </span>
                )}
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mb-1">{product.series}</p>
                <motion.h2 layoutId={`title-${product.id}`} className="text-2xl font-black tracking-tighter text-white mb-1">
                  {product.name}
                </motion.h2>
                <motion.div layoutId={`price-${product.id}`} className="text-2xl font-black text-[#00f2ff] mb-4">
                  {product.price}
                </motion.div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

                {/* Bundle pills */}
                {product.bundleContents && (
                  <div className="space-y-2 mb-6">
                    {product.bundleContents.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                        <span className="text-xs font-bold text-gray-400">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:bg-[#00f2ff] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>

            {/* RIGHT — spec sheet */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* Tab bar */}
              <div className="flex overflow-x-auto border-b border-white/10 px-4 pt-4 gap-1 flex-shrink-0 scrollbar-hide">
                {product.specGroups.map((group, i) => {
                  const Icon = GROUP_ICONS[group.label] ?? Activity;
                  return (
                    <button
                      key={group.label}
                      onClick={() => setActiveTab(i)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                        activeTab === i
                          ? "text-[#00f2ff] border-[#00f2ff] bg-[#00f2ff]/8"
                          : "text-gray-600 border-transparent hover:text-gray-400"
                      }`}
                    >
                      <Icon size={12} />
                      {group.label}
                    </button>
                  );
                })}
              </div>

              {/* Spec rows */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-1"
                  >
                    {/* Group title */}
                    <div className="flex items-center gap-2 mb-5">
                      {(() => {
                        const Icon = GROUP_ICONS[product.specGroups[activeTab].label] ?? Activity;
                        return <Icon size={16} className="text-[#00f2ff]" />;
                      })()}
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                        {product.specGroups[activeTab].label}
                      </h3>
                    </div>

                    {product.specGroups[activeTab].rows.map((row, i) => (
                      <motion.div
                        key={row.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                        className={`flex items-center justify-between py-3.5 px-4 rounded-xl transition-colors group/row ${
                          row.highlight
                            ? "bg-[#00f2ff]/6 border border-[#00f2ff]/20"
                            : "bg-white/3 border border-white/6 hover:bg-white/6"
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-500 group-hover/row:text-gray-400 transition-colors">
                          {row.key}
                        </span>
                        <span className={`text-sm font-black tabular-nums text-right ${
                          row.highlight ? "text-[#00f2ff]" : "text-white"
                        }`}>
                          {row.value}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Quick-reference footer bar for flagship */}
                {product.hashrate && (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { Icon: Activity,    label: "Hashrate",   val: product.hashrate },
                      { Icon: Zap,         label: "Efficiency", val: product.efficiency ?? "—" },
                      { Icon: Clock,       label: "Warranty",   val: product.type === "flagship" ? (product.id === "t200" ? "24 mo" : product.id === "f100" ? "18 mo" : "12 mo") : "12 mo" },
                    ].map(({ Icon, label, val }) => (
                      <div key={label} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <Icon size={14} className="text-[#00f2ff] mx-auto mb-1.5" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">{label}</p>
                        <p className="text-sm font-black text-white">{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compare notice */}
                <p className="text-center text-[10px] text-gray-700 font-bold mt-6 uppercase tracking-widest">
                  All specs subject to ±5% manufacturing tolerance
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
