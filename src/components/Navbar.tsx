"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-black tracking-tighter text-black">APPSMINER</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Products</Link>
          <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Services</Link>
          <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Prices</Link>
        </nav>

        <div className="flex-1 flex justify-end items-center gap-4">
          <Link href="/login" className="hidden md:flex px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors hover:scale-105 active:scale-95 shadow-xl">
            Log In
          </Link>
          <button className="md:hidden p-2 text-black">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
