"use client";

import { Shield, Wallet, Repeat } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function CryptoServices() {
  const { t, isRtl } = useTranslation();

  return (
    <section id="services" className="py-32 bg-[#080808] text-white relative z-20" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] uppercase mb-4">
              {t("servicesHeading")}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
              {t("servicesTitle1")} <br />
              <span className="text-gray-600">{t("servicesTitle2")}</span>
            </h3>
          </div>
          <p className="text-gray-500 font-medium max-w-sm mb-2 text-sm leading-relaxed">
            {t("servicesDesc")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trading House */}
          <div className="glass-card-dark p-10 md:p-14 group">
            <Repeat size={36} className="text-[#00f2ff] mb-10" />
            <h4 className="text-3xl font-black mb-4 tracking-tight text-white">{t("servicesTradingHouseTitle")}</h4>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              {t("servicesTradingHouseDesc")}
            </p>
            <ul className="space-y-4 mb-12">
              {[t("servicesTradingHouseFeat1"), t("servicesTradingHouseFeat2"), t("servicesTradingHouseFeat3")].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                  <span className="text-sm font-bold text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-4 bg-white text-black hover:bg-[#00f2ff] rounded-full text-[11px] font-black tracking-widest uppercase transition-colors w-full hover:scale-[1.02] transition-all">
              {t("servicesTradingHouseCta")}
            </button>
          </div>

          {/* Hybrid Wallets */}
          <div className="glass-card-dark p-10 md:p-14 group">
            <Wallet size={36} className="text-[#00f2ff] mb-10" />
            <h4 className="text-3xl font-black mb-4 tracking-tight text-white">{t("servicesWalletTitle")}</h4>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              {t("servicesWalletDesc")}
            </p>
            <ul className="space-y-4 mb-12">
              {[t("servicesWalletFeat1"), t("servicesWalletFeat2"), t("servicesWalletFeat3")].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                  <span className="text-sm font-bold text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-4 bg-white text-black hover:bg-[#00f2ff] rounded-full text-[11px] font-black tracking-widest uppercase transition-colors w-full hover:scale-[1.02] transition-all">
              {t("servicesWalletCta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
