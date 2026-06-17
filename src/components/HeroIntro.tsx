"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";

export default function HeroIntro() {
  const { t, isRtl } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    // ── Light section: off-white, explicit bg so it never bleeds ──
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center pt-20 pb-10 bg-[#f8f9fa]" dir={isRtl ? "rtl" : "ltr"}>

      {/* Subtle dot-grid texture so it doesn't look flat */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #d0d0d0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 text-center z-10">
        {/* Transparent Loader GIF */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-36 h-36 mx-auto mb-2"
        >
          <Image
            src="/Products/loading.gif"
            alt="AppsMiners animation"
            fill
            className="object-contain"
            unoptimized
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-5 py-2 rounded-full glass-panel"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black">
            {t("heroIntroBadge")}
          </span>
        </motion.div>

        {/* Hero heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-[11vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-black uppercase"
        >
          {t("heroIntroTitleMine")}{" "}
          <span className="text-gray-400">{t("heroIntroTitleWith")}</span>
          <br />
          {t("heroIntroTitleAbsolute")}{" "}
          <span className="relative">
            {t("heroIntroTitlePower")}
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
          {t("heroIntroSub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0 w-full sm:w-auto"
        >
          <a 
            href="#products" 
            onClick={(e) => handleScroll(e, "products")}
            className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl block text-center"
          >
            {t("heroIntroShop")}
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleScroll(e, "features")}
            className="w-full sm:w-auto px-8 py-4 glass-panel text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all block text-center"
          >
            {t("heroIntroLearn")}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
