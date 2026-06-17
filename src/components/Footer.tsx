"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GitBranch, MessageCircle, Globe, Mail, ArrowUpRight, Zap } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

// Localized Footer Data
const FOOTER_I18N: Record<string, any> = {
  EN: {
    desc: "Industrial-grade ASIC mining hardware, institutional trading, and enterprise-level asset security.",
    navCols: [
      {
        title: "Products",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "Services",
        links: ["Mining Pool", "Trading House", "Hot Wallet", "Cold Storage", "API Access"],
      },
      {
        title: "Company",
        links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
      },
      {
        title: "Legal",
        links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
      },
    ]
  },
  AR: {
    desc: "أجهزة تعدين ASIC بمستوى صناعي، تداول مؤسسي، وأمان أصول بمستوى الشركات.",
    navCols: [
      {
        title: "المنتجات",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "الخدمات",
        links: ["مجمع التعدين", "بيت التداول", "المحفظة الساخنة", "الخزنة الباردة", "وصول API"],
      },
      {
        title: "الشركة",
        links: ["من نحن", "المدونة", "الوظائف", "حقيبة الصحافة", "اتصل بنا"],
      },
      {
        title: "القانونية",
        links: ["سياسة الخصوصية", "شروط الخدمة", "سياسة الكوكيز", "الالتزام والامتثال"],
      },
    ]
  },
  HI: {
    desc: "औद्योगिक-ग्रेड ASIC माइनिंग हार्डवेयर, संस्थागत ट्रेडिंग, और एंटरप्राइज-स्तरीय परिसंपत्ति सुरक्षा।",
    navCols: [
      {
        title: "उत्पाद",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "सेवाएं",
        links: ["माइनिंग पूल", "ट्रेडिंग हाउस", "हॉट वॉलेट", "कोल्ड स्टोरेज", "एपीआई एक्सेस"],
      },
      {
        title: "कंपनी",
        links: ["हमारे बारे में", "ब्लॉग", "करियर", "प्रेस किट", "संपर्क"],
      },
      {
        title: "कानूनी",
        links: ["गोपनीयता नीति", "सेवा की शर्तें", "कुकी नीति", "अनुपालन"],
      },
    ]
  },
  DE: {
    desc: "ASIC-Mining-Hardware in Industriequalität, institutioneller Handel und Asset-Sicherheit auf Unternehmensebene.",
    navCols: [
      {
        title: "Produkte",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "Services",
        links: ["Mining-Pool", "Handelshaus", "Hot Wallet", "Cold Storage", "API-Zugang"],
      },
      {
        title: "Unternehmen",
        links: ["Über uns", "Blog", "Karriere", "Presse-Kit", "Kontakt"],
      },
      {
        title: "Rechtliches",
        links: ["Datenschutzerklärung", "Nutzungsbedingungen", "Cookie-Richtlinie", "Compliance"],
      },
    ]
  },
  FR: {
    desc: "Matériel de minage ASIC de qualité industrielle, trading institutionnel et sécurité des actifs de niveau entreprise.",
    navCols: [
      {
        title: "Produits",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "Services",
        links: ["Pool de Minage", "Maison de Trading", "Hot Wallet", "Stockage Froid", "Accès API"],
      },
      {
        title: "Société",
        links: ["À Propos", "Blog", "Recrutement", "Espace Presse", "Contact"],
      },
      {
        title: "Légal",
        links: ["Confidentialité", "Conditions d'Utilisation", "Gestion des Cookies", "Conformité"],
      },
    ]
  },
  ES: {
    desc: "Hardware de minería ASIC de grado industrial, trading institucional y seguridad de activos a nivel empresarial.",
    navCols: [
      {
        title: "Productos",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "Servicios",
        links: ["Pool de Minería", "Casa de Trading", "Billetera Caliente", "Bóveda Fría", "Acceso API"],
      },
      {
        title: "Compañía",
        links: ["Sobre Nosotros", "Blog", "Empleo", "Prensa", "Contacto"],
      },
      {
        title: "Legal",
        links: ["Privacidad", "Términos de Servicio", "Política de Cookies", "Cumplimiento"],
      },
    ]
  },
  BN: {
    desc: "শিল্প-মানের ASIC মাইনিং হার্ডওয়্যার, প্রাতিষ্ঠানিক ক্রিপ্টো ট্রেডিং এবং এন্টারপ্রাইজ-স্তরের সম্পদ নিরাপত্তা ব্যবস্থা।",
    navCols: [
      {
        title: "পণ্যসমূহ",
        links: ["T200 Pro", "F100 Pro", "F50 Pro", "AppsMiners Mini", "AppsMiners Nano", "AppsMiners Pocket"],
      },
      {
        title: "সেবাসমূহ",
        links: ["মাইনিং পুল", "ট্রেডিং হাউজ", "হট ওয়ালেট", "কোল্ড স্টোরেজ", "এপিআই অ্যাক্সেস"],
      },
      {
        title: "কোম্পানি",
        links: ["আমাদের কথা", "ব্লগ", "ক্যারিয়ার", "প্রেস কিট", "যোগাযোগ"],
      },
      {
        title: "আইনি",
        links: ["গোপনীয়তা নীতি", "পরিষেবার শর্তাবলী", "কুকি নীতি", "কমপ্লায়েন্স"],
      },
    ]
  }
};

const SOCIALS = [
  { icon: MessageCircle, href: "#", label: "Twitter/X"  },
  { icon: GitBranch,     href: "#", label: "GitHub"     },
  { icon: Globe,         href: "#", label: "LinkedIn"   },
  { icon: Mail,          href: "#", label: "Email"      },
];

export default function Footer() {
  const { language, t, isRtl } = useTranslation();
  const code = language.code;
  const labels = FOOTER_I18N[code] || FOOTER_I18N.EN;

  const getFooterLinkHref = (link: string) => {
    const lower = link.toLowerCase();
    
    // Products
    if (lower.includes("pro") || lower.includes("mini") || lower.includes("nano") || lower.includes("pocket")) {
      if (lower.includes("pro") || lower.includes("t200") || lower.includes("f100") || lower.includes("f50")) {
        return "/#flagship-series";
      }
      return "/#micro-series";
    }
    
    // Services
    if (
      lower.includes("pool") || 
      lower.includes("tread") || 
      lower.includes("trad") || 
      lower.includes("wal") || 
      lower.includes("stor") || 
      lower.includes("api") ||
      lower.includes("পুল") ||
      lower.includes("ট্রেড") ||
      lower.includes("ওয়ালেট") ||
      lower.includes("স্টোরেজ") ||
      lower.includes("تداول") ||
      lower.includes("محفظة") ||
      lower.includes("تعدين") ||
      lower.includes("خزنة")
    ) {
      return "/#services";
    }
    
    // Company / FAQ
    if (
      lower.includes("about") || 
      lower.includes("blog") || 
      lower.includes("career") || 
      lower.includes("press") || 
      lower.includes("contact") ||
      lower.includes("আমাদের") ||
      lower.includes("যোগাযোগ") ||
      lower.includes("من نحن") ||
      lower.includes("اتصل") ||
      lower.includes("करियर") ||
      lower.includes("संपर्क")
    ) {
      return "/#features";
    }
    
    // Legal
    if (
      lower.includes("privac") || 
      lower.includes("term") || 
      lower.includes("cooki") || 
      lower.includes("complian") ||
      lower.includes("নীতি") ||
      lower.includes("শর্ত") ||
      lower.includes("خصوصية") ||
      lower.includes("شروط") ||
      lower.includes("कानूनी")
    ) {
      return "/login";
    }
    
    return "/#products";
  };

  const stats = [
    { value: "200+",    label: t("footerStatsCountries") },
    { value: "$1.2B+",  label: t("footerStatsSecured") },
    { value: "99.9%",   label: t("footerStatsUptime") },
    { value: "24/7",    label: t("footerStatsSupport") },
  ];

  return (
    <footer className="bg-[#030303] text-white border-t border-white/5" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── CTA Band ───────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-3">
              {isRtl ? (
                <>
                  جاهز للتعدين<br />
                  <span className="text-gray-600">على نطاق واسع؟</span>
                </>
              ) : (
                <>
                  {t("footerCtaTitle").split(" ")[0]} {t("footerCtaTitle").split(" ")[1]} {t("footerCtaTitle").split(" ")[2]}<br />
                  <span className="text-gray-600">
                    {t("footerCtaTitle").split(" ").slice(3).join(" ")}
                  </span>
                </>
              )}
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              {t("footerCtaDesc")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <motion.a
              href="/login"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#00f2ff] transition-colors"
            >
              {t("footerCtaGetStarted")} <ArrowUpRight size={14} />
            </motion.a>
            <motion.a
              href="/#products"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 glass-card-dark rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 hover:border-white/30 transition-colors"
            >
              {t("footerCtaBookDemo")}
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Stats Band ─────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer ────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {/* Icon version of logo on dark bg */}
              <div className="relative w-10 h-10 bg-white rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiners icon"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">AppsMiners</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {labels.desc}
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  title={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#3b82f6] hover:border-[#3b82f6]/40 transition-colors"
                >
                  <s.icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {labels.navCols.map((col: any) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link: string) => (
                  <li key={link}>
                    <Link
                      href={getFooterLinkHref(link)}
                      className="text-sm font-medium text-gray-500 hover:text-white transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Applications Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-5">
              {language.code === "BN" ? "অ্যাপস" : language.code === "AR" ? "التطبيقات" : language.code === "HI" ? "ऐप्स" : "Applications"}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/appsminers.apk"
                  download="appsminers.apk"
                  className="text-sm font-medium text-gray-500 hover:text-white transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Android App (APK)
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-500 hover:text-white transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  iOS App (PWA)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Icon logo on dark background */}
          <div className="flex items-center gap-4">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/Products/icon blue.png"
                alt="AppsMiners"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-gray-600 text-xs font-medium">
              © {new Date().getFullYear()} AppsMiners. {t("footerAllRightsReserved")}
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1">
              <Zap size={10} className="text-[#3b82f6]" /> {t("footerSystemsOperational")}
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
