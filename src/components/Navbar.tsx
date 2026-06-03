"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Products", href: "/" },
  { label: "Services", href: "/" },
  { label: "Prices",   href: "/" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#f8f9fa]/80 backdrop-blur-2xl border-b border-black/10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Icon-only mark — no white background bleed */}
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiner icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-black group-hover:text-gray-700 transition-colors">
                APPSMINER
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link
              href="/login"
              className="hidden md:flex px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Log In
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-black"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 inset-x-0 z-40 bg-[#f8f9fa]/95 backdrop-blur-xl border-b border-black/10 flex flex-col px-6 py-8 gap-6 md:hidden"
          >
            {/* Mobile logo */}
            <div className="flex items-center gap-3 pb-4 border-b border-black/10">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiner icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base font-black tracking-tighter text-black">APPSMINER</span>
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-black uppercase tracking-widest text-black"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-6 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full text-center"
            >
              Log In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
