"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslation, LANGUAGES, LanguageCode } from "@/context/LanguageContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t, isRtl } = useTranslation();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Hide global navbar on dashboard or login pages to avoid layout conflicts
  if (pathname === "/dashboard" || pathname === "/login") {
    return null;
  }

  const navLinks = [
    { labelKey: "navProducts" as const, href: "/#products" },
    { labelKey: "navServices" as const, href: "/#services" },
    { labelKey: "navPrices" as const, href: "/#prices" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#f8f9fa]/80 backdrop-blur-2xl border-b border-black/10 shadow-sm" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Icon-only mark — no white background bleed */}
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="appsminers icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-black group-hover:text-gray-700 transition-colors">
                appsminers
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.href)}
                className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* CTA + Language Selector + mobile toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Desktop Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setDesktopLangOpen(!desktopLangOpen)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors bg-black/5 hover:bg-black/10 px-3.5 py-2 rounded-full border border-black/5"
              >
                <Globe size={14} className="text-gray-600" />
                <span>{language.code}</span>
                <ChevronDown size={12} className={`text-gray-500 transition-transform ${desktopLangOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {desktopLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-black/10 rounded-2xl shadow-2xl z-50 min-w-[200px] py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-black/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select Region</span>
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setDesktopLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-black/5 transition-colors flex items-center justify-between ${
                          language.code === lang.code ? "bg-[#00f2ff]/10 text-black" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        <span className="text-[10px] font-black text-gray-400">{lang.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/login"
              className="hidden md:flex px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {t("navLogin")}
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
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Mobile logo */}
            <div className="flex items-center gap-3 pb-4 border-b border-black/10">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="appsminers icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base font-black tracking-tighter text-black">appsminers</span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  handleHashClick(e, link.href);
                }}
                className="text-lg font-black uppercase tracking-widest text-black"
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Mobile Language Expandable Section */}
            <div className="border-t border-black/10 pt-4">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="w-full flex items-center justify-between text-sm font-black uppercase tracking-widest text-gray-500 py-2"
              >
                <span className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>{t("navTerminal")} Language: {language.name}</span>
                </span>
                <ChevronDown size={16} className={`transition-transform ${mobileLangOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {mobileLangOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 mt-2 bg-black/5 p-2 rounded-2xl"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setMobileLangOpen(false);
                          setMobileOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-black/5 rounded-xl transition-colors flex items-center justify-between ${
                          language.code === lang.code ? "bg-[#00f2ff]/20 text-black font-black" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        <span>{lang.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-6 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full text-center"
            >
              {t("navLogin")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
