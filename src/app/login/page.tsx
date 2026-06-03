"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "ZH", name: "中文" },
  { code: "RU", name: "Русский" },
];

export default function Login() {
  const router = useRouter();
  const [langOpen, setLangOpen]       = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate auth → redirect to dashboard
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col justify-center items-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#001a33_0%,#030303_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f2ff]/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Top bar */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Globe size={14} /> {selectedLang.code}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[130px]"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card p-10 border border-white/10 shadow-2xl"
        >
          {/* Logo + title */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="relative w-14 h-14">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiner"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2 text-white">ACCESS SECURED</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                  placeholder="you@appsminer.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#00f2ff] text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-[0_10px_30px_rgba(0,242,255,0.2)] mt-4 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Authenticate"
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8 font-bold">
            No account?{" "}
            <Link href="#" className="text-white hover:text-[#00f2ff] transition-colors">
              Apply for Access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
