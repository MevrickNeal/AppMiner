"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Snowflake, Shield, Lock, Zap, CheckCircle2,
  ArrowRight, Eye, EyeOff, Usb, Key, X, HardDrive
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { sanitizeText, sanitizeAlphanumeric } from "@/lib/sanitize";

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
function BalanceMeter({ hot, cold, staked = 0, labels }: { hot: number; cold: number; staked?: number; labels: any }) {
  const total = hot + cold + staked;
  const hotPct = total > 0 ? (hot / total) * 100 : 0;
  const stakedPct = total > 0 ? (staked / total) * 100 : 0;
  const coldPct = total > 0 ? (cold / total) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
        <span>{labels.portfolioAllocation}</span>
        <span>{total.toFixed(8)} BTC Total</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hotPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full"
          style={{ background: "linear-gradient(to right, #2563eb, #3b82f6)" }}
        />
        {staked > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stakedPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="h-full border-l border-r border-black/20"
            style={{ background: "linear-gradient(to right, #10b981, #34d399)" }}
          />
        )}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${coldPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full flex-grow"
          style={{ background: "linear-gradient(to left, #3b82f6, #60a5fa)" }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-black text-gray-500 flex-wrap gap-2">
        <span className="text-[#60a5fa]">🔥 {hotPct.toFixed(0)}% {labels.hotWalletLabel} ({hot.toFixed(5)} BTC)</span>
        {staked > 0 && (
          <span className="text-emerald-400">⚡ {stakedPct.toFixed(0)}% Staked ({staked.toFixed(5)} BTC)</span>
        )}
        <span className="text-[#60a5fa]">❄️ {coldPct.toFixed(0)}% {labels.coldStorageLabel} ({cold.toFixed(5)} BTC)</span>
      </div>
    </div>
  );
}

export default function WalletServices({ 
  btcPrice = 64250,
  usdBalance,
  setUsdBalance,
  stakeMultiplier = 0.0,
  setStakeMultiplier
}: { 
  btcPrice?: number;
  usdBalance?: number;
  setUsdBalance?: (val: number) => void;
  stakeMultiplier?: number;
  setStakeMultiplier?: (val: number) => void;
}) {
  const { language, isRtl } = useTranslation();
  const code = language.code;
  const labels = WALLET_I18N[code] || WALLET_I18N.EN;

  const [activeWallet, setActiveWallet] = useState<"hot" | "cold">("hot");
  const [showBalance, setShowBalance] = useState(true);

  // USB simulation state
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [usbStep, setUsbStep] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  // DeFi Staking state
  const [stakedBtc, setStakedBtc] = useState<number>(0);
  const [stakeDuration, setStakeDuration] = useState<number>(30);
  const [stakeExpiresAt, setStakeExpiresAt] = useState<number>(0);
  const [stakeInput, setStakeInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    try {
      const savedStake = localStorage.getItem("appsminers_btc_stake");
      if (savedStake) {
        const parsed = JSON.parse(savedStake);
        if (Date.now() < parsed.expiresAt) {
          setStakedBtc(parsed.stakedBtc);
          setStakeDuration(parsed.durationDays);
          setStakeExpiresAt(parsed.expiresAt);
          setTimeLeft(Math.max(0, Math.ceil((parsed.expiresAt - Date.now()) / 1000)));
        } else {
          localStorage.removeItem("appsminers_btc_stake");
          if (setStakeMultiplier) setStakeMultiplier(0);
        }
      }
    } catch (e) {}
  }, [setStakeMultiplier]);

  useEffect(() => {
    if (stakedBtc <= 0 || stakeExpiresAt <= 0) return;
    const interval = setInterval(() => {
      const rem = Math.max(0, Math.ceil((stakeExpiresAt - Date.now()) / 1000));
      setTimeLeft(rem);
      if (rem <= 0) {
        handleReleaseStake();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedBtc, stakeExpiresAt]);

  const handleReleaseStake = async (forced = false) => {
    const targetBtc = forced ? (stakedBtc > 0 ? stakedBtc : 0.001) : stakedBtc;
    if (targetBtc <= 0) return;
    const releaseUsd = targetBtc * btcPrice;
    const nextUsd = (usdBalance || 0) + releaseUsd;
    
    localStorage.removeItem("appsminers_btc_stake");
    setStakedBtc(0);
    setStakeExpiresAt(0);
    setTimeLeft(0);
    if (setUsdBalance) setUsdBalance(nextUsd);
    localStorage.setItem("appsminers_usd_balance", nextUsd.toFixed(2));
    if (setStakeMultiplier) setStakeMultiplier(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("wallets")
          .update({ hot_wallet_balance: nextUsd, updated_at: new Date().toISOString() })
          .eq("user_id", session.user.id);
      }
    } catch (e) {
      console.warn("Failed to persist release to DB:", e);
    }
  };

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid BTC amount to stake.");
      return;
    }
    
    const hotBtc = (usdBalance || 0) / btcPrice;
    if (amount > hotBtc) {
      alert("Insufficient BTC in hot wallet to complete staking.");
      return;
    }

    const stakedUsd = amount * btcPrice;
    const nextUsd = (usdBalance || 0) - stakedUsd;

    let multiplier = 0;
    if (stakeDuration === 30) multiplier = 0.05;
    else if (stakeDuration === 90) multiplier = 0.12;
    else if (stakeDuration === 365) multiplier = 0.30;

    const expiresAt = Date.now() + stakeDuration * 24 * 60 * 60 * 1000;

    const stakeMetadata = {
      stakedBtc: amount,
      durationDays: stakeDuration,
      expiresAt: expiresAt,
      boost: multiplier
    };

    localStorage.setItem("appsminers_btc_stake", JSON.stringify(stakeMetadata));
    setStakedBtc(amount);
    setStakeExpiresAt(expiresAt);
    setTimeLeft(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    setStakeInput("");

    if (setUsdBalance) setUsdBalance(nextUsd);
    localStorage.setItem("appsminers_usd_balance", nextUsd.toFixed(2));
    if (setStakeMultiplier) setStakeMultiplier(multiplier);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("wallets")
          .update({ hot_wallet_balance: nextUsd, updated_at: new Date().toISOString() })
          .eq("user_id", session.user.id);
      }
    } catch (dbErr) {
      console.warn("Failed to persist stake to DB:", dbErr);
    }
  };

  const formatTimeLeft = (sec: number) => {
    if (sec <= 0) return "00d:00h:00m:00s";
    const d = Math.floor(sec / (24 * 3600));
    const h = Math.floor((sec % (24 * 3600)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d.toString().padStart(2, "0")}d : ${h.toString().padStart(2, "0")}h : ${m.toString().padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };

  // Hot Wallet transaction states
  const [showHotModal, setShowHotModal] = useState(false);
  const [hotMode, setHotMode] = useState<"send" | "receive">("send");
  const [targetAddress, setTargetAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  // Dynamic values
  const activeIcon = activeWallet === "hot" ? Flame : Snowflake;
  const activeAccentColor = activeWallet === "hot" ? "#2563eb" : "#60a5fa";
  const activeGlowColor = activeWallet === "hot" ? "rgba(37,99,235,0.15)" : "rgba(96,165,250,0.12)";
  const activeLabel = activeWallet === "hot" ? labels.hotWalletLabel : labels.coldStorageLabel;
  
  const activeSubtitle = activeWallet === "hot" 
    ? labels.hotSubtitle 
    : (vaultUnlocked ? "❄️ Unlocked via Hardware Key" : "🔒 USB Verification Required");
    
  const activeDesc = activeWallet === "hot" ? labels.hotDesc : labels.coldDesc;
  
  const localUsd = usdBalance !== undefined ? usdBalance : 100.00;
  const hotBtc = localUsd / btcPrice;

  const activeBalance = activeWallet === "hot" 
    ? `${hotBtc.toFixed(8)} BTC` 
    : (vaultUnlocked ? "38.9210 BTC" : "••.•••• BTC");
    
  const activeUsd = activeWallet === "hot" 
    ? `$${localUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
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
    const cleanVal = sanitizeAlphanumeric(val);
    setTypedKey(cleanVal);
    if (cleanVal.trim().startsWith("AppsMiners-PHYSICAL-KEY-") || cleanVal.trim().startsWith("AppsMiners-ATTINY85-ColdWallet-KEY-")) {
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
    <section className="py-24 bg-[#071028] text-white border-t border-white/5" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-[#60a5fa] uppercase mb-4">{labels.assetSecurity}</h2>
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
                  activeWallet === "hot" ? "text-white" : "text-gray-600 hover:text-gray-400"
                }`}
                style={activeWallet === "hot" ? { backgroundColor: "#2563eb" } : {}}
              >
                <Flame size={14} />
                {labels.hotWalletLabel}
              </button>
              <button
                onClick={() => setActiveWallet("cold")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeWallet === "cold" ? "text-black" : "text-gray-600 hover:text-gray-400"
                }`}
                style={activeWallet === "cold" ? { backgroundColor: "#60a5fa" } : {}}
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
                      {activeWallet === "hot" ? <Flame size={16} className="text-orange-500" /> : <Snowflake size={16} className="text-[#60a5fa]" />}
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
                      setShowHotModal(true);
                      setHotMode("send");
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
              <BalanceMeter hot={hotBtc} cold={38.921} staked={stakedBtc} labels={labels} />
            </div>
          </div>

          {/* Right panel — features + security */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Feature list or DeFi Staking Vault */}
            <AnimatePresence mode="wait">
              {activeWallet === "cold" && vaultUnlocked ? (
                <motion.div
                  key="cold-staking-vault"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-8 flex-1 border border-emerald-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/2 rounded-full blur-2xl pointer-events-none" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">❄️ DeFi Time-Lock Staking Vault</p>
                  <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">Maximize remote rig efficiency</h4>
                  
                  {stakedBtc > 0 ? (
                    // Staked State UI
                    <div className="space-y-6 mt-6">
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Active Staking Contract</span>
                          <span className="text-sm font-mono text-white font-black">{stakedBtc.toFixed(8)} BTC</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Yield Multiplier Boost</span>
                          <span className="text-sm font-black text-emerald-400">+{stakeDuration === 30 ? "5%" : stakeDuration === 90 ? "12%" : "30%"} Yield</span>
                        </div>
                      </div>

                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-3">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Time Locked Remaining</span>
                        <div className="text-2xl font-black font-mono text-[#60a5fa] tracking-wider">
                          {formatTimeLeft(timeLeft)}
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mt-2">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-1000"
                            style={{ 
                              width: `${(timeLeft / (stakeDuration * 24 * 3600)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleReleaseStake(false)}
                          disabled={timeLeft > 0}
                          className="flex-1 py-3 bg-emerald-500 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-black uppercase tracking-widest text-xs rounded-xl transition-all disabled:cursor-not-allowed"
                        >
                          Reclaim Staked BTC
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleReleaseStake(true)}
                          className="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all"
                          title="Fills expiration immediately for testing"
                        >
                          ⚡ Force Expire (Dev Tool)
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Configuration State UI
                    <form onSubmit={handleStakeSubmit} className="space-y-6 mt-6">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Stake a portion of your BTC holdings in an immutable smart contract lock. Vaulting your liquid capital increases your remote mining rigs' hashing yield.
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { days: 30, boost: "+5% Boost" },
                          { days: 90, boost: "+12% Boost" },
                          { days: 365, boost: "+30% Boost" }
                        ].map((plan) => (
                          <button
                            key={plan.days}
                            type="button"
                            onClick={() => setStakeDuration(plan.days)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                              stakeDuration === plan.days 
                                ? "border-emerald-500 bg-emerald-500/5 text-emerald-400" 
                                : "border-white/5 bg-transparent text-gray-500 hover:text-white"
                            }`}
                          >
                            <span className="text-xs font-black">{plan.days} Days</span>
                            <span className="text-[8px] font-black uppercase tracking-wider">{plan.boost}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          <span>Amount to Stake</span>
                          <span>Available: {hotBtc.toFixed(8)} BTC</span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.00000001"
                            required
                            max={hotBtc}
                            placeholder="0.00000000"
                            value={stakeInput}
                            onChange={(e) => setStakeInput(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-16 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setStakeInput(hotBtc.toFixed(8))}
                            className="absolute right-4 top-2 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black text-[9px] font-black uppercase tracking-wider transition-colors"
                          >
                            Max
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                      >
                        <Lock size={14} /> Authorize Staking Contract
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
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
              )}
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
                      <Icon size={18} className="text-[#60a5fa] mb-2" />
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
                className="relative w-full max-w-md bg-[#091433] border border-white/10 rounded-3xl p-8 overflow-hidden text-center"
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
                        className="w-full bg-black/60 border border-white/10 rounded-xl py-3.5 px-4 text-center font-mono text-xs text-[#60a5fa] focus:outline-none focus:border-[#60a5fa]/60 placeholder:text-zinc-700 transition-colors"
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
                    <div className="mx-auto w-16 h-16 flex items-center justify-center relative">
                      <Image
                        src="/Products/loading.gif"
                        alt="Verifying"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-[#60a5fa] mb-2">
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
                        className="h-full bg-[#60a5fa]"
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

        {/* Hot Wallet Transaction Modal */}
        <AnimatePresence>
          {showHotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-[#091433] border border-white/10 rounded-3xl p-8 overflow-hidden text-left"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowHotModal(false);
                    setTxSuccess(null);
                    setTransferAmount("");
                    setTargetAddress("");
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="space-y-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Flame size={24} />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1">
                      Hot Wallet Operations
                    </h4>
                    <p className="text-xs text-gray-500 font-mono">
                      Balance: ${localUsd.toFixed(2)} USD
                    </p>
                  </div>

                  {/* Mode Tab Selector */}
                  {!txSuccess && (
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setHotMode("send");
                          setTransferAmount("");
                        }}
                        className={`flex-1 py-2 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${
                          hotMode === "send" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Send BTC
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHotMode("receive");
                          setTransferAmount("");
                        }}
                        className={`flex-1 py-2 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${
                          hotMode === "receive" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Deposit / Receive
                      </button>
                    </div>
                  )}

                  {txSuccess ? (
                    // Success View
                    <div className="space-y-6 text-center py-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                          Transaction Successful
                        </h5>
                        <p className="text-xs text-gray-400 leading-relaxed px-4">
                          {hotMode === "send" 
                            ? `Successfully transferred funds to address ${targetAddress.slice(0, 8)}...`
                            : "Sandbox deposit simulated successfully and credit added."
                          }
                        </p>
                        <p className="text-[10px] text-blue-400 font-mono mt-3 break-all">
                          TXID: {txSuccess}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowHotModal(false);
                          setTxSuccess(null);
                          setTransferAmount("");
                          setTargetAddress("");
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                      >
                        Done
                      </button>
                    </div>
                  ) : hotMode === "send" ? (
                    // Send Form
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const amt = parseFloat(transferAmount);
                        if (isNaN(amt) || amt <= 0) {
                          alert("Please enter a valid transfer amount.");
                          return;
                        }
                        if (amt > localUsd) {
                          alert("Insufficient funds in Hot Wallet balance.");
                          return;
                        }
                        const cleanAddress = sanitizeAlphanumeric(targetAddress);
                        if (!cleanAddress) {
                          alert("Please enter a valid destination BTC address.");
                          return;
                        }
                        setTargetAddress(cleanAddress);

                        setIsProcessing(true);
                        const newBal = localUsd - amt;
                        
                        // Update client states
                        localStorage.setItem("appsminers_usd_balance", newBal.toFixed(2));
                        if (setUsdBalance) setUsdBalance(newBal);

                        try {
                          // Update Supabase immediately
                          const { data: { session } } = await supabase.auth.getSession();
                          if (session) {
                            await supabase
                              .from("wallets")
                              .update({ hot_wallet_balance: newBal, updated_at: new Date().toISOString() })
                              .eq("user_id", session.user.id);
                          }
                        } catch (dbErr) {
                          console.warn("Failed to instantly persist wallet balance:", dbErr);
                        }

                        setIsProcessing(false);
                        setTxSuccess(Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10));
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                          Destination Bitcoin Address
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
                          value={targetAddress}
                          onChange={(e) => setTargetAddress(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                          Amount (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-xs text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            max={localUsd}
                            placeholder="0.00"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? "Processing Transfer..." : "Authorize & Send BTC"}
                      </button>
                    </form>
                  ) : (
                    // Deposit Form
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const amt = parseFloat(transferAmount);
                        if (isNaN(amt) || amt <= 0) {
                          alert("Please enter a valid deposit amount.");
                          return;
                        }

                        setIsProcessing(true);
                        const newBal = localUsd + amt;
                        
                        // Update client states
                        localStorage.setItem("appsminers_usd_balance", newBal.toFixed(2));
                        if (setUsdBalance) setUsdBalance(newBal);

                        try {
                          // Update Supabase immediately
                          const { data: { session } } = await supabase.auth.getSession();
                          if (session) {
                            await supabase
                              .from("wallets")
                              .update({ hot_wallet_balance: newBal, updated_at: new Date().toISOString() })
                              .eq("user_id", session.user.id);
                          }
                        } catch (dbErr) {
                          console.warn("Failed to instantly persist wallet balance:", dbErr);
                        }

                        setIsProcessing(false);
                        setTxSuccess("sandbox-dep-" + Math.random().toString(16).substring(2, 10));
                      }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-3">
                        <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                          {/* Simulated QR Code */}
                          <div className="w-full h-full bg-black flex flex-wrap p-1 gap-1">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div key={i} className={`w-3.5 h-3.5 rounded-sm ${((i % 2 === 0 && i % 3 === 0) || i < 12 || i > 52) ? "bg-white" : "bg-black"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono select-all text-center break-all px-4">
                          Address: 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                          Simulate Deposit Amount (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-xs text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="50.00"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? "Processing Deposit..." : "Simulate Sandbox Deposit"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
