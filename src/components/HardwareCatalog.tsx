"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, BarChart2, Zap, ChevronRight, X, Cpu,
  Thermometer, Weight, Wifi, Volume2, Box, Activity,
  Shield, Clock, Package, Loader2, CheckCircle, ArrowLeft,
  CreditCard, Globe, Mail, User
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import { CATALOG_I18N } from "@/locales/catalog";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────
type SpecGroup = { label: string; rows: { key: string; value: string; highlight?: boolean }[] };

type Product = {
  id: string;
  name: string;
  series: string;
  type: "flagship" | "micro" | "bundle";
  hashrate?: string;
  efficiency?: string;
  price: string;
  image: string;
  description: string;
  bundleContents?: string[];
  badge?: string;
  specGroups: SpecGroup[];
};

// ─── Product Data with full spec sheets ──────────────────────
const products: Product[] = [

  // ── T200 Pro ────────────────────────────────────────────────
  {
    id: "t200",
    name: "AppsMiners T200 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "200 TH/s",
    efficiency: "25 J/TH",
    price: "$2,499",
    image: "/Products/T200 PRO.png",
    badge: "Best Seller",
    description:
      "Our ultimate flagship — 200 TH/s of raw SHA-256 mining power with enterprise-grade thermal management. Built for 24/7 data-center deployment.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "200 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "5,000 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "25 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "256× Proprietary Gen-4" },
          { key: "Chip Process",          value: "5nm TSMC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "400 × 195 × 290 mm" },
          { key: "Weight",                value: "14.5 kg" },
          { key: "Cooling",               value: "Dual 120mm Industrial Fans" },
          { key: "Noise Level",           value: "75 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP44" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "200 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C19 × 2" },
          { key: "PSU Efficiency",        value: "93% (Platinum rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "Gigabit Ethernet RJ-45" },
          { key: "Management",            value: "Web UI + REST API" },
          { key: "Operating Temp",        value: "0 °C – 40 °C" },
          { key: "Humidity",              value: "5% – 95% non-condensing" },
          { key: "Warranty",              value: "24 months", highlight: true },
        ],
      },
    ],
  },

  // ── F100 Pro ─────────────────────────────────────────────────
  {
    id: "f100",
    name: "AppsMiners F100 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "100 TH/s",
    efficiency: "28 J/TH",
    price: "$1,299",
    image: "/Products/F100.png",
    description:
      "The ideal mid-range powerhouse. 100 TH/s in a compact chassis — perfect for serious home rigs and small farm setups.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "100 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "2,800 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "28 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "128× Proprietary Gen-4" },
          { key: "Chip Process",          value: "5nm TSMC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "370 × 195 × 290 mm" },
          { key: "Weight",                value: "12.5 kg" },
          { key: "Cooling",               value: "Dual 120mm Industrial Fans" },
          { key: "Noise Level",           value: "72 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP44" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "200 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C19" },
          { key: "PSU Efficiency",        value: "92% (Gold rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "Gigabit Ethernet RJ-45" },
          { key: "Management",            value: "Web UI + REST API" },
          { key: "Operating Temp",        value: "0 °C – 45 °C" },
          { key: "Humidity",              value: "5% – 95% non-condensing" },
          { key: "Warranty",              value: "18 months", highlight: true },
        ],
      },
    ],
  },

  // ── F50 Pro ──────────────────────────────────────────────────
  {
    id: "f50",
    name: "AppsMiners F50 Pro",
    series: "Pro Series // Flagship",
    type: "flagship",
    hashrate: "50 TH/s",
    efficiency: "30 J/TH",
    price: "$799",
    image: "/Products/F50.png",
    badge: "Entry Pro",
    description:
      "Professional-grade mining in a budget-conscious package. 50 TH/s with whisper-quiet single fan — the gateway to the Pro Series.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "50 TH/s ± 5%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "1,500 W ± 10%", highlight: true },
          { key: "Efficiency",            value: "30 J/TH", highlight: true },
          { key: "ASIC Chips",            value: "64× Proprietary Gen-3" },
          { key: "Chip Process",          value: "7nm Samsung" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "340 × 160 × 230 mm" },
          { key: "Weight",                value: "9.5 kg" },
          { key: "Cooling",               value: "Single 140mm Fan + Heatsink Array" },
          { key: "Noise Level",           value: "65 dB(A) @ 1m" },
          { key: "Ingress Protection",    value: "IP42" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Input Voltage",         value: "180 – 240 VAC" },
          { key: "Frequency",             value: "50 – 60 Hz" },
          { key: "Power Connector",       value: "IEC C13" },
          { key: "PSU Efficiency",        value: "90% (Gold rated)" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Network Interface",     value: "100Mbps Ethernet RJ-45" },
          { key: "Management",            value: "Web UI" },
          { key: "Operating Temp",        value: "0 °C – 45 °C" },
          { key: "Humidity",              value: "10% – 90% non-condensing" },
          { key: "Warranty",              value: "12 months", highlight: true },
        ],
      },
    ],
  },

  // ── Mini ─────────────────────────────────────────────────────
  {
    id: "mini",
    name: "AppsMiners Mini",
    series: "Micro Series // Compact",
    type: "micro",
    price: "$99",
    image: "/Products/AppsMinersMini.png",
    description:
      "Compact desktop miner with whisper-quiet operation. Plug into any wall socket and start earning — no specialist knowledge required.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "500 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256 / Scrypt" },
          { key: "Power Consumption",     value: "45 W", highlight: true },
          { key: "Efficiency",            value: "90 mJ/GH" },
          { key: "ASIC Chips",            value: "4× Gen-2 Micro-ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions (L×W×H)",    value: "150 × 100 × 60 mm" },
          { key: "Weight",                value: "0.8 kg" },
          { key: "Cooling",               value: "Passive fins + 40mm mini fan" },
          { key: "Noise Level",           value: "38 dB(A) @ 1m" },
          { key: "Color",                 value: "Matte Black / Space Gray" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Input",           value: "12V DC (AC adapter included)" },
          { key: "Adapter",               value: "Universal 100 – 240 VAC" },
          { key: "Connector",             value: "Barrel Jack 5.5mm" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB 3.0 + WiFi 802.11n" },
          { key: "Management",            value: "Mobile App (iOS / Android)" },
          { key: "Operating Temp",        value: "0 °C – 50 °C" },
          { key: "Warranty",              value: "12 months", highlight: true },
        ],
      },
    ],
  },

  // ── Nano ─────────────────────────────────────────────────────
  {
    id: "nano",
    name: "AppsMiners Nano",
    series: "Micro Series // USB",
    type: "micro",
    price: "$49",
    image: "/Products/AppsMinersNano.png",
    description:
      "The ultimate USB stick miner. Fully bus-powered — just plug into any USB 3.0 port and you're mining. No setup. No fuss.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "150 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256" },
          { key: "Power Consumption",     value: "10 W (bus powered)", highlight: true },
          { key: "Efficiency",            value: "67 mJ/GH" },
          { key: "ASIC Chips",            value: "1× Gen-2 Nano-ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions",            value: "80 × 40 × 20 mm" },
          { key: "Weight",                value: "120 g" },
          { key: "Cooling",               value: "Passive aluminum heatsink" },
          { key: "Noise Level",           value: "0 dB (fanless)", highlight: true },
          { key: "Form Factor",           value: "USB Stick" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Source",          value: "USB 3.0 (5V / 2A)" },
          { key: "Connector",             value: "USB-A 3.0" },
          { key: "Max Draw",              value: "10W" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB 3.0" },
          { key: "Management",            value: "CGMiner / BFGMiner compatible" },
          { key: "OS Support",            value: "Windows, macOS, Linux, Raspberry Pi" },
          { key: "Operating Temp",        value: "0 °C – 60 °C" },
          { key: "Warranty",              value: "6 months", highlight: true },
        ],
      },
    ],
  },

  // ── Pocket ───────────────────────────────────────────────────
  {
    id: "pocket",
    name: "AppsMiners Pocket",
    series: "Micro Series // Portable",
    type: "micro",
    price: "$29",
    badge: "World's Smallest",
    image: "/Products/AppsMinersPocket.png",
    description:
      "The world's smallest standalone blockchain mining device. USB-C powered, fully portable, and configurable from any smartphone.",
    specGroups: [
      {
        label: "Performance",
        rows: [
          { key: "Hashrate",              value: "50 GH/s ± 10%", highlight: true },
          { key: "Algorithm",             value: "SHA-256 / Multi-algo" },
          { key: "Power Consumption",     value: "5 W", highlight: true },
          { key: "Efficiency",            value: "100 mJ/GH" },
          { key: "ASIC Chips",            value: "1× Pocket ASIC" },
        ],
      },
      {
        label: "Physical",
        rows: [
          { key: "Dimensions",            value: "60 × 30 × 15 mm" },
          { key: "Weight",                value: "48 g" },
          { key: "Cooling",               value: "Passive (no moving parts)", highlight: true },
          { key: "Noise Level",           value: "0 dB (completely silent)", highlight: true },
          { key: "Material",              value: "Anodized aerospace aluminum" },
        ],
      },
      {
        label: "Electrical",
        rows: [
          { key: "Power Source",          value: "USB-C (5V / 1A)" },
          { key: "Connector",             value: "USB-C" },
          { key: "Battery Compatible",    value: "Yes — USB-C power banks" },
        ],
      },
      {
        label: "Connectivity & Environment",
        rows: [
          { key: "Interface",             value: "USB-C + Bluetooth 5.0" },
          { key: "Management",            value: "AppsMiners Mobile App" },
          { key: "OS Support",            value: "Android / iOS via BLE" },
          { key: "Operating Temp",        value: "-10 °C – 60 °C" },
          { key: "Warranty",              value: "6 months", highlight: true },
        ],
      },
    ],
  },

  // ── Starter Kit ──────────────────────────────────────────────
  {
    id: "starter-kit",
    name: "The Starter Kit",
    series: "Bundle",
    type: "bundle",
    price: "$499",
    badge: "Save 30%",
    image: "/Products/starter kit clearbg..png",
    description:
      "Everything you need to build your first distributed micro-mining farm. 10 devices, 2.15 TH/s combined, ready to run in under 10 minutes.",
    bundleContents: ["4× AppsMiners Pocket", "3× AppsMiners Mini", "3× AppsMiners Nano"],
    specGroups: [
      {
        label: "Bundle Performance",
        rows: [
          { key: "Combined Hashrate",     value: "~2.15 TH/s", highlight: true },
          { key: "Total Power Draw",      value: "185 W", highlight: true },
          { key: "Devices Included",      value: "10 units" },
          { key: "Algorithms",            value: "SHA-256, Scrypt, Multi-algo" },
          { key: "Estimated ROI",         value: "4 – 6 months (market dependent)" },
        ],
      },
      {
        label: "What's in the Box",
        rows: [
          { key: "AppsMiners Pocket ×4",   value: "200 GH/s combined" },
          { key: "AppsMiners Mini ×3",     value: "1,500 GH/s combined" },
          { key: "AppsMiners Nano ×3",     value: "450 GH/s combined" },
          { key: "USB Hub (7-port)",      value: "Powered, included", highlight: true },
          { key: "Power Strip",           value: "Surge-protected, included" },
          { key: "Quick-Start Guide",     value: "Printed + digital PDF" },
        ],
      },
      {
        label: "Setup & Compatibility",
        rows: [
          { key: "Setup Time",            value: "< 10 minutes", highlight: true },
          { key: "OS Support",            value: "Windows, macOS, Linux, Raspberry Pi" },
          { key: "App Required",          value: "AppsMiners Mobile (free)" },
          { key: "Pool Compatibility",    value: "All major pools (Slush, F2Pool, etc.)" },
        ],
      },
      {
        label: "Bundle Value",
        rows: [
          { key: "Individual MSRP",       value: "$613" },
          { key: "Bundle Price",          value: "$499", highlight: true },
          { key: "Savings",               value: "$114 (18.6% off)", highlight: true },
          { key: "Bundle Warranty",       value: "12 months unified" },
        ],
      },
    ],
  },
];

// ─── Icons per spec group ─────────────────────────────────────
const GROUP_ICONS: Record<string, React.ElementType> = {
  "Performance":                Activity,
  "Physical":                   Box,
  "Electrical":                 Zap,
  "Connectivity & Environment": Wifi,
  "Bundle Performance":         BarChart2,
  "What's in the Box":          Package,
  "Setup & Compatibility":      Cpu,
  "Bundle Value":               Shield,
};

const CHECKOUT_I18N: Record<string, any> = {
  EN: {
    checkoutHeader: "Sandbox Checkout",
    hostingRegion: "Hosting Center Node Location",
    paymentMethod: "Payment Method (Sandbox)",
    billingName: "Billing Full Name",
    billingEmail: "Operator Email Address",
    sandboxAlertTitle: "Sandbox Simulation Mode",
    sandboxAlertDesc: "AppsMiners is currently in network sandbox phase. No real money will be charged. Completing this order will instantly link this virtual device to your operator dashboard.",
    processPaymentBtn: "Process Sandbox Payment",
    successRedirectMsg: "Payment Processed! Initializing node telemetry...",
    stage1: "Establishing secure blockchain gateway...",
    stage2: "Minting virtual hardware license token...",
    stage3: "Configuring stratum mining credentials...",
    stage4: "Connecting node cluster to AppsMiners network...",
    stage5: "Completed! Redirecting to secure registration...",
    iceland: "Reykjavik, Iceland (35ms)",
    finland: "Helsinki, Finland (42ms)",
    sweden: "Luleå, Sweden (38ms)",
    creditCard: "Simulated Credit Card",
    bitcoin: "Bitcoin Testnet Wallet",
    usdt: "USDT Sandbox Address",
    namePlaceholder: "e.g. John Doe",
    emailPlaceholder: "e.g. john@example.com",
    orderSummary: "Order Summary",
    product: "Product",
    price: "Price",
    sandboxFree: "SIMULATED PAYMENT (FREE)",
    backBtn: "Back to Specs"
  },
  AR: {
    checkoutHeader: "إتمام الشراء التجريبي (صندوق الرمل)",
    hostingRegion: "موقع عقدة مركز الاستضافة",
    paymentMethod: "طريقة الدفع (تجريبي)",
    billingName: "الاسم الكامل للمشغل",
    billingEmail: "عنوان البريد الإلكتروني للمشغل",
    sandboxAlertTitle: "وضع محاكاة صندوق الرمل",
    sandboxAlertDesc: "AppsMiners حاليًا في مرحلة اختبار الشبكة. لن يتم خصم أي أموال حقيقية. إن إتمام هذا الطلب سيربط هذا الجهاز الافتراضي مباشرة بلوحة تحكم المشغل الخاصة بك.",
    processPaymentBtn: "معالجة الدفع التجريبي",
    successRedirectMsg: "تمت معالجة الدفع! بدء تشغيل القياس عن بعد للعقدة...",
    stage1: "إنشاء بوابة بلوكشين آمنة...",
    stage2: "صك رمز ترخيص الأجهزة الافتراضية...",
    stage3: "تكوين بيانات اعتماد تعدين stratum...",
    stage4: "توصيل مجموعة العقد بشبكة AppsMiners...",
    stage5: "اكتمل! إعادة التوجيه إلى التسجيل الآمن...",
    iceland: "ريكيافيك، أيسلندا (٣٥ مللي ثانية)",
    finland: "هلسنكي، فنلندا (٤٢ مللي ثانية)",
    sweden: "لوليو، السويد (٣٨ مللي ثانية)",
    creditCard: "بطاقة ائتمان محاكاة",
    bitcoin: "محفظة اختبار البيتكوين",
    usdt: "عنوان USDT التجريبي",
    namePlaceholder: "مثال: جون دو",
    emailPlaceholder: "مثال: john@example.com",
    orderSummary: "ملخص الطلب",
    product: "المنتج",
    price: "السعر",
    sandboxFree: "دفع محاكاة (مجاني)",
    backBtn: "العودة للمواصفات"
  },
  HI: {
    checkoutHeader: "सैंडबॉक्स चेकआउट",
    hostingRegion: "होस्टिंग सेंटर नोड स्थान",
    paymentMethod: "भुगतान विधि (सैंडबॉक्स)",
    billingName: "बिलिंग का पूरा नाम",
    billingEmail: "ऑपरेटर ईमेल पता",
    sandboxAlertTitle: "सैंडबॉक्स सिमुलेशन मोड",
    sandboxAlertDesc: "AppsMiners वर्तमान में नेटवर्क सैंडबॉक्स चरण में है। कोई वास्तविक पैसा नहीं लिया जाएगा। इस ऑर्डर को पूरा करने से यह वर्चुअल डिवाइस तुरंत आपके ऑपरेटर डैशबोर्ड से जुड़ जाएगी।",
    processPaymentBtn: "सैंडबॉक्स भुगतान संसाधित करें",
    successRedirectMsg: "भुगतान संसाधित! नोड टेलीमेट्री शुरू की जा रही है...",
    stage1: "सुरक्षित ब्लॉकचेन गेटवे स्थापित किया जा रहा है...",
    stage2: "वर्चुअल हार्डवेयर लाइसेंस टोकन ढाला जा रहा है...",
    stage3: "स्ट्रैटम माइनिंग क्रेडेंशियल कॉन्फ़िगर किए जा रहे हैं...",
    stage4: "नोड क्लस्टर को AppsMiners नेटवर्क से जोड़ा जा रहा है...",
    stage5: "पूर्ण! सुरक्षित पंजीकरण पर पुनर्निर्देशित किया जा रहा है...",
    iceland: "रेक्याविक, आइसलैंड (35ms)",
    finland: "हेलसिंकी, फिनलैंड (42ms)",
    sweden: "लुलेआ, स्वीडन (38ms)",
    creditCard: "सिम्युलेटेड क्रेडिट कार्ड",
    bitcoin: "बिटकॉइन टेस्टनेट वॉलेट",
    usdt: "USDT सैंडबॉक्स पता",
    namePlaceholder: "उदा. जॉन डो",
    emailPlaceholder: "उदा. john@example.com",
    orderSummary: "ऑर्डर सारांश",
    product: "उत्पाद",
    price: "कीमत",
    sandboxFree: "सिम्युलेटेड भुगतान (निःशुल्क)",
    backBtn: "वापस विवरण पर"
  },
  DE: {
    checkoutHeader: "Sandbox-Checkout",
    hostingRegion: "Hosting-Center Standort",
    paymentMethod: "Zahlungsmethode (Sandbox)",
    billingName: "Vollständiger Name des Betreibers",
    billingEmail: "E-Mail-Adresse des Betreibers",
    sandboxAlertTitle: "Sandbox-Simulationsmodus",
    sandboxAlertDesc: "AppsMiners befindet sich derzeit in der Sandbox-Testphase. Es wird kein echtes Geld berechnet. Der Abschluss dieser Bestellung verknüpft dieses virtuelle Gerät sofort mit Ihrem Dashboard.",
    processPaymentBtn: "Sandbox-Zahlung verarbeiten",
    successRedirectMsg: "Zahlung verarbeitet! Knoten-Telemetrie wird initialisiert...",
    stage1: "Sicheres Blockchain-Gateway wird eingerichtet...",
    stage2: "Virtueller Hardware-Lizenztoken wird geprägt...",
    stage3: "Stratum-Mining-Anmeldeinformationen werden konfiguriert...",
    stage4: "Knoten-Cluster wird mit dem AppsMiners-Netzwerk verbunden...",
    stage5: "Abgeschlossen! Weiterleitung zur sicheren Registrierung...",
    iceland: "Reykjavik, Island (35ms)",
    finland: "Helsinki, Finnland (42ms)",
    sweden: "Luleå, Schweden (38ms)",
    creditCard: "Simulierte Kreditkarte",
    bitcoin: "Bitcoin-Testnet-Wallet",
    usdt: "USDT Sandbox-Adresse",
    namePlaceholder: "z.B. Max Mustermann",
    emailPlaceholder: "z.B. max@example.com",
    orderSummary: "Bestellübersicht",
    product: "Produkt",
    price: "Preis",
    sandboxFree: "SIMULIERTE ZAHLUNG (KOSTENLOS)",
    backBtn: "Zurück zu Details"
  },
  FR: {
    checkoutHeader: "Paiement Sandbox",
    hostingRegion: "Emplacement du Centre d'Hébergement",
    paymentMethod: "Moyen de Paiement (Sandbox)",
    billingName: "Nom Complet de l'Opérateur",
    billingEmail: "Adresse E-mail de l'Opérateur",
    sandboxAlertTitle: "Mode Simulation Sandbox",
    sandboxAlertDesc: "AppsMiners est actuellement en phase de test sandbox. Aucun argent réel ne sera débité. Finaliser cette commande liera instantanément ce rig virtuel à votre tableau de bord opérateur.",
    processPaymentBtn: "Procéder au Paiement Sandbox",
    successRedirectMsg: "Paiement traité! Initialisation de la télémétrie du rig...",
    stage1: "Établissement de la passerelle blockchain sécurisée...",
    stage2: "Création du jeton de licence matérielle virtuelle...",
    stage3: "Configuration des accès de minage stratum...",
    stage4: "Connexion du cluster de rig au réseau AppsMiners...",
    stage5: "Terminé! Redirection vers l'inscription sécurisée...",
    iceland: "Reykjavik, Islande (35ms)",
    finland: "Helsinki, Finlande (42ms)",
    sweden: "Luleå, Suède (38ms)",
    creditCard: "Carte Bancaire Simulée",
    bitcoin: "Portefeuille Bitcoin Testnet",
    usdt: "Adresse USDT Sandbox",
    namePlaceholder: "ex: Jean Dupont",
    emailPlaceholder: "ex: jean@example.com",
    orderSummary: "Récapitulatif de Commande",
    product: "Produit",
    price: "Tarif",
    sandboxFree: "PAIEMENT SIMULÉ (GRATUIT)",
    backBtn: "Retour aux specs"
  },
  ES: {
    checkoutHeader: "Procesar Pedido Sandbox",
    hostingRegion: "Ubicación del Centro de Alojamiento",
    paymentMethod: "Método de Pago (Sandbox)",
    billingName: "Nombre Completo del Operador",
    billingEmail: "Correo Electrónico del Operador",
    sandboxAlertTitle: "Modo Simulación Sandbox",
    sandboxAlertDesc: "AppsMiners está en fase de pruebas de red. No se cobrará dinero real. Completar este pedido vinculará este dispositivo virtual directamente a su panel de operador.",
    processPaymentBtn: "Procesar Pago Sandbox",
    successRedirectMsg: "¡Pago procesado! Iniciando telemetría del nodo...",
    stage1: "Estableciendo pasarela blockchain segura...",
    stage2: "Acuñando token de licencia de hardware virtual...",
    stage3: "Configurando credenciales de minería stratum...",
    stage4: "Conectando clúster de nodos a la red de AppsMiners...",
    stage5: "¡Completado! Redirigiendo a registro seguro...",
    iceland: "Reikiavik, Islandia (35ms)",
    finland: "Helsinki, Finlandia (42ms)",
    sweden: "Luleå, Suecia (38ms)",
    creditCard: "Tarjeta de Crédito Simulada",
    bitcoin: "Monedero Bitcoin Testnet",
    usdt: "Dirección USDT Sandbox",
    namePlaceholder: "ej. Juan Pérez",
    emailPlaceholder: "ej. juan@ejemplo.com",
    orderSummary: "Resumen de Pedido",
    product: "Producto",
    price: "Precio",
    sandboxFree: "PAGO SIMULADO (GRATIS)",
    backBtn: "Volver a Specs"
  },
  BN: {
    checkoutHeader: "স্যান্ডবক্স চেকআউট",
    hostingRegion: "হোস্টিং সেন্টার নোড লোকেশন",
    paymentMethod: "পেমেন্ট মাধ্যম (স্যান্ডবক্স)",
    billingName: "অপারেটরের পুরো নাম",
    billingEmail: "অপারেটরের ইমেইল ঠিকানা",
    sandboxAlertTitle: "স্যান্ডবক্স সিমুলেশন মোড",
    sandboxAlertDesc: "AppsMiners বর্তমানে নেটওয়ার্ক স্যান্ডবক্স পর্যায়ে রয়েছে। কোনো আসল টাকা চার্জ করা হবে না। এই অর্ডারটি সম্পন্ন করলে এই ভার্চুয়াল ডিভাইসটি তাত্ক্ষণিকভাবে আপনার ড্যাশবোর্ডের সাথে যুক্ত হবে।",
    processPaymentBtn: "স্যান্ডবক্স পেমেন্ট প্রসেস করুন",
    successRedirectMsg: "পেমেন্ট প্রসেস হয়েছে! নোড টেলিমেট্রি সক্রিয় করা হচ্ছে...",
    stage1: "নিরাপদ ব্লকচেইন গেটওয়ে স্থাপন করা হচ্ছে...",
    stage2: "ভার্চুয়াল হার্ডওয়্যার লাইسن্স টোকেন তৈরি হচ্ছে...",
    stage3: "স্ট্র্যাটাম মাইনিং ক্রেডেনশিয়াল কনফিগার করা হচ্ছে...",
    stage4: "নোড ক্লাস্টারকে AppsMiners নেটওয়ার্কের সাথে যুক্ত করা হচ্ছে...",
    stage5: "সম্পন্ন! নিরাপদ রেজিস্ট্রেশনে রিডাইরেক্ট করা হচ্ছে...",
    iceland: "রেইকিয়াভিক, আইসল্যান্ড (৩৫ মিলি সেকেন্ড)",
    finland: "হেলসিঙ্কি, ফিনল্যান্ড (৪২ মিলি সেকেন্ড)",
    sweden: "লুলিয়া, সুইডেন (৩৮ মিলি সেকেন্ড)",
    creditCard: "সিমুলেটেড ক্রেডিট কার্ড",
    bitcoin: "বিটকয়েন টেস্টনেট ওয়ালেট",
    usdt: "ইউএসডিটি স্যান্ডবক্স অ্যাড্রেস",
    namePlaceholder: "উদাঃ জনাব কামাল",
    emailPlaceholder: "উদাঃ kamal@example.com",
    orderSummary: "অর্ডারের সারসংক্ষেপ",
    product: "পণ্য",
    price: "মূল্য",
    sandboxFree: "সিমুলেটেড পেমেন্ট (সম্পূর্ণ ফ্রি)",
    backBtn: "স্পেক্স-এ ফিরে যান"
  }
};

// ─────────────────────────────────────────────────────────────
// HardwareCatalog
// ─────────────────────────────────────────────────────────────
export default function HardwareCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { language, t, isRtl } = useTranslation();
  const code = language.code; // "EN" | "AR" | "HI" | "DE" | "FR" | "ES" | "BN"

  const localizedProducts = products.map((product) => {
    const locProductData = CATALOG_I18N[code]?.products?.[product.id] || CATALOG_I18N.EN.products[product.id] || {};
    
    // Localize specGroups
    const localizedSpecGroups = product.specGroups.map((group) => {
      const locLabel = CATALOG_I18N[code]?.specLabels?.[group.label] || group.label;
      const localizedRows = group.rows.map((row) => {
        const locKey = CATALOG_I18N[code]?.specKeys?.[row.key] || row.key;
        const locVal = CATALOG_I18N[code]?.specKeys?.[row.value] || row.value;
        return { 
          ...row, 
          key: locKey, 
          value: locVal 
        };
      });
      return { ...group, label: locLabel, rows: localizedRows };
    });

    return {
      ...product,
      name: locProductData.name || product.name,
      series: locProductData.series || product.series,
      description: locProductData.description || product.description,
      badge: locProductData.badge || product.badge,
      specGroups: localizedSpecGroups,
    };
  });

  const localizedSelectedProduct = selectedProduct
    ? localizedProducts.find((p) => p.id === selectedProduct.id) || null
    : null;

  const flagships = localizedProducts.filter((p) => p.type === "flagship");
  const micros    = localizedProducts.filter((p) => p.type === "micro");
  const bundles   = localizedProducts.filter((p) => p.type === "bundle");

  const locLabels = CATALOG_I18N[code] || CATALOG_I18N.EN;

  return (
    <section id="products" className={`py-32 bg-[#080808] text-white relative transition-all duration-300 ${selectedProduct ? "z-[100]" : "z-20"}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] uppercase mb-4">{t("catalogTitle")}</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
              {locLabels.precisionTitle} <br />
              <span className="text-gray-600">{locLabels.miningArraysTitle}</span>
            </h3>
          </div>
          <p className="text-gray-600 text-sm max-w-xs font-medium leading-relaxed">
            {t("catalogSubtitle")}
          </p>
        </div>

        {/* Flagship */}
        <div className="mb-20" id="flagship-series">
          <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Zap size={18} className="text-[#00f2ff]" /> {locLabels.proSeriesTitle}
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {flagships.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} locLabels={locLabels} />)}
          </div>
        </div>

        {/* Micro Series */}
        <div className="mb-20" id="micro-series">
          <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <Cpu size={18} className="text-[#00f2ff]" /> {locLabels.microSeriesTitle}
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {micros.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} locLabels={locLabels} />)}
          </div>
        </div>

        {/* Bundles */}
        <div id="prices">
          <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-white/80 uppercase tracking-widest">
            <ShoppingCart size={18} className="text-[#00f2ff]" /> {locLabels.bundleSeriesTitle}
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {bundles.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} locLabels={locLabels} />)}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {localizedSelectedProduct && (
          <ProductModal product={localizedSelectedProduct} onClose={() => setSelectedProduct(null)} locLabels={locLabels} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, locLabels }: { product: Product; onClick: () => void; locLabels: any }) {
  const isBundle = product.type === "bundle";

  if (isBundle) {
    return (
      <motion.div
        layoutId={`card-container-${product.id}`}
        onClick={onClick}
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="p-6 md:p-8 flex flex-col md:flex-row gap-8 cursor-pointer group glass-card relative overflow-hidden"
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-widest">
            {product.badge}
          </div>
        )}

        {/* Image side */}
        <div className="relative w-full md:w-[320px] h-[220px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:16px_16px]" />
          <motion.div layoutId={`image-${product.id}`} className="relative w-48 h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </motion.div>
        </div>

        {/* Info side */}
        <div className="flex-1 flex flex-col justify-between self-stretch py-1">
          <div>
            <p className="text-gray-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">{product.series}</p>
            <motion.h4 layoutId={`title-${product.id}`} className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-white">
              {product.name}
            </motion.h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">{product.description}</p>
            
            {/* Bundle contents as pill badges */}
            {product.bundleContents && (
              <div className="flex flex-wrap gap-2.5 mb-6">
                {product.bundleContents.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-xl bg-[#00f2ff]/5 border border-[#00f2ff]/10 text-[10px] font-black text-[#00f2ff] uppercase tracking-wider">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">{locLabels.bundlePrice}</span>
              <motion.span layoutId={`price-${product.id}`} className="text-3xl font-black text-white">
                {product.price}
              </motion.span>
            </div>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#00f2ff] group-hover:text-white transition-colors">
              <span>{locLabels.viewBundleSpecs}</span>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#00f2ff] group-hover:text-black group-hover:border-transparent text-white flex items-center justify-center transition-all duration-300">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`card-container-${product.id}`}
      onClick={onClick}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="p-6 flex flex-col cursor-pointer group glass-card relative"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-widest">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative h-[220px] w-full rounded-2xl mb-6 overflow-hidden bg-white/5 border border-white/10">
        <motion.div layoutId={`image-${product.id}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </motion.div>
      </div>

      {/* Text */}
      <div className="mt-auto">
        <p className="text-gray-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">{product.series}</p>
        <motion.h4 layoutId={`title-${product.id}`} className="text-xl font-black tracking-tight mb-4 text-white">
          {product.name}
        </motion.h4>

        {product.hashrate && (
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{locLabels.specKeys.Hashrate}</p>
              <p className="font-black text-[#00f2ff] text-sm">{product.hashrate}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{locLabels.specKeys.Efficiency}</p>
              <p className="font-black text-white text-sm">{product.efficiency}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <motion.span layoutId={`price-${product.id}`} className="text-xl font-black text-white">
            {product.price}
          </motion.span>
          <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#00f2ff] group-hover:text-black text-white flex items-center justify-center transition-colors duration-300">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductModal — tabbed spec sheet
// ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, locLabels }: { product: Product; onClose: () => void; locLabels: any }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isCheckout, setIsCheckout] = useState(false);
  const router = useRouter();
  const { language } = useTranslation();
  const cCode = language.code;
  const cl = CHECKOUT_I18N[cCode] || CHECKOUT_I18N.EN;

  // Extract localized warranty from rows
  const warrantyRow = product.specGroups.flatMap((g) => g.rows).find((r) => r.key === locLabels.specKeys.Warranty || r.key === "Warranty");
  const warrantyVal = warrantyRow ? warrantyRow.value : "12 mo";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-lg z-[100]"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-container-${product.id}`}
          className="glass-card w-full max-w-6xl h-[90vh] md:max-h-[94vh] !rounded-t-[2rem] !rounded-b-none md:!rounded-3xl mt-auto md:mt-0 overflow-hidden pointer-events-auto relative flex flex-col"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all"
          >
            <X size={18} />
          </button>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

            {/* LEFT — image + hero info */}
            <div className="w-full md:w-[40%] flex flex-col border-r border-white/10 flex-shrink-0 bg-black/20">

              {/* Image area */}
              <div className="relative flex-none h-[260px] md:h-auto md:flex-1 bg-white/3 flex items-center justify-center p-8">
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.06)_0%,transparent_70%)]" />
                <motion.div layoutId={`image-${product.id}`} className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-[0_0_60px_rgba(0,242,255,0.2)]"
                  />
                </motion.div>
              </div>

              {/* Info below image */}
              <div className="p-6 border-t border-white/10 bg-white/2">
                {product.badge && (
                  <span className="inline-block mb-3 px-2.5 py-1 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-widest">
                    {product.badge}
                  </span>
                )}
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mb-1">{product.series}</p>
                <motion.h2 layoutId={`title-${product.id}`} className="text-2xl font-black tracking-tighter text-white mb-1">
                  {product.name}
                </motion.h2>
                <motion.div layoutId={`price-${product.id}`} className="text-2xl font-black text-[#00f2ff] mb-4">
                  {product.price}
                </motion.div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

                {/* Bundle pills */}
                {product.bundleContents && (
                  <div className="space-y-2 mb-6">
                    {product.bundleContents.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                        <span className="text-xs font-bold text-gray-400">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setIsCheckout(!isCheckout)}
                  className={`w-full py-4 font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isCheckout
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      : "bg-white text-black hover:bg-[#00f2ff]"
                  }`}
                >
                  {isCheckout ? (
                    <>
                      <ArrowLeft size={16} /> {cl.backBtn}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} /> {locLabels.addToCartBtn}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT — spec sheet OR checkout */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black/10">
              {!isCheckout ? (
                <>
                  {/* Tab bar */}
                  <div className="flex overflow-x-auto border-b border-white/10 px-4 pt-4 gap-1 flex-shrink-0 scrollbar-hide">
                    {product.specGroups.map((group, i) => {
                      const Icon = GROUP_ICONS[group.label] ?? Activity;
                      return (
                        <button
                          key={group.label}
                          onClick={() => setActiveTab(i)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                            activeTab === i
                              ? "text-[#00f2ff] border-[#00f2ff] bg-[#00f2ff]/8"
                              : "text-gray-600 border-transparent hover:text-gray-400"
                          }`}
                        >
                          <Icon size={12} />
                          {group.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Spec rows */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-1"
                      >
                        {/* Group title */}
                        <div className="flex items-center gap-2 mb-5">
                          {(() => {
                            const Icon = GROUP_ICONS[product.specGroups[activeTab].label] ?? Activity;
                            return <Icon size={16} className="text-[#00f2ff]" />;
                          })()}
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                            {product.specGroups[activeTab].label}
                          </h3>
                        </div>

                        {product.specGroups[activeTab].rows.map((row, i) => (
                          <motion.div
                            key={row.key}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                            className={`flex items-center justify-between py-3.5 px-4 rounded-xl transition-colors group/row ${
                              row.highlight
                                ? "bg-[#00f2ff]/6 border border-[#00f2ff]/20"
                                : "bg-white/3 border border-white/6 hover:bg-white/6"
                            }`}
                          >
                            <span className="text-xs font-bold text-gray-500 group-hover/row:text-gray-400 transition-colors">
                              {row.key}
                            </span>
                            <span className={`text-sm font-black tabular-nums text-right ${
                              row.highlight ? "text-[#00f2ff]" : "text-white"
                            }`}>
                              {row.value}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Quick-reference footer bar for flagship */}
                    {product.hashrate && (
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                          { Icon: Activity,    label: locLabels.specKeys.Hashrate,   val: product.hashrate },
                          { Icon: Zap,         label: locLabels.specKeys.Efficiency, val: product.efficiency ?? "—" },
                          { Icon: Clock,       label: locLabels.specKeys.Warranty,   val: warrantyVal },
                        ].map(({ Icon, label, val }) => (
                          <div key={label} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <Icon size={14} className="text-[#00f2ff] mx-auto mb-1.5" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">{label}</p>
                            <p className="text-sm font-black text-white">{val}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Compare notice */}
                    <p className="text-center text-[10px] text-gray-700 font-bold mt-6 uppercase tracking-widest">
                      All specs subject to ±5% manufacturing tolerance
                    </p>
                  </div>
                </>
              ) : (
                <CheckoutWizard product={product} cl={cl} router={router} onClose={onClose} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CheckoutWizard Component
// ─────────────────────────────────────────────────────────────
function CheckoutWizard({ product, cl, router, onClose }: { product: Product; cl: any; router: any; onClose: () => void }) {
  const [region, setRegion] = useState("Reykjavik, Iceland");
  const [paymentMethod, setPaymentMethod] = useState("CreditCard");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingName || !billingEmail) {
      alert("Please fill in billing details.");
      return;
    }

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to make a purchase. Redirecting to login...");
      router.push("/login");
      return;
    }

    setProcessing(true);
    setStep(1);

    // Step-by-step progress animation
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          setStep(4);
          setTimeout(async () => {
            setStep(5);
            try {
              // Insert purchase
              const { data: purchase, error: purchaseError } = await supabase
                .from("purchases")
                .insert({
                  user_id: session.user.id,
                  product_id: product.id,
                  product_name: product.name,
                  price: product.price,
                  status: "completed"
                })
                .select()
                .single();
                
              if (purchaseError) throw purchaseError;

              // Insert node
              const { error: nodeError } = await supabase
                .from("nodes")
                .insert({
                  user_id: session.user.id,
                  purchase_id: purchase.id,
                  node_name: product.name + " Node",
                  hashrate: product.hashrate || (product.id === "starter-kit" ? "2.15 TH/s" : "50 TH/s"),
                  power: product.id === "starter-kit" ? "185 W" : (product.id === "t200" ? "5,000 W" : product.id === "f100" ? "2,800 W" : product.id === "f50" ? "1,500 W" : product.id === "mini" ? "45 W" : product.id === "nano" ? "10 W" : "5 W"),
                  region: region.split(" (")[0],
                  status: "online"
                });

              if (nodeError) throw nodeError;

              // Close modal and redirect
              onClose();
              router.push(`/dashboard`);
            } catch (error: any) {
              console.error(error);
              alert("Checkout failed: " + error.message);
              setProcessing(false);
            }
          }, 1000);
        }, 800);
      }, 800);
    }, 800);
  };

  const currentStepText = () => {
    switch (step) {
      case 1: return cl.stage1;
      case 2: return cl.stage2;
      case 3: return cl.stage3;
      case 4: return cl.stage4;
      case 5: return cl.stage5;
      default: return cl.successRedirectMsg;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
      {processing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#00f2ff] animate-spin absolute" />
            <div className="w-6 h-6 bg-[#00f2ff]/20 rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-white animate-pulse">
              {currentStepText()}
            </h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Secure Gateway Telemetry // Sandbox v2.4
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-[#00f2ff] h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#00f2ff]">
              {cl.checkoutHeader}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              {cl.orderSummary}: {product.name} (1x)
            </p>
          </div>

          {/* Warning banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold flex flex-col gap-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle size={14} className="text-amber-500" />
              <span>{cl.sandboxAlertTitle}</span>
            </div>
            <span>{cl.sandboxAlertDesc}</span>
          </div>

          {/* Hosting Center Location */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <Globe size={12} /> {cl.hostingRegion}
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00f2ff]/60 appearance-none cursor-pointer"
              >
                <option value="Reykjavik, Iceland" className="bg-[#0a0a0a]">{cl.iceland}</option>
                <option value="Helsinki, Finland" className="bg-[#0a0a0a]">{cl.finland}</option>
                <option value="Luleå, Sweden" className="bg-[#0a0a0a]">{cl.sweden}</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <CreditCard size={12} /> {cl.paymentMethod}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "CreditCard", label: cl.creditCard },
                { id: "Bitcoin", label: cl.bitcoin },
                { id: "USDT", label: cl.usdt }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-3 px-2 rounded-xl text-[9px] font-black uppercase text-center border transition-all ${
                    paymentMethod === m.id
                      ? "bg-[#00f2ff]/10 border-[#00f2ff] text-[#00f2ff]"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                <User size={12} /> {cl.billingName}
              </label>
              <input
                type="text"
                required
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                placeholder={cl.namePlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 text-xs"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                <Mail size={12} /> {cl.billingEmail}
              </label>
              <input
                type="email"
                required
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder={cl.emailPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00f2ff]/60 text-xs"
              />
            </div>
          </div>

          {/* Order Summary Total */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-gray-500">
              <span>{cl.product}</span>
              <span>{product.name} (1x)</span>
            </div>
            <div className="flex justify-between font-bold text-gray-500">
              <span>{cl.price}</span>
              <span>{product.price}</span>
            </div>
            <div className="flex justify-between font-black text-white pt-2 border-t border-white/5">
              <span>TOTAL DUE</span>
              <span className="text-[#00f2ff]">{cl.sandboxFree}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-[#00f2ff] text-black font-black uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-[#00e1ec] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <CheckCircle size={16} /> {cl.processPaymentBtn}
          </button>
        </form>
      )}
    </div>
  );
}
