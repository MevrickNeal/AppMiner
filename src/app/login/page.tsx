"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Lock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "ZH", name: "中文" },
  { code: "RU", name: "Русский" },
];

export default function Login() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#001a33_0%,#000000_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Globe size={14} />
              {selectedLang.code}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors min-w-[120px]"
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter mb-2">ACCESS SECURED</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access the fortress.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@appsminer.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all hover:bg-primary-dark shadow-[0_10px_20px_rgba(0,242,255,0.2)] mt-8 group">
              <span className="group-hover:scale-105 transition-transform inline-block">Authenticate</span>
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 font-bold">
            Don't have an account? <Link href="#" className="text-white hover:text-primary transition-colors">Apply for Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
