"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, BarChart2, Zap, ChevronRight, X, Cpu } from "lucide-react";
import Image from "next/image";

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
};

const products: Product[] = [
  // Flagship Pro Series
  {
    id: "t200",
    name: "Appsminer T200 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "200 TH/s",
    efficiency: "25 J/TH",
    price: "$2,499",
    image: "/Products/T200 PRO.png",
    description: "Our ultimate flagship miner. Unprecedented hash rate for enterprise-level operations.",
  },
  {
    id: "f100",
    name: "Appsminer F100 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "100 TH/s",
    efficiency: "28 J/TH",
    price: "$1,299",
    image: "/Products/F100.png",
    description: "The perfect balance of power and efficiency for serious setups.",
  },
  {
    id: "f50",
    name: "Appsminer F50 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "50 TH/s",
    efficiency: "30 J/TH",
    price: "$799",
    image: "/Products/F50.png",
    description: "Entry-level professional mining hardware. Reliable and compact.",
  },
  // Micro-Controller Series
  {
    id: "mini",
    name: "Appsminer Mini",
    series: "Micro Series // Compact",
    type: "micro",
    price: "$99",
    image: "/Products/Appsminermini.png",
    description: "Compact desktop miner, perfect for small spaces.",
  },
  {
    id: "nano",
    name: "Appsminer Nano",
    series: "Micro Series // USB",
    type: "micro",
    price: "$49",
    image: "/Products/appsminer nano.png",
    description: "Ultra-compact USB miner.",
  },
  {
    id: "pocket",
    name: "Appsminer Pocket",
    series: "Micro Series // Portable",
    type: "micro",
    price: "$29",
    image: "/Products/AppsMinerPocket.png",
    description: "Carry your node anywhere. The world's smallest blockchain device.",
  },
  // Bundles
  {
    id: "starter-kit",
    name: "The Starter Kit",
    series: "Bundle",
    type: "bundle",
    price: "$499",
    image: "/Products/starter kit clearbg..png",
    description: "Everything you need to build your first micro-mining farm.",
    bundleContents: ["4× Appsminer Pocket", "3× Appsminer Mini", "3× Appsminer Nano"],
  },
];

export default function HardwareCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const flagships = products.filter((p) => p.type === "flagship");
  const micros    = products.filter((p) => p.type === "micro");
  const bundles   = products.filter((p) => p.type === "bundle");

  return (
    // ── Dark section — continues from the animation ────────
    <section className="py-32 bg-[#080808] text-white relative z-20">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Section heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">
              Hardware Catalog
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
              Precision <br />
              <span className="text-gray-600">Mining</span>
            </h3>
          </div>
        </div>

        {/* Flagship Series */}
        <div className="mb-16">
          <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Zap size={18} className="text-[#00f2ff]" /> Pro Series Flagships
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {flagships.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        </div>

        {/* Micro Series + Bundles */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
              <Cpu size={18} className="text-[#00f2ff]" /> Micro-Controller Series
            </h4>
            <div className="grid sm:grid-cols-2 gap-6">
              {micros.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
              <ShoppingCart size={18} className="text-[#00f2ff]" /> Bundles
            </h4>
            <div className="grid grid-cols-1 gap-6">
              {bundles.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product modal */}
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
      className="p-6 flex flex-col cursor-pointer group glass-card"
    >
      {/* ── Product image — fixed height so `fill` works ── */}
      <div className="relative h-[220px] w-full rounded-2xl mb-6 overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
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
        <p className="text-gray-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">
          {product.series}
        </p>
        <motion.h4
          layoutId={`title-${product.id}`}
          className="text-xl font-black tracking-tight mb-4 text-white"
        >
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
// ProductModal — fixed z-index conflict: backdrop z-50, modal z-[60]
// ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <>
      {/* Backdrop — z-50 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
      />

      {/* Modal container — z-[60] sits above backdrop */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <motion.div
          layoutId={`card-container-${product.id}`}
          className="glass-card w-full max-w-6xl max-h-[90vh] overflow-y-auto pointer-events-auto relative flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all"
          >
            <X size={20} />
          </button>

          {/* ── Left: Large product image — explicit height so `fill` works ── */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative bg-white/5 border-r border-white/10">
            <div className="relative w-full h-[360px] md:h-full min-h-[360px]">
              <motion.div layoutId={`image-${product.id}`} className="absolute inset-0 p-10 md:p-16">
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-[0_0_80px_rgba(0,242,255,0.15)]"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Right: Product info ── */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
            <p className="text-gray-500 font-bold text-[11px] tracking-[0.25em] uppercase mb-4">
              {product.series}
            </p>

            <motion.div layoutId={`title-${product.id}`} className="mb-3">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none text-white">
                {product.name}
              </h2>
            </motion.div>

            <motion.div layoutId={`price-${product.id}`} className="text-3xl font-black text-[#00f2ff] mb-8">
              {product.price}
            </motion.div>

            <p className="text-gray-400 font-medium mb-10 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            {product.hashrate && (
              <div className="grid grid-cols-2 gap-6 mb-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <BarChart2 size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Hashrate</span>
                  </div>
                  <span className="text-2xl font-black tabular-nums text-[#00f2ff]">{product.hashrate}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <Zap size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Efficiency</span>
                  </div>
                  <span className="text-2xl font-black tabular-nums text-white">{product.efficiency}</span>
                </div>
              </div>
            )}

            {/* Bundle contents */}
            {product.bundleContents && (
              <div className="space-y-4 mb-10">
                <h4 className="font-black text-white border-b border-white/10 pb-4 text-base uppercase tracking-widest">
                  Bundle Includes
                </h4>
                <ul className="space-y-3 pt-2">
                  {product.bundleContents.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base font-bold text-gray-300">
                      <div className="w-2 h-2 bg-[#00f2ff] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-sm rounded-full hover:bg-[#00f2ff] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-2xl">
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
