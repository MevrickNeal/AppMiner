"use client";

import { motion } from "framer-motion";

export default function HeroIntro() {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center pt-20 bg-white pb-10">
      <div className="max-w-[1400px] mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
            The Next Generation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="text-[11vw] md:text-[9vw] leading-[0.85] font-black tracking-tighter text-black uppercase"
        >
          Mine <span className="text-gray-300">With</span>
          <br />
          Absolute <span className="relative">
            Power
            <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1 md:h-2 bg-black rounded-full transform -skew-x-12"></span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
        >
          Experience industrial-grade hashpower with AppsMiner. 
          Unmatched efficiency, seamless scaling, and absolute control.
        </motion.p>
      </div>
    </div>
  );
}
