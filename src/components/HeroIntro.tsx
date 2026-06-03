"use client";

import { motion } from "framer-motion";

export default function HeroIntro() {
  return (
    // ── Light section: off-white, explicit bg so it never bleeds ──
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center pt-20 pb-10 bg-[#f8f9fa]">

      {/* Subtle dot-grid texture so it doesn't look flat */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #d0d0d0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-5 py-2 rounded-full glass-panel"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black">
            The Next Generation of Mining
          </span>
        </motion.div>

        {/* Hero heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-[11vw] md:text-[9vw] leading-[0.85] font-black tracking-tighter text-black uppercase"
        >
          Mine{" "}
          <span className="text-gray-400">With</span>
          <br />
          Absolute{" "}
          <span className="relative">
            Power
            <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1 md:h-2 bg-black rounded-full transform -skew-x-12" />
          </span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-14 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Experience industrial-grade hashpower with AppsMiner.
          Unmatched efficiency, seamless scaling, and absolute control.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl">
            Shop Now
          </button>
          <button className="px-8 py-4 glass-panel text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}
