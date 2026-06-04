"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";
import { ShieldAlert, Cpu, Layers, Thermometer } from "lucide-react";

export default function AsicResearch() {
  const { t, isRtl } = useTranslation();

  return (
    <section id="research" className="py-32 bg-[#080808] text-white relative z-20 border-t border-white/5" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-xl mb-20">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] uppercase mb-4">
            {t("researchTitle" as any) || "Silicon Research Lab"}
          </h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
            {t("researchHeading" as any) || "Silicon Innovation"}
          </h3>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Section (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-white/95">
              {t("researchSub" as any) || 
                "Pushing the boundaries of thermodynamic hashing efficiency on a custom 5nm TSMC process node."}
            </p>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-[#00f2ff]/30 to-transparent" />

            <div className="space-y-6 text-gray-500 font-medium text-sm leading-relaxed max-w-2xl">
              <p>
                {t("researchParagraph1" as any) ||
                  "Through direct collaboration with global semiconductor foundries, AppsMiner custom designs ASIC chip microarchitectures specifically optimized for SHA-256 logic gates. By pruning non-essential instruction sets at the hardware layout level, we achieve up to 40% higher efficiency than off-the-shelf mining hardware."}
              </p>
              <p>
                {t("researchParagraph2" as any) ||
                  "Our current research focus lies in liquid-cooled multi-die modules that dissipate heat directly through synthetic dielectric fluid loops. This engineering breakthrough allows custom silicon dies to run at peak speeds with zero thermal throttling, extending the overall hardware lifetime to over 5 years."}
              </p>
            </div>

            {/* Micro-specs grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 max-w-xl">
              <div className="glass-card p-5 border border-white/5">
                <Cpu size={20} className="text-[#00f2ff] mb-3" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Gate Density</p>
                <p className="text-sm font-black text-white">130M+ gates/mm²</p>
              </div>
              <div className="glass-card p-5 border border-white/5">
                <Thermometer size={20} className="text-[#00f2ff] mb-3" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Resistance</p>
                <p className="text-sm font-black text-white">0.12 K/W Temp</p>
              </div>
              <div className="glass-card p-5 border border-white/5">
                <Layers size={20} className="text-[#00f2ff] mb-3" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Core Voltage</p>
                <p className="text-sm font-black text-white">0.42V Low-Volt</p>
              </div>
            </div>
          </div>

          {/* Image Section (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Visual background glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,transparent_60%)] pointer-events-none" />
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass-card-dark p-4 border border-white/10 relative overflow-hidden group shadow-2xl"
            >
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-black/40">
                <Image
                  src="/Products/research-chip.png"
                  alt="ASIC Research Silicon"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-w-768px) 100vw, 50vw"
                  priority
                />
                
                {/* Tech overlay markings */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-white/50 tracking-wider">
                  <span>APPSMINER // LAB 02</span>
                  <span>5NM ASIC DIE VERIFICATION</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
