"use client";

import { useTranslation } from "@/context/LanguageContext";

export default function Features() {
  const { t } = useTranslation();

  const stats = [
    { value: "99.9%", label: t("featuresUptime") },
    { value: "24/7",  label: t("featuresSupport") },
    { value: "0%",    label: t("featuresPoolFees") },
    { value: "SAFE",  label: t("featuresProtocol") },
  ];

  return (
    <section className="bg-[#080808] py-24 text-white border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s) => (
            <div key={s.label} className="relative group">
              <p className="text-5xl md:text-7xl font-black text-white group-hover:text-[#00f2ff] transition-colors duration-300 tracking-tighter">
                {s.value}
              </p>
              <div className="h-[2px] w-8 bg-[#00f2ff] my-6 transition-all duration-500 group-hover:w-full" />
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.25em]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
