"use client";

import { ShoppingCart, BarChart2, Zap, Tag } from "lucide-react";

const products = [
  {
    id: "t200",
    name: "Appsminer T200 Pro",
    series: "Series 2026 // Next-Gen",
    hashrate: "200 TH/s",
    efficiency: "15.0 J/TH",
    price: "$3,200",
    image: "/Products/T200 PRO.png",
    featured: true
  },
  {
    id: "mega",
    name: "Appsminer Mega",
    series: "Series 2025 // Enterprise",
    hashrate: "140 TH/s",
    efficiency: "21.5 J/TH",
    price: "$2,400",
    image: "/Products/Appsminermega.png",
    featured: false
  },
  {
    id: "pro",
    name: "Appsminer Pro",
    series: "Series 2025 // Professional",
    hashrate: "110 TH/s",
    efficiency: "29.5 J/TH",
    price: "$1,800",
    image: "/Products/AppsMinerPro.png",
    featured: false
  },
  {
    id: "f100",
    name: "Appsminer F100",
    series: "GPU Rig // Multi-Algo",
    hashrate: "100 MH/s",
    efficiency: "120W",
    price: "$1,200",
    image: "/Products/F100.png",
    featured: false
  },
  {
    id: "mini",
    name: "Appsminer Mini",
    series: "Series 2024 // Compact",
    hashrate: "50 TH/s",
    efficiency: "35.0 J/TH",
    price: "$800",
    image: "/Products/appsminer mini.png",
    featured: false
  },
  {
    id: "starter",
    name: "Starter Kit",
    series: "Entry Level",
    hashrate: "10 TH/s",
    efficiency: "40.0 J/TH",
    price: "$300",
    image: "/Products/starter kit clearbg..png",
    featured: false
  }
];

export default function HardwareCatalog() {
  return (
    <section className="py-32 bg-white text-black relative z-20 rounded-t-[3rem] -mt-10">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-4">Hardware Catalog</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Flagship <br/>
              <span className="text-gray-300">ASICs</span>
            </h3>
          </div>
        </div>

        {/* Featured Product (T200 Pro) */}
        <div className="mb-6">
          {products.filter(p => p.featured).map(product => (
            <div key={product.id} className="bento-card-light p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase mb-4">{product.series}</p>
                <h4 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-12">{product.name}</h4>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  <div className="p-6 rounded-[1.5rem] bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <BarChart2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Hashrate</span>
                    </div>
                    <span className="text-2xl font-black tabular-nums">{product.hashrate}</span>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Zap size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Efficiency</span>
                    </div>
                    <span className="text-2xl font-black tabular-nums">{product.efficiency}</span>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Tag size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Price</span>
                    </div>
                    <span className="text-2xl font-black tabular-nums">{product.price}</span>
                  </div>
                </div>
                
                <button className="w-full py-5 bg-black hover:bg-gray-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full transition-all flex items-center justify-center gap-4">
                  <ShoppingCart size={18} /> Order Hardware Now
                </button>
              </div>
              
              <div className="order-1 lg:order-2 flex justify-center p-10 bg-gray-50 rounded-[2rem]">
                 <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                   <img src={product.image} alt={product.name} className="object-contain max-h-full drop-shadow-2xl" />
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid of Other Products */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => !p.featured).map(product => (
            <div key={product.id} className="bento-card-light p-8 flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-8 mb-8 flex-1 flex items-center justify-center min-h-[250px]">
                <img src={product.image} alt={product.name} className="object-contain max-h-[200px] drop-shadow-xl hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="mt-auto">
                <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">{product.series}</p>
                <h4 className="text-2xl font-black tracking-tight mb-6">{product.name}</h4>
                
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

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-xl font-black">{product.price}</span>
                  <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
