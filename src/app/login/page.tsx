"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, Mail, Eye, EyeOff, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, LANGUAGES, LanguageCode } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const { language, setLanguage, t, isRtl } = useTranslation();
  
  const [langOpen, setLangOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [mounted, setMounted] = useState(false);
  const [forceDemo, setForceDemo] = useState(false);
  const [showDemoFallback, setShowDemoFallback] = useState(false);

  useEffect(() => {
    setMounted(true);
    setForceDemo(localStorage.getItem("force-demo-mode") === "true");

    // Capture success checkout parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout_success") === "true") {
        setSuccessMsg("Simulated order placed successfully! Register or Sign In to access your secure Operator Dashboard.");
        const emailParam = params.get("email");
        if (emailParam) {
          setEmail(emailParam);
        }
        setAuthMode("signup");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setShowDemoFallback(false);

    // Check if Supabase keys are empty or placeholder values
    const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockMode = forceDemo || !dbUrl || dbUrl.includes("placeholder-project") || dbUrl === "";

    if (isMockMode) {
      // Local Mock Demo Mode (helps users preview the app without configuration)
      setTimeout(() => {
        if (authMode === "signin") {
          if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            setLoading(false);
          } else {
            const mockSession = {
              user: { email: email },
              access_token: "mock-demo-token",
              expires_at: Math.floor(Date.now() / 1000) + 3600
            };
            localStorage.setItem("sb-placeholder-project-auth-token", JSON.stringify(mockSession));
            setSuccessMsg("Logged in (Local Demo Mode)!");
            setTimeout(() => {
              router.push("/dashboard");
            }, 800);
          }
        } else {
          setSuccessMsg("Account created successfully (Local Demo Mode)! Redirecting to Sign In...");
          setTimeout(() => {
            setAuthMode("signin");
            setSuccessMsg("");
            setLoading(false);
          }, 1500);
        }
      }, 1000);
      return;
    }

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === "Failed to fetch" || error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("network")) {
            setErrorMsg("Connection failed: Failed to fetch Supabase endpoint. Verify your internet connection or .env.local configuration.");
            setShowDemoFallback(true);
          } else {
            setErrorMsg(error.message);
          }
        } else {
          router.push("/dashboard");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message === "Failed to fetch" || error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("network")) {
            setErrorMsg("Connection failed: Failed to fetch Supabase endpoint. Verify your internet connection or .env.local configuration.");
            setShowDemoFallback(true);
          } else {
            setErrorMsg(error.message);
          }
        } else {
          if (data.session) {
            setSuccessMsg(t("authSignUpSuccess"));
            setTimeout(() => router.push("/dashboard"), 1500);
          } else {
            setSuccessMsg("Registration successful! Please check your email for a confirmation link.");
            setEmail("");
            setPassword("");
            setAuthMode("signin");
          }
        }
      }
    } catch (err: any) {
      const isFetchErr = err?.message === "Failed to fetch" || String(err).toLowerCase().includes("fetch") || String(err).toLowerCase().includes("network");
      if (isFetchErr) {
        setErrorMsg("Connection failed: Failed to fetch Supabase endpoint. Verify your internet connection or .env.local configuration.");
        setShowDemoFallback(true);
      } else {
        setErrorMsg("An unexpected connection error occurred.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Detect mock status to show indicator
  const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isMockMode = forceDemo || !dbUrl || dbUrl.includes("placeholder-project") || dbUrl === "";

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col justify-center items-center relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>

      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#001a33_0%,#030303_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f2ff]/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Top bar */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            {isRtl ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
            {t("authBackToHome")}
          </Link>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg border border-white/10"
            >
              <Globe size={14} />
              <span>{language.code}</span>
              <ChevronDown size={12} className={`text-gray-500 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[170px] py-1"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between ${
                        language.code === lang.code ? "bg-[#00f2ff]/20 text-white font-black" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] opacity-65">{lang.code}</span>
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
          <div className="text-center mb-8">
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
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 text-white uppercase">
              {t("authAccessSecured")}
            </h1>
            <p className="text-gray-500 text-xs">
              {t("authEnterCredentials")}
            </p>
          </div>

          {/* Demo Mode alert indicator */}
          {mounted && isMockMode && (
            <div className="p-3 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider text-center flex flex-col items-center gap-1">
              <span>⚠️ Local Demo Mode Active</span>
              {forceDemo && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("force-demo-mode");
                    setForceDemo(false);
                    setErrorMsg("");
                    setSuccessMsg("Switched back to live Supabase client. Retrying connection...");
                    setTimeout(() => setSuccessMsg(""), 2000);
                  }}
                  className="text-[9px] text-[#00f2ff] underline font-bold uppercase mt-1 hover:text-white transition-colors"
                >
                  Switch back to live Supabase Connection
                </button>
              )}
            </div>
          )}

          {/* Tab Mode switch */}
          <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                authMode === "signin" ? "bg-[#00f2ff] text-black" : "text-gray-500 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                authMode === "signup" ? "bg-[#00f2ff] text-black" : "text-gray-500 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback alerts */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {showDemoFallback && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("force-demo-mode", "true");
                      setForceDemo(true);
                      setErrorMsg("");
                      setShowDemoFallback(false);
                      setSuccessMsg("Switched to Local Demo Mode. You can now use any dummy credentials.");
                      setTimeout(() => setSuccessMsg(""), 3000);
                    }}
                    className="w-full py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors shadow-lg"
                  >
                    Activate Local Demo Mode
                  </button>
                )}
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                {t("authEmailLabel")}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {t("authPasswordLabel")}
                </label>
                {authMode === "signin" && (
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-white transition-colors">
                    {t("authForgot")}
                  </Link>
                )}
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
                  {authMode === "signin" ? "Authenticating…" : "Creating Account…"}
                </>
              ) : (
                authMode === "signin" ? t("authSignIn") : t("authSignUp")
              )}
            </motion.button>
          </form>

          {/* Toggle link below button */}
          <div className="text-center text-xs text-gray-600 mt-8 font-bold">
            {authMode === "signin" ? (
              <>
                {t("authNoAccount")}{" "}
                <button onClick={() => setAuthMode("signup")} className="text-white hover:text-[#00f2ff] transition-colors underline">
                  {t("authSignUp")}
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setAuthMode("signin")} className="text-white hover:text-[#00f2ff] transition-colors underline">
                  {t("authSignIn")}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
