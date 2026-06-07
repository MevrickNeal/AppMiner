"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, Mail, Eye, EyeOff, ChevronDown, CheckCircle, AlertTriangle, User, Hash, MapPin, Phone, Calendar, Key, Shield } from "lucide-react";
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
  
  // Extended signup fields
  const [username, setUsername] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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

    localStorage.removeItem("appsminers_demo");

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("appsminers_auth_change"));
          }
          router.push("/dashboard");
        }
      } else {
        // Basic validation for signup
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (transactionPin !== confirmPin) {
          setErrorMsg("Transaction PINs do not match.");
          setLoading(false);
          return;
        }
        if (securityKey !== confirmKey) {
          setErrorMsg("Security Keys do not match.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              reference_code: referenceCode,
              first_name: firstName,
              last_name: lastName,
              country,
              phone_number: phone,
              date_of_birth: dob,
              transaction_pin: transactionPin,
              security_key: securityKey
            }
          }
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          if (data.session) {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("appsminers_auth_change"));
            }
            setSuccessMsg(t("authSignUpSuccess"));
            setTimeout(() => router.push("/dashboard"), 1500);
          } else {
            setSuccessMsg("Registration successful! Please check your email for a confirmation link.");
            // Optional: reset fields
            setEmail("");
            setPassword("");
            setAuthMode("signin");
          }
        }
      }
    } catch (err: any) {
      setErrorMsg("An unexpected connection error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col justify-center items-center relative overflow-hidden py-12" dir={isRtl ? "rtl" : "ltr"}>

      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#001a33_0%,#030303_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f2ff]/8 rounded-full blur-[140px]" />
      </div>

      <div className={`relative z-10 w-full transition-all duration-500 px-6 ${authMode === "signup" ? "max-w-3xl" : "max-w-md"}`}>

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
          className="glass-card p-6 md:p-10 border border-white/10 shadow-2xl"
        >
          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="relative w-14 h-14">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiners"
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




          {/* Tab Mode switch */}
          <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 mb-6 max-w-md mx-auto">
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
                className="p-4 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2 max-w-md mx-auto"
              >
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 max-w-md mx-auto"
              >
                <CheckCircle size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-5 ${authMode === "signup" ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 space-y-0" : "max-w-md mx-auto"}`}>
            
            {/* Extended fields for signup */}
            {authMode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">User Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Reference Code (Optional)</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      value={referenceCode}
                      onChange={(e) => setReferenceCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Ref Code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Last Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Country</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email (Always shown) */}
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
                  placeholder="you@appsminers.com"
                />
              </div>
            </div>

            {/* Password (Always shown) */}
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

            {/* Confirm Password */}
            {authMode === "signup" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Transaction PIN and Security Key */}
            {authMode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Transaction PIN</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={transactionPin}
                      onChange={(e) => setTransactionPin(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="PIN"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirm PIN</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="PIN"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Security Key</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={securityKey}
                      onChange={(e) => setSecurityKey(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Security Key"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirm Security Key</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={confirmKey}
                      onChange={(e) => setConfirmKey(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-12 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 transition-colors text-sm"
                      placeholder="Security Key"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <div className={authMode === "signup" ? "md:col-span-2 mt-4" : "mt-4"}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#00f2ff] text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-[0_10px_30px_rgba(0,242,255,0.2)] disabled:opacity-60 flex items-center justify-center gap-3"
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
            </div>
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
