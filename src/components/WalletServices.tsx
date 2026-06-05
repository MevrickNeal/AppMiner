"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Snowflake, Shield, Lock, Zap, CheckCircle2,
  ArrowRight, Eye, EyeOff, Usb, Key, X, Loader2, HardDrive
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

// Localized Wallet Dictionary
const WALLET_I18N: Record<string, any> = {
  EN: {
    assetSecurity: "Asset Security",
    hybrid: "Hybrid",
    walletSystem: "Wallet System",
    description: "AppsMiners's layered wallet architecture keeps your liquid funds accessible and your long-term holdings impenetrable.",
    portfolioAllocation: "Portfolio Allocation",
    totalPortfolioValue: "Total Portfolio Value",
    hotWalletLabel: "Hot Wallet",
    coldStorageLabel: "Cold Storage",
    hotSubtitle: "Instant Access",
    coldSubtitle: "Maximum Security",
    hotDesc: "Multi-signature hot wallets for daily operations. Funds stay liquid and accessible 24/7 while protected by enterprise-grade security.",
    coldDesc: "Air-gapped cold storage vaults for long-term asset protection. Your primary holdings stay offline and beyond any remote attack vector.",
    hotCta: "Access Hot Wallet",
    coldCta: "Open Cold Vault",
    hotStats: [
      { label: "Max Balance",  value: "$500K" },
      { label: "Tx Speed",     value: "< 2s" },
      { label: "Signatories",  value: "3 of 5 Multi-Sig" },
    ],
    coldStats: [
      { label: "Insurance",  value: "$150M Policy" },
      { label: "Locations",  value: "5 Geographies" },
      { label: "Encryption", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "Multi-signature authorization",
      "Real-time transaction monitoring",
      "Instant settlement to exchange",
      "Auto-sweep to cold at threshold",
    ],
    coldFeatures: [
      "Air-gapped hardware vaults",
      "Geographically distributed backups",
      "Biometric + hardware key auth",
      "Quarterly third-party audits",
    ],
    secTitle: "Security Architecture",
    layers: [
      { label: "Multi-Sig (3/5)",  desc: "No single point of compromise" },
      { label: "HSM Encryption",   desc: "Hardware Security Module protected" },
      { label: "Auto-Sweep Rules", desc: "Threshold-based cold transfers" },
      { label: "$150M Insurance",  desc: "Fully insured holdings" },
    ],
  },
  AR: {
    assetSecurity: "أمان الأصول",
    hybrid: "نظام محفظة",
    walletSystem: "هجين ومتكامل",
    description: "تحافظ بنية المحفظة متعددة الطبقات من AppsMiners على إمكانية الوصول إلى أموالك السائلة بينما تجعل ممتلكاتك طويلة الأجل غير قابلة للاختراق.",
    portfolioAllocation: "توزيع المحفظة الاستثمارية",
    totalPortfolioValue: "إجمالي قيمة المحفظة",
    hotWalletLabel: "محفظة ساخنة",
    coldStorageLabel: "خزنة باردة",
    hotSubtitle: "وصول فوري",
    coldSubtitle: "أقصى درجات الأمان",
    hotDesc: "محافظ ساخنة متعددة التوقيعات للعمليات اليومية. تظل الأموال سائلة ويمكن الوصول إليها على مدار الساعة طوال الأسبوع مع حمايتها بأمان مؤسسي.",
    coldDesc: "خزائن تخزين باردة معزولة عن شبكة الإنترنت لحماية الأصول على المدى الطويل. تظل ممتلكاتك الرئيسية غير متصلة بالإنترنت وبعيدة عن هجمات الاختراق.",
    hotCta: "دخول المحفظة الساخنة",
    coldCta: "افتح الخزنة الباردة",
    hotStats: [
      { label: "الحد الأقصى للرصيد", value: "٥٠٠ ألف دولار" },
      { label: "سرعة المعاملة", value: "أقل من ثانية" },
      { label: "التوقيعات", value: "توقيع متعدد ٣ من ٥" },
    ],
    coldStats: [
      { label: "التأمين", value: "بوليصة بـ ١٥٠M$" },
      { label: "المواقع الجغرافية", value: "٥ مواقع دولية" },
      { label: "التشفير", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "ترخيص متعدد التوقيعات للأمان",
      "مراقبة المعاملات في الوقت الفعلي",
      "تسوية فورية للمنصة الرقمية",
      "سحب تلقائي للخزنة الباردة عند حد معين",
    ],
    coldFeatures: [
      "خزائن أجهزة معزولة تماماً",
      "نسخ احتياطية موزعة جغرافياً",
      "مصادقة بالمؤشرات الحيوية والمفاتيح",
      "تدقيق ربع سنوي من طرف ثالث مستقل",
    ],
    secTitle: "بنية الحماية والأمان",
    layers: [
      { label: "توقيع متعدد (٣/٥)", desc: "لا توجد نقطة اختراق واحدة للخلل" },
      { label: "تشفير HSM المتقدم", desc: "محمي بوحدة أمان الأجهزة المخصصة" },
      { label: "قواعد السحب التلقائي", desc: "تحويلات باردة بناءً على عتبة محددة" },
      { label: "تأمين بقيمة ١٥٠M$", desc: "أصول مؤمنة بالكامل ضد المخاطر" },
    ],
  },
  HI: {
    assetSecurity: "परिसंपत्ति सुरक्षा",
    hybrid: "हाइब्रिड",
    walletSystem: "वॉलेट सिस्टम",
    description: "AppsMiners का स्तरित वॉलेट आर्किटेक्चर आपके तरल फंड को सुलभ रखता है और आपकी दीर्घकालिक संपत्ति को अभेद्य बनाता है।",
    portfolioAllocation: "पोर्टफोलियो आवंटन",
    totalPortfolioValue: "कुल पोर्टफोलियो मूल्य",
    hotWalletLabel: "हॉट वॉलेट",
    coldStorageLabel: "कोल्ड स्टोरेज",
    hotSubtitle: "तत्काल पहुंच",
    coldSubtitle: "अधिकतम सुरक्षा",
    hotDesc: "दैनिक कार्यों के लिए बहु-हस्ताक्षर हॉट वॉलेट। उद्यम-स्तर की सुरक्षा द्वारा सुरक्षित रहते हुए फंड 24/7 तरल और सुलभ रहते हैं।",
    coldDesc: "दीर्घकालिक परिसंपत्ति सुरक्षा के लिए एयर-गैप्ड कोल्ड स्टोरेज वॉल्ट। आपकी प्राथमिक संपत्ति ऑफ़लाइन और किसी भी दूरस्थ हमले से सुरक्षित रहती है।",
    hotCta: "हॉट वॉलेट तक पहुंचें",
    coldCta: "कोल्ड वॉल्ट खोलें",
    hotStats: [
      { label: "अधिकतम सीमा", value: "$500K" },
      { label: "लेनदेन गति", value: "< 2s" },
      { label: "हस्ताक्षरकर्ता", value: "3 of 5 Multi-Sig" },
    ],
    coldStats: [
      { label: "बीमा पॉलिसी", value: "$150M पॉलिसी" },
      { label: "स्थान", value: "5 Geographies" },
      { label: "एन्क्रिप्शन", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "बहु-हस्ताक्षर प्राधिकरण नियम",
      "वास्तविक समय लेनदेन निगरानी",
      "एक्सचेंज पर तत्काल निपटान",
      "सीमा पार होने पर ऑटो-स्वीप व्यवस्था",
    ],
    coldFeatures: [
      "एयर-गैप्ड हार्डवेयर वॉल्ट्स",
      "भौगोलिक रूप से वितरित बैकअप",
      "बायोमेट्रिक + हार्डवेयर कुंजी प्रमाणीकरण",
      "त्रैमासिक तृतीय-पक्ष सुरक्षा ऑडिट",
    ],
    secTitle: "सुरक्षा वास्तुकला",
    layers: [
      { label: "मल्टी-सिग (3/5)", desc: "समझौता का कोई एक बिंदु नहीं" },
      { label: "HSM एन्क्रिप्शन", desc: "हार्डवेयर सुरक्षा मॉड्यूल द्वारा सुरक्षित" },
      { label: "ऑटो-स्वीप नियम", desc: "सीमा-आधारित कोल्ड ट्रांसफर" },
      { label: "$150M बीमा", desc: "पूरी तरह से बीमाकृत होल्डिंग्स" },
    ],
  },
  DE: {
    assetSecurity: "Asset-Sicherheit",
    hybrid: "Hybrides",
    walletSystem: "Wallet-System",
    description: "Die mehrschichtige Wallet-Architektur von AppsMiners hält Ihre liquiden Mittel griffbereit und schützt Ihr langfristiges Vermögen kompromisslos.",
    portfolioAllocation: "Portfolio-Allokation",
    totalPortfolioValue: "Gesamter Portfoliowert",
    hotWalletLabel: "Hot Wallet",
    coldStorageLabel: "Cold Storage",
    hotSubtitle: "Sofortiger Zugriff",
    coldSubtitle: "Maximale Sicherheit",
    hotDesc: "Multi-Signatur-Hot-Wallets für tägliche Transaktionen. Das Guthaben bleibt 24/7 verfügbar und wird durch Enterprise-Sicherheit geschützt.",
    coldDesc: "Physisch isolierte Cold-Storage-Tresore zum langfristigen Schutz Ihrer Assets. Ihr Hauptvermögen bleibt offline und geschützt vor Online-Angriffen.",
    hotCta: "Hot Wallet öffnen",
    coldCta: "Cold Vault öffnen",
    hotStats: [
      { label: "Max. Limit", value: "$500K" },
      { label: "Tx-Geschw.", value: "< 2s" },
      { label: "Signaturen", value: "3 von 5 Multi-Sig" },
    ],
    coldStats: [
      { label: "Versicherung", value: "$150 Mio. Police" },
      { label: "Standorte", value: "5 Regionen" },
      { label: "Verschlüss.", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "Multi-Signatur-Freigaben",
      "Transaktionsüberwachung in Echtzeit",
      "Direkte Anbindung an die Handelsbörse",
      "Automatischer Übertrag an Cold Vault bei Limitüberschreitung",
    ],
    coldFeatures: [
      "Physisch isolierte Hardware-Tresore",
      "Geografisch verteilte Datensicherungen",
      "Biometrische Authentifizierung",
      "Vierteljährliche unabhängige Audits",
    ],
    secTitle: "Sicherheitsarchitektur",
    layers: [
      { label: "Multi-Sig (3/5)", desc: "Keine einzelne Schwachstelle im System" },
      { label: "HSM-Verschlüsselung", desc: "Durch Hardware-Sicherheitsmodule geschützt" },
      { label: "Auto-Sweep Regeln", desc: "Grenzwertbasierte Cold-Transfers" },
      { label: "$150M Versicherung", desc: "Vollständig versicherte Einlagen" },
    ],
  },
  FR: {
    assetSecurity: "Sécurité des Actifs",
    hybrid: "Système",
    walletSystem: "de Portefeuille Hybride",
    description: "L'architecture multicouche de portefeuille d'AppsMiners permet de garder vos fonds liquides accessibles tout en protégeant vos avoirs à long terme de manière inviolable.",
    portfolioAllocation: "Allocation du Portefeuille",
    totalPortfolioValue: "Valeur Totale du Portefeuille",
    hotWalletLabel: "Hot Wallet",
    coldStorageLabel: "Stockage à Froid",
    hotSubtitle: "Accès Instantané",
    coldSubtitle: "Sécurité Maximale",
    hotDesc: "Portefeuilles chauds multi-signatures pour les opérations quotidiennes. Les fonds restent liquides et disponibles 24/7 sous sécurité d'entreprise.",
    coldDesc: "Coffres-forts froids isolés pour protéger durablement les actifs. Vos fonds principaux restent hors ligne et à l'abri de toute attaque à distance.",
    hotCta: "Accéder au Hot Wallet",
    coldCta: "Ouvrir le Coffre Froid",
    hotStats: [
      { label: "Solde Max", value: "500 K$" },
      { label: "Vitesse Tx", value: "< 2s" },
      { label: "Signataires", value: "Multi-Sig 3 sur 5" },
    ],
    coldStats: [
      { label: "Assurance", value: "Police de 150 M$" },
      { label: "Localisations", value: "5 Pays" },
      { label: "Chiffrement", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "Autorisation par signatures multiples",
      "Surveillance des transactions en temps réel",
      "Règlement instantané vers l'échange",
      "Transfert automatique vers coffre froid au-delà du seuil",
    ],
    coldFeatures: [
      "Coffres-forts matériels hors ligne",
      "Sauvegardes géographiquement distribuées",
      "Authentification biométrique et clé physique",
      "Audits trimestriels par tiers indépendants",
    ],
    secTitle: "Architecture de Sécurité",
    layers: [
      { label: "Multi-Sig (3/5)", desc: "Aucun point unique de défaillance" },
      { label: "Chiffrement HSM", desc: "Sécurisé par module matériel de sécurité" },
      { label: "Règles d'Auto-Balayage", desc: "Transferts automatiques basés sur des seuils" },
      { label: "Assurance 150 M$", desc: "Avoirs entièrement couverts" },
    ],
  },
  ES: {
    assetSecurity: "Seguridad de Activos",
    hybrid: "Sistema de",
    walletSystem: "Billeteras Híbrido",
    description: "La arquitectura multicapa de AppsMiners mantiene sus fondos líquidos listos para operar mientras sus activos principales permanecen inexpugnables.",
    portfolioAllocation: "Asignación del Portafolio",
    totalPortfolioValue: "Valor Total del Portafolio",
    hotWalletLabel: "Billetera Caliente",
    coldStorageLabel: "Bóveda Fría",
    hotSubtitle: "Acceso Instantáneo",
    coldSubtitle: "Máxima Seguridad",
    hotDesc: "Billeteras calientes multifirma para operaciones diarias. Los fondos siguen disponibles las 24 horas del día bajo medidas de seguridad empresariales.",
    coldDesc: "Bóvedas frías fuera de línea para proteger activos a largo plazo. Sus tenencias principales no se conectan a internet para evitar ataques remotos.",
    hotCta: "Acceder a Billetera Caliente",
    coldCta: "Abrir Bóveda Fría",
    hotStats: [
      { label: "Saldo Máx", value: "$500K" },
      { label: "Velocidad Tx", value: "< 2s" },
      { label: "Firmantes", value: "Multifirma 3 de 5" },
    ],
    coldStats: [
      { label: "Seguro", value: "Póliza de $150M" },
      { label: "Ubicaciones", value: "5 Geografías" },
      { label: "Cifrado", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "Autorización mediante múltiples firmas",
      "Monitoreo de transacciones en tiempo real",
      "Liquidación instantánea en la plataforma",
      "Transferencia automática a bóveda fría por umbral",
    ],
    coldFeatures: [
      "Dispositivos físicos fuera de línea",
      "Copias de seguridad distribuidas",
      "Acceso mediante biometría y clave física",
      "Auditorías externas trimestrales",
    ],
    secTitle: "Arquitectura de Seguridad",
    layers: [
      { label: "Multifirma (3/5)", desc: "Sin un único punto de fallo en el sistema" },
      { label: "Cifrado con HSM", desc: "Seguro mediante módulo de hardware físico" },
      { label: "Reglas de Retiro Automático", desc: "Transferencias basadas en límites definidos" },
      { label: "Seguro de $150M", desc: "Fondos cubiertos en su totalidad" },
    ],
  },
  BN: {
    assetSecurity: "সম্পদ নিরাপত্তা",
    hybrid: "হাইব্রিড",
    walletSystem: "ওয়ালেট সিস্টেম",
    description: "অ্যাপ্সমাইনারের স্তরবিশিষ্ট ওয়ালেট আর্কিটেকচার আপনার প্রতিদিনের ব্যবহারের তহবিল সচল রাখে এবং সঞ্চিত মূল সম্পদকে রাখে দুর্ভেদ্য।",
    portfolioAllocation: "পোর্টফোলিও বন্টন",
    totalPortfolioValue: "মোট পোর্টফোলিও মূল্য",
    hotWalletLabel: "হট ওয়ালেট",
    coldStorageLabel: "কোল্ড স্টোরেজ",
    hotSubtitle: "তাত্ক্ষণিক এক্সেস",
    coldSubtitle: "সর্বোচ্চ নিরাপত্তা",
    hotDesc: "দৈনিক লেনদেনের জন্য মাল্টি-সিগনেচার হট ওয়ালেট। প্রফেশনাল-গ্রেড সুরক্ষায় তহবিল ২৪/৭ লিকুইড এবং অ্যাক্সেসযোগ্য থাকে।",
    coldDesc: "দীর্ঘমেয়াদী সম্পদ সুরক্ষার জন্য অফলাইন কোল্ড স্টোরেজ ভল্ট। আপনার প্রধান সঞ্চিত সম্পদ সম্পূর্ণরূপে অফলাইনে এবং যেকোনো সাইবার আক্রমণ থেকে নিরাপদ থাকে।",
    hotCta: "হট ওয়ালেট প্রবেশ করুন",
    coldCta: "কোল্ড ভল্ট খুলুন",
    hotStats: [
      { label: "সর্বোচ্চ ব্যালেন্স", value: "$৫০০K" },
      { label: "লেনদেনের গতি", value: "< ২ সেঃ" },
      { label: "স্বাক্ষরকারী", value: "৫ জনের মধ্যে ৩ জন" },
    ],
    coldStats: [
      { label: "বীমা কাভারেজ", value: "$১৫০M পলিসি" },
      { label: "অবস্থানসমূহ", value: "৫টি ভৌগোলিক দেশ" },
      { label: "এনক্রিপশন", value: "AES-256 + HSM" },
    ],
    hotFeatures: [
      "মাল্টি-সিগনেচার অনুমোদন ব্যবস্থা",
      "রিয়েল-টাইম লেনদেন পর্যবেক্ষণ",
      "এক্সচেঞ্জে তাত্ক্ষণিক তহবিল পাঠানো",
      "ব্যালেন্সের সীমা অতিক্রম করলে অটো কোল্ড-স্টোরেজে পাঠানো",
    ],
    coldFeatures: [
      "সম্পূর্ণ ইন্টারনেট-বিচ্ছিন্ন হার্ডওয়্যার ভল্ট",
      "ভৌগোলিকভাবে বিভক্ত একাধিক ব্যাকআপ ফাইল",
      "বায়োমেট্রিক + হার্ডওয়্যার কী নিরাপত্তা যাচাই",
      "প্রতি ৩ মাস অন্তর স্বাধীন থার্ড-পার্টি নিরীক্ষা",
    ],
    secTitle: "নিরাপত্তা আর্কিটেকচার",
    layers: [
      { label: "মাল্টি-সিগ (৩/৫)", desc: "নিরাপত্তায় কোনো একক দুর্বল পয়েন্ট নেই" },
      { label: "HSM এনক্রিপশন", desc: "হার্ডওয়্যার সিকিউরিটি মডিউল দ্বারা সুরক্ষিত" },
      { label: "অটো-সুইপ নিয়মাবলী", desc: "নির্দিষ্ট সীমার উপরে স্বয়ংক্রিয় স্থানান্তর" },
      { label: "$১৫০M ডলারের বীমা", desc: "সম্পূর্ণরূপে বীমাকৃত সংরক্ষিত সম্পদ" },
    ],
  }
};

// Fake balance bar
function BalanceMeter({ hot, cold, labels }: { hot: number; cold: number; labels: any }) {
  const total = hot + cold;
  const hotPct = (hot / total) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
        <span>{labels.portfolioAllocation}</span>
        <span>{total.toFixed(4)} BTC Total</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hotPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full rounded-l-full"
          style={{ background: "linear-gradient(to right, #f97316, #fb923c)" }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${100 - hotPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute right-0 top-0 h-full rounded-r-full"
          style={{ background: "linear-gradient(to left, #00f2ff, #22d3ee)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-black text-gray-500">
        <span className="text-orange-400">🔥 {hotPct.toFixed(0)}% {labels.hotWalletLabel}</span>
        <span className="text-[#00f2ff]">❄️ {(100 - hotPct).toFixed(0)}% {labels.coldStorageLabel}</span>
      </div>
    </div>
  );
}

export default function WalletServices({ btcPrice = 64250 }: { btcPrice?: number }) {
  const { language, isRtl } = useTranslation();
  const code = language.code;
  const labels = WALLET_I18N[code] || WALLET_I18N.EN;

  const [activeWallet, setActiveWallet] = useState<"hot" | "cold">("hot");
  const [showBalance, setShowBalance] = useState(true);

  // USB simulation state
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [usbStep, setUsbStep] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  // Dynamic values
  const activeIcon = activeWallet === "hot" ? Flame : Snowflake;
  const activeAccentColor = activeWallet === "hot" ? "#f97316" : "#00f2ff";
  const activeGlowColor = activeWallet === "hot" ? "rgba(249,115,22,0.15)" : "rgba(0,242,255,0.12)";
  const activeLabel = activeWallet === "hot" ? labels.hotWalletLabel : labels.coldStorageLabel;
  
  const activeSubtitle = activeWallet === "hot" 
    ? labels.hotSubtitle 
    : (vaultUnlocked ? "❄️ Unlocked via Hardware Key" : "🔒 USB Verification Required");
    
  const activeDesc = activeWallet === "hot" ? labels.hotDesc : labels.coldDesc;
  
  const activeBalance = activeWallet === "hot" 
    ? "4.2831 BTC" 
    : (vaultUnlocked ? "38.9210 BTC" : "••.•••• BTC");
    
  const activeUsd = activeWallet === "hot" 
    ? `$${(4.2831 * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
    : (vaultUnlocked ? `$${(38.9210 * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "$•,•••,•••");
    
  const activeStats = activeWallet === "hot" ? labels.hotStats : labels.coldStats;
  const activeFeatures = activeWallet === "hot" ? labels.hotFeatures : labels.coldFeatures;
  const activeCta = activeWallet === "hot" ? labels.hotCta : (vaultUnlocked ? "Manage Cold Vault" : "Unlock with USB Key");

  const startUsbVerification = () => {
    setUsbStep("verifying");
    setTimeout(() => {
      setUsbStep("success");
    }, 2000);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [typedKey, setTypedKey] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  // Focus keyboard listener input when modal opens
  useEffect(() => {
    if (showUsbModal && usbStep === "idle") {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showUsbModal, usbStep]);

  const handleInputChange = (val: string) => {
    setTypedKey(val);
    if (val.trim().startsWith("AppsMiners-PHYSICAL-KEY-") || val.trim().startsWith("AppsMiners-ATTINY85-ColdWallet-KEY-")) {
      setUsbStep("verifying");
      const timer = setTimeout(() => {
        setUsbStep("success");
        setTypedKey("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedKey.trim().startsWith("AppsMiners-PHYSICAL-KEY-") || typedKey.trim().startsWith("AppsMiners-ATTINY85-ColdWallet-KEY-")) {
      setUsbStep("verifying");
      const timer = setTimeout(() => {
        setUsbStep("success");
        setTypedKey("");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      alert("Invalid security key. Please ensure your physical key is inserted and correctly entered.");
    }
  };

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-white/5" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] uppercase mb-4">{labels.assetSecurity}</h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {labels.hybrid} <br /><span className="text-gray-600">{labels.walletSystem}</span>
            </h3>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed font-medium">
              {labels.description}
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">

          {/* Left panel — toggle + details */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Wallet toggle tabs */}
            <div className="glass-card p-1.5 flex gap-1">
              <button
                onClick={() => setActiveWallet("hot")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeWallet === "hot" ? "text-black" : "text-gray-600 hover:text-gray-400"
                }`}
                style={activeWallet === "hot" ? { backgroundColor: "#f97316" } : {}}
              >
                <Flame size={14} />
                {labels.hotWalletLabel}
              </button>
              <button
                onClick={() => setActiveWallet("cold")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeWallet === "cold" ? "text-black" : "text-gray-600 hover:text-gray-400"
                }`}
                style={activeWallet === "cold" ? { backgroundColor: "#00f2ff" } : {}}
              >
                <Snowflake size={14} />
                {labels.coldStorageLabel}
              </button>
            </div>

            {/* Balance card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWallet}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-6"
                style={{ boxShadow: `0 0 40px ${activeGlowColor}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${activeAccentColor}22` }}>
                      {activeWallet === "hot" ? <Flame size={16} className="text-orange-500" /> : <Snowflake size={16} className="text-[#00f2ff]" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{activeLabel}</p>
                      <p className="text-xs font-bold text-gray-400">{activeSubtitle}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBalance((v) => !v)} className="text-gray-600 hover:text-white transition-colors">
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <p className="text-3xl font-black mb-1" style={{ color: activeAccentColor }}>
                  {showBalance ? activeBalance : "••••• BTC"}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600 text-sm font-bold">
                    {showBalance ? activeUsd : "$•••,•••"}
                  </p>
                  {showBalance && (
                    <span 
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1.5 border"
                      style={{ 
                        color: activeAccentColor, 
                        borderColor: `${activeAccentColor}33`,
                        background: `${activeAccentColor}08`
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeAccentColor }} />
                      Live Rate
                    </span>
                  )}
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {activeStats.map((s: any) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">{s.label}</p>
                      <p className="text-xs font-black text-white">{s.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (activeWallet === "cold") {
                      if (!vaultUnlocked) {
                        setShowUsbModal(true);
                        setUsbStep("idle");
                      } else {
                        alert("Cold Vault accessed. Deep storage configurations authorized.");
                      }
                    } else {
                      alert("Hot wallet accessed. Daily transactions are operational.");
                    }
                  }}
                  className="w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: activeAccentColor, color: "#000" }}
                >
                  {activeCta} <ArrowRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Allocation meter */}
            <div className="glass-card p-5">
              <BalanceMeter hot={4.2831} cold={38.921} labels={labels} />
            </div>
          </div>

          {/* Right panel — features + security */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Feature list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`feat-${activeWallet}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 flex-1"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">{activeLabel} — Features</p>
                <p className="text-gray-400 leading-relaxed mb-8 text-sm">{activeDesc}</p>
                <ul className="space-y-4">
                  {activeFeatures.map((f: string, i: number) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${activeAccentColor}22` }}>
                        <CheckCircle2 size={12} style={{ color: activeAccentColor }} />
                      </div>
                      <span className="text-sm font-bold text-gray-300">{f}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Security layers */}
            <div className="glass-card p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-5">{labels.secTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                {labels.layers.map((l: any, idx: number) => {
                  const icons = [Shield, Lock, Zap, CheckCircle2];
                  const Icon = icons[idx] || Shield;
                  return (
                    <motion.div
                      key={l.label}
                      whileHover={{ scale: 1.03, borderColor: "rgba(0,242,255,0.3)" }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/8 cursor-default"
                    >
                      <Icon size={18} className="text-[#00f2ff] mb-2" />
                      <p className="text-xs font-black text-white mb-0.5">{l.label}</p>
                      <p className="text-[10px] text-gray-600">{l.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* USB Security Key Verification Modal */}
        <AnimatePresence>
          {showUsbModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-[#070707] border border-white/10 rounded-3xl p-8 overflow-hidden text-center"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowUsbModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                {usbStep === "idle" && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                      <Usb size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                        Physical Security Key Required
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed px-4">
                        Insert your physical security key to auto-verify, or enter your unique cryptographic key below.
                      </p>
                    </div>

                    {/* Hardware Input Field */}
                    <form onSubmit={handleFormSubmit} className="space-y-2 px-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={typedKey}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Waiting for physical key input..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl py-3.5 px-4 text-center font-mono text-xs text-[#00f2ff] focus:outline-none focus:border-[#00f2ff]/60 placeholder:text-zinc-700 transition-colors"
                        autoComplete="off"
                      />
                      <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                        Security Channel Active
                      </p>
                    </form>

                    <div className="flex flex-col gap-3 pt-2">
                      {/* Manual Simulation Option */}
                      <button
                        onClick={() => {
                          setTypedKey("AppsMiners-PHYSICAL-KEY-7f8a9c2b4d6e");
                          setUsbStep("verifying");
                          setTimeout(() => {
                            setUsbStep("success");
                            setTypedKey("");
                          }, 2000);
                        }}
                        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      >
                        <Key size={14} /> Insert Physical Key (Simulate)
                      </button>
                    </div>
                  </div>
                )}

                {usbStep === "verifying" && (
                  <div className="space-y-6 py-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff]">
                      <Loader2 size={32} className="animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-[#00f2ff] mb-2">
                        Verifying Hardware...
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed px-4">
                        Reading challenge-response token signatures from the hardware module. Do not disconnect the USB key.
                      </p>
                    </div>
                    {/* Simulated Loading Bar */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-[#00f2ff]"
                      />
                    </div>
                  </div>
                )}

                {usbStep === "success" && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-emerald-400 mb-2">
                        Keys Verified Successfully
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed px-4">
                        FIDO2 handshake successful. Air-gapped AES-256 decryption parameters loaded. Vault is now unlocked.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setVaultUnlocked(true);
                        setShowUsbModal(false);
                      }}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      Access Cold Vault <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
