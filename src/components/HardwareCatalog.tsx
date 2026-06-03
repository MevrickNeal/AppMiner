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
    description: "Our ultimate flagship miner. Unprecedented hash rate for enterprise-level operations."
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
    description: "The perfect balance of power and efficiency for serious setups."
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
    description: "Entry-level professional mining hardware. Reliable and compact."
  },

  // Micro-Controller Series
  {
    id: "mini",
    name: "Appsminer Mini",
    series: "Micro Series // Compact",
    type: "micro",
    price: "$99",
    image: "/Products/Appsminermini.png",
    description: "Compact desktop miner, perfect for small spaces."
  },
  {
    id: "nano",
    name: "Appsminer Nano",
    series: "Micro Series // USB",
    type: "micro",
    price: "$49",
    image: "/Products/appsminer nano.png",
    description: "Ultra-compact USB miner."
  },
  {
    id: "pocket",
    name: "Appsminer Pocket",
    series: "Micro Series // Portable",
    type: "micro",
    price: "$29",
    image: "/Products/AppsMinerPocket.png",
    description: "Carry your node anywhere. The world's smallest blockchain device."
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
    bundleContents: [
      "4× Appsminer Pocket",
      "3× Appsminer Mini",
      "3× Appsminer Nano"
    ]
  }
];

export default function HardwareCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const flagships = products.filter(p => p.type === "flagship");
  const micros = products.filter(p => p.type === "micro");
  const bundles = products.filter(p => p.type === "bundle");

  return (
    <section className="py-32 bg-white text-black relative z-20 rounded-t-[3rem] -mt-10">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">Hardware Catalog</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Precision <br/>
              <span className="text-gray-300">Mining</span>
            </h3>
          </div>
        </div>

        {/* Flagship Series */}
        <div className="mb-16">
          <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Zap className="text-black" /> PRO SERIES FLAGSHIPS
          </h4>
          <div className="grid md:grid-cols-3 gap-8">
            {flagships.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        </div>

        {/* Micro Series and Bundles */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
             <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Cpu className="text-black" /> MICRO-CONTROLLER SERIES
            </h4>
            <div className="grid sm:grid-cols-2 gap-8">
              {micros.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <ShoppingCart className="text-black" /> BUNDLES
            </h4>
             <div className="grid grid-cols-1 gap-8">
              {bundles.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Expanded Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>

    </section>
  );
}

function ProductCard({ product, onClick }: { product: Product, onClick: () => void }) {
  return (
    <motion.div 
      layoutId={`card-container-${product.id}`}
      onClick={onClick}
      whileHover={{ y: -15, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-8 flex flex-col cursor-pointer group bg-white border border-gray-100 rounded-[2rem] h-full shadow-sm"
    >
      <div className="bg-gray-50 rounded-[1.5rem] p-8 mb-8 flex-1 flex items-center justify-center min-h-[250px] relative overflow-hidden">
        <motion.div layoutId={`image-${product.id}`} className="relative w-full h-full flex items-center justify-center">
           <Image src={product.image} alt={product.name} fill className="object-contain max-h-[200px] drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out" />
        </motion.div>
      </div>
      
      <div className="mt-auto">
        <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">{product.series}</p>
        <motion.h4 layoutId={`title-${product.id}`} className="text-2xl font-black tracking-tight mb-6">{product.name}</motion.h4>
        
        {product.hashrate && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Hashrate</p>
              <p className="font-bold">{product.hashrate}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Efficiency</p>
              <p className="font-bold">{product.efficiency}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <motion.span layoutId={`price-${product.id}`} className="text-xl font-black">{product.price}</motion.span>
          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white text-black flex items-center justify-center transition-colors">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, onClose }: { product: Product, onClose: () => void }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-white/90 backdrop-blur-md z-50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <motion.div 
          layoutId={`card-container-${product.id}`}
          className="bg-white w-full max-w-6xl h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl pointer-events-auto relative border border-gray-200 flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:scale-110 flex items-center justify-center text-black transition-transform"
          >
            <X size={24} />
          </button>

          {/* Large View of the Product */}
          <div className="w-full md:w-1/2 p-12 bg-gray-50 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50 mix-blend-multiply" />
             <motion.div layoutId={`image-${product.id}`} className="w-full h-full relative z-10 flex items-center justify-center">
                <Image src={product.image} alt={product.name} fill className="object-contain drop-shadow-2xl scale-125 md:scale-150" />
             </motion.div>
          </div>

          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <p className="text-gray-400 font-bold text-[12px] tracking-[0.2em] uppercase mb-4">{product.series}</p>
            <motion.div layoutId={`title-${product.id}`} className="mb-4">
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">{product.name}</h2>
            </motion.div>
            
            <motion.div layoutId={`price-${product.id}`} className="text-4xl font-black mb-8">
              {product.price}
            </motion.div>

            <p className="text-gray-600 font-medium mb-12 text-xl leading-relaxed">
              {product.description}
            </p>

            {product.hashrate && (
               <div className="grid grid-cols-2 gap-6 mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <BarChart2 size={20} />
                      <span className="text-[12px] font-black uppercase tracking-widest">Hashrate</span>
                    </div>
                    <span className="text-3xl font-black tabular-nums">{product.hashrate}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Zap size={20} />
                      <span className="text-[12px] font-black uppercase tracking-widest">Efficiency</span>
                    </div>
                    <span className="text-3xl font-black tabular-nums">{product.efficiency}</span>
                  </div>
               </div>
            )}

            {product.bundleContents && (
              <div className="space-y-4 mb-12">
                <h4 className="font-bold border-b border-gray-200 pb-4 text-xl">Bundle Includes</h4>
                <ul className="space-y-3 pt-4">
                  {product.bundleContents.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg font-bold text-gray-700">
                      <div className="w-2.5 h-2.5 bg-black rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-sm rounded-full hover:bg-gray-800 hover:scale-[1.02] transition-all mt-auto flex items-center justify-center gap-3 shadow-xl">
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>

        </motion.div>
      </div>
    </>
  );
}
