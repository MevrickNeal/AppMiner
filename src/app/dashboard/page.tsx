"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, Wallet, Cpu, LogOut, Shield, 
  Settings, Bell, ChevronRight, User, Terminal,
  ShieldAlert, UserX, Activity, Database, AlertTriangle, Play, Square,
  ShoppingBag, LifeBuoy, Globe, Package
} from "lucide-react";
import MiningDashboard from "@/components/MiningDashboard";
import WalletServices from "@/components/WalletServices";
import OrderHistoryView from "@/components/dashboard/OrderHistoryView";
import SupportView from "@/components/dashboard/SupportView";
import ShopView from "@/components/dashboard/ShopView";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { syncMiningEarnings } from "@/app/actions";


const DASH_LOCAL_I18N: Record<string, Record<string, string>> = {
  EN: {
    secureSessionId: "Secure Session ID",
    networkOnline: "Network Online",
    vsLastHour: "+12.4% vs last hour",
    btcTotal: "43.2041 BTC total",
    allOperational: "All operational (99.99%)",
    manageNodesDesc: "View real-time efficiency metrics, adjust performance profiles, and check active system telemetry.",
    accessSecureWalletsDesc: "Review hot and cold wallet allocations, access transaction logs, and configure security thresholds.",
    securityEventLog: "Security event log",
    log1: "SECURE SOCKET ESTABLISHED WITH CLIENT (IP: 192.168.1.109)",
    log2: "HASH NODE #3 AUTOSCALED. LOAD: 89.2% EFFICIENCY: 99.8%",
    log3: "AUTO-SWEEP RULE CHECK: BALANCES ARE BELOW TRANSITION THRESHOLD",
    log4: "CLIENT REQUESTS TRANSLATION ENGINE TO DEPLOY OVER MULTI-LOCALE PATHS",
    dashPurchases: "Order History",
    dashSupport: "Support",
    operatorPreferences: "Operator Preferences",
    twoFactorAuth: "Two-Factor Authentication (2FA)",
    twoFactorAuthDesc: "Requires a security key on every authentication request.",
    autoSweepCold: "Auto-Sweep to Cold Storage",
    autoSweepColdDesc: "Sweeps hot wallet funds to cold vault above 5.0 BTC.",
    realtimeAlerts: "Real-time Node Alerts",
    realtimeAlertsDesc: "SMS alerts if aggregate node hashrate drops below 300 TH/s.",
    secureLink: "Secure Link",
    roleAdmin: "System Administrator",
    authenticating: "Authenticating Session...",
    connectingGate: "Connecting Secure Gate",
    
    // Admin additions
    adminConsole: "Admin Console",
    systemHealth: "System Health & Controls",
    userDirectory: "Operator Directory",
    emergencyActions: "Emergency Actions",
    shutdownAll: "Emergency Shutdown",
    forceSweep: "Force Cold Sweep",
    supabaseStatus: "Database Integration Status",
    overclockLabel: "Aggregate Overclocking",
    revokeAccess: "Revoke Access",
    activeOperators: "Active Operators",
    dbEndpoint: "DB Endpoint",
    anonKeyLength: "Anon Key Status",
    revokedStatus: "REVOKED",
    activeStatus: "ACTIVE",
    idleStatus: "IDLE"
  },
  AR: {
    secureSessionId: "معرف الجلسة الآمن",
    networkOnline: "الشبكة متصلة",
    vsLastHour: "+١٢.٤٪ مقارنة بالساعة الماضية",
    btcTotal: "إجمالي ٤۳.۲۰宏١ BTC",
    allOperational: "جميع العقد تعمل (৯৯.৯৯٪)",
    manageNodesDesc: "عرض مقاييس الكفاءة في الوقت الفعلي، وضبط ملفات تعريف الأداء، والتحقق من التنبيهات المباشرة للعقد.",
    accessSecureWalletsDesc: "مراجعة مخصصات المحافظ الساخنة والباردة، والوصول إلى سجلات المعاملات، وتكوين حدود الأمان.",
    securityEventLog: "سجل الأحداث الأمنية",
    log1: "تم إنشاء مقبس آمن مع العميل (IP: 192.168.1.109)",
    log2: "توسيع تلقائي لعقدة الهاش #3. الحمل: 89.2% الكفاءة: 99.8%",
    log3: "فحص قاعدة السحب التلقائي: الأرصدة أقل من حد الانتقال",
    log4: "العميل يطلب نشر محرك الترجمة عبر مسارات متعددة اللغات",
    operatorPreferences: "تفضيلات المشغل",
    twoFactorAuth: "المصادقة الثنائية (2FA)",
    twoFactorAuthDesc: "يتطلب مفتاح أمان عند كل طلب مصادقة لجلسة العمل.",
    autoSweepCold: "السحب التلقائي للتخزين البارد",
    autoSweepColdDesc: "يسحب أموال المحفظة الساخنة إلى الخزنة الباردة فوق 5.0 BTC.",
    realtimeAlerts: "تنبيهات العقد في الوقت الفعلي",
    realtimeAlertsDesc: "تنبيهات SMS إذا انخفض معدل الهاش الإجمالي عن 300 TH/s.",
    secureLink: "رابط آمن",
    roleAdmin: "مسؤول النظام",
    authenticating: "يتم التحقق من الجلسة...",
    connectingGate: "الاتصال بالبوابة الآمنة",
    
    // Admin additions
    adminConsole: "لوحة تحكم المسؤول",
    systemHealth: "صحة النظام والتحكم",
    userDirectory: "دليل المشغلين",
    emergencyActions: "إجراءات الطوارئ",
    shutdownAll: "إيقاف التشغيل الطارئ",
    forceSweep: "فرض التحويل البارد",
    supabaseStatus: "حالة تكامل قاعدة البيانات",
    overclockLabel: "زيادة سرعة الهاش الإجمالية",
    revokeAccess: "إلغاء الصلاحية",
    activeOperators: "المشغلون النشطون",
    dbEndpoint: "نقطة اتصال قاعدة البيانات",
    anonKeyLength: "مفتاح المصادقة العام",
    revokedStatus: "ملغي",
    activeStatus: "نشط",
    idleStatus: "خامل"
  },
  HI: {
    secureSessionId: "सुरक्षित सत्र आईडी",
    networkOnline: "नेटवर्क ऑनलाइन",
    vsLastHour: "+12.4% पिछले घंटे की तुलना में",
    btcTotal: "कुल 43.2041 BTC",
    allOperational: "सभी कार्यरत हैं (99.99%)",
    manageNodesDesc: "वास्तविक समय दक्षता मेट्रिक्स देखें, प्रदर्शन प्रोफाइल समायोजित करें, और सक्रिय सिस्टम टेलीमेट्री की जांच करें।",
    accessSecureWalletsDesc: "हॉट और कोल्ड वॉलेट आवंटन की समीक्षा करें, लेनदेन लॉग तक पहुंचें, और सुरक्षा सीमाएं कॉन्फ़िगर करें।",
    securityEventLog: "सुरक्षा घटना लॉग",
    log1: "क्लाइंट के साथ सुरक्षित सॉकेट स्थापित (IP: 192.168.1.109)",
    log2: "हैश नोड #3 ऑटोस्केल हुआ। लोड: 89.2% दक्षता: 99.8%",
    log3: "ऑटो-स्वीप नियम जांच: शेष राशि संक्रमण सीमा से नीचे है",
    log4: "क्लाइंट ने बहु-स्थानीय पथों पर अनुवाद इंजन को तैनात करने का अनुरोध किया",
    operatorPreferences: "ऑपरेटर प्राथमिकताएं",
    twoFactorAuth: "द्वि-कारक प्रमाणीकरण (2FA)",
    twoFactorAuthDesc: "प्रत्येक प्रमाणीकरण अनुरोध पर एक सुरक्षा कुंजी की आवश्यकता होती है।",
    autoSweepCold: "कोल्ड स्टोरेज में ऑटो-स्वीप",
    autoSweepColdDesc: "5.0 BTC से ऊपर हॉट वॉलेट फंड को कोल्ड वॉल्ट में स्वीप करता है।",
    realtimeAlerts: "वास्तविक समय नोड अलर्ट",
    realtimeAlertsDesc: "यदि कुल हैशरेट 300 TH/s से नीचे गिरती है तो एसएमएस अलर्ट।",
    secureLink: "सुरक्षित लिंक",
    roleAdmin: "सिस्टम प्रशासक",
    authenticating: "सत्र प्रमाणित किया जा रहा है...",
    connectingGate: "सुरक्षित गेट को जोड़ा जा रहा है",
    
    // Admin additions
    adminConsole: "प्रशासक कंसोल",
    systemHealth: "सिस्टम स्वास्थ्य और नियंत्रण",
    userDirectory: "ऑपरेटर निर्देशिका",
    emergencyActions: "आपातकालीन कार्रवाइयां",
    shutdownAll: "आपातकालीन शटडाउन",
    forceSweep: "जबरन कोल्ड स्वीप",
    supabaseStatus: "डेटाबेस एकीकरण स्थिति",
    overclockLabel: "कुल ओवरक्लॉकिंग",
    revokeAccess: "पहुंच रद्द करें",
    activeOperators: "सक्रिय ऑपरेटर",
    dbEndpoint: "डेटाबेस एंडपॉइंट",
    anonKeyLength: "अनाम कुंजी स्थिति",
    revokedStatus: "निरस्त",
    activeStatus: "सक्रिय",
    idleStatus: "निष्क्रिय"
  },
  DE: {
    secureSessionId: "Sichere Sitzungs-ID",
    networkOnline: "Netzwerk Online",
    vsLastHour: "+12.4% gegenüber der letzten Stunde",
    btcTotal: "43.2041 BTC gesamt",
    allOperational: "Alle betriebsbereit (99.99%)",
    manageNodesDesc: "Effizienzmetriken in Echtzeit anzeigen, Leistungsprofile anpassen und Systemtelemetrie prüfen.",
    accessSecureWalletsDesc: "Hot- und Cold-Wallet-Allokationen überprüfen, Transaktionsprotokolle einsehen und Sicherheitsgrenzwerte konfigurieren.",
    securityEventLog: "Sicherheits-Ereignisprotokoll",
    log1: "SECURE SOCKET MIT CLIENT HERGESTELLT (IP: 192.168.1.109)",
    log2: "HASH-NODE #3 AUTOMATISCH SKALIERT. LAST: 89.2% EFFIZIENZ: 99.8%",
    log3: "AUTO-SWEEP REGELPRÜFUNG: GUTHABEN LIEGT UNTER DEM SCHWELLENWERT",
    log4: "CLIENT BEANTRAGT BEREITSTELLUNG DER ÜBERSETZUNGSMASCHINE FÜR MULTI-LOCALE",
    operatorPreferences: "Operator-Einstellungen",
    twoFactorAuth: "Zwei-Faktor-Authentifizierung (2FA)",
    twoFactorAuthDesc: "Erfordert einen Sicherheitsschlüssel bei jeder Authentifizierungsanfrage.",
    autoSweepCold: "Auto-Sweep in Cold Storage",
    autoSweepColdDesc: "Überträgt Hot-Wallet-Guthaben über 5.0 BTC automatisch in den Cold Vault.",
    realtimeAlerts: "Echtzeit-Node-Warnungen",
    realtimeAlertsDesc: "SMS-Benachrichtigung, wenn die Gesamt-Hashrate unter 300 TH/s fällt.",
    secureLink: "Sichere Verbindung",
    roleAdmin: "Systemadministrator",
    authenticating: "Sitzung wird authentifiziert...",
    connectingGate: "Sichere Verbindung wird hergestellt",
    
    // Admin additions
    adminConsole: "Admin-Konsole",
    systemHealth: "Systemgesundheit & Kontrollen",
    userDirectory: "Operator-Verzeichnis",
    emergencyActions: "Notfallaktionen",
    shutdownAll: "Notabschaltung",
    forceSweep: "Kaltüberweisung erzwingen",
    supabaseStatus: "Datenbank-Integrationsstatus",
    overclockLabel: "Gesamt-Übertaktung",
    revokeAccess: "Zugang entziehen",
    activeOperators: "Aktive Operatoren",
    dbEndpoint: "DB-Endpunkt",
    anonKeyLength: "Anon-Key-Status",
    revokedStatus: "ENTZOGEN",
    activeStatus: "AKTIV",
    idleStatus: "INAKTIV"
  },
  FR: {
    secureSessionId: "ID de Session Sécurisée",
    networkOnline: "Réseau en Ligne",
    vsLastHour: "+12.4% vs heure précédente",
    btcTotal: "43.2041 BTC au total",
    allOperational: "Tous opérationnels (99.99%)",
    manageNodesDesc: "Consulter les métriques d'efficacité en temps réel, ajuster les profils de performance et vérifier la télémétrie des nœuds.",
    accessSecureWalletsDesc: "Vérifier l'allocation des portefeuilles chauds et froids, consulter les journaux de transaction et définir les seuils de sécurité.",
    securityEventLog: "Journal des événements de sécurité",
    log1: "SOCKET SÉCURISÉ ÉTABLI AVEC LE CLIENT (IP: 192.168.1.109)",
    log2: "NŒUD DE HACHAGE #3 MIS À L'ÉCHELLE. CHARGE: 89.2% EFFICACITÉ: 99.8%",
    log3: "RÈGLE D'AUTO-BALAYAGE: LES BALANCES SONT SOUS LE SEUIL DE TRANSITION",
    log4: "LE CLIENT DEMANDE LE DÉPLOIEMENT DU MOTEUR DE TRADUCTION SUR PLUSIEURS PAYS",
    operatorPreferences: "Préférences Opérateur",
    twoFactorAuth: "Authentification à double facteur (2FA)",
    twoFactorAuthDesc: "Requiert une clé de sécurité physique à chaque demande d'authentification.",
    autoSweepCold: "Balayage automatique vers Cold Storage",
    autoSweepColdDesc: "Transfère les fonds du hot wallet vers le cold vault au-delà de 5.0 BTC.",
    realtimeAlerts: "Alertes de nœuds en temps réel",
    realtimeAlertsDesc: "Alerte SMS si le hashrate global tombe en dessous de 300 TH/s.",
    secureLink: "Lien Sécurisé",
    roleAdmin: "Administrateur Système",
    authenticating: "Authentification de la session...",
    connectingGate: "Connexion à la passerelle sécurisée",
    
    // Admin additions
    adminConsole: "Console Admin",
    systemHealth: "Santé Système & Contrôles",
    userDirectory: "Répertoire Opérateurs",
    emergencyActions: "Mesures d'Urgence",
    shutdownAll: "Arrêt d'Urgence",
    forceSweep: "Forcer le Balayage Froid",
    supabaseStatus: "Statut Base de Données",
    overclockLabel: "Surcadençage Global",
    revokeAccess: "Révoquer l'accès",
    activeOperators: "Opérateurs Actifs",
    dbEndpoint: "Point d'accès DB",
    anonKeyLength: "Statut clé publique",
    revokedStatus: "RÉVOQUÉ",
    activeStatus: "ACTIF",
    idleStatus: "INACTIF"
  },
  ES: {
    secureSessionId: "ID de Sesión Segura",
    networkOnline: "Red en Línea",
    vsLastHour: "+12.4% vs última hora",
    btcTotal: "43.2041 BTC en total",
    allOperational: "Todos operativos (99.99%)",
    manageNodesDesc: "Vea métricas de eficiencia en tiempo real, ajuste perfiles de rendimiento y revise la telemetría del sistema.",
    accessSecureWalletsDesc: "Revise asignaciones de billeteras calientes y frías, acceda a registros de transacciones y configure límites de seguridad.",
    securityEventLog: "Registro de eventos de seguridad",
    log1: "SOCKET SEGURO ESTABLECIDO CON EL CLIENTE (IP: 192.168.1.109)",
    log2: "NODO HASH #3 ESCALADO AUTOMÁTICAMENTE. CARGA: 89.2% EFICIENCIA: 99.8%",
    log3: "COMPROBACIÓN DE RETIRO AUTOMÁTICO: SALDOS POR DEBAJO DEL LÍMITE",
    log4: "EL CLIENTE SOLICITA EL MOTOR DE TRADUCCIÓN PARA RUTAS MULTI-IDIOMA",
    operatorPreferences: "Preferencias del Operador",
    twoFactorAuth: "Autenticación de Dos Factores (2FA)",
    twoFactorAuthDesc: "Requiere una llave de seguridad física en cada solicitud de acceso.",
    autoSweepCold: "Retiro Automático a Bóveda Fría",
    autoSweepColdDesc: "Transfiere fondos de billetera caliente a bóveda fría por encima de 5.0 BTC.",
    realtimeAlerts: "Alertas de Nodos en Tiempo Real",
    realtimeAlertsDesc: "Alertas SMS si la tasa de hash agregada cae por debajo de 300 TH/s.",
    secureLink: "Enlace Seguro",
    roleAdmin: "Administrador del Sistema",
    authenticating: "Autenticando sesión...",
    connectingGate: "Conectando compuerta segura",
    
    // Admin additions
    adminConsole: "Consola de Admin",
    systemHealth: "Estado del Sistema y Controles",
    userDirectory: "Directorio de Operadores",
    emergencyActions: "Acciones de Emergencia",
    shutdownAll: "Apagado de Emergencia",
    forceSweep: "Forzar Retiro a Bóveda",
    supabaseStatus: "Integración de Base de Datos",
    overclockLabel: "Overclocking Agregado",
    revokeAccess: "Revocar Acceso",
    activeOperators: "Operadores Activos",
    dbEndpoint: "Endpoint de BD",
    anonKeyLength: "Clave Pública",
    revokedStatus: "REVOCADO",
    activeStatus: "ACTIVO",
    idleStatus: "INACTIVO"
  },
  BN: {
    secureSessionId: "সুরক্ষিত সেশন আইডি",
    networkOnline: "নেটওয়ার্ক অনলাইন",
    vsLastHour: "গত ঘন্টার চেয়ে +১২.৪% বৃদ্ধি",
    btcTotal: "সর্বমোট ৪৩.২০৪১ BTC",
    allOperational: "সবগুলো সচল রয়েছে (৯৯.৯৯%)",
    manageNodesDesc: "রিয়েল-টাইম দক্ষতা সূচক দেখুন, কার্যক্ষমতা প্রোফাইল সামঞ্জস্য করুন এবং নোডের লাইভ টেলিমেট্রি চেক করুন।",
    accessSecureWalletsDesc: "হট এবং কোল্ড ওয়ালেট বরাদ্দ পর্যালোচনা করুন, লেনদেনের তথ্য অ্যাক্সেস করুন এবং সুরক্ষার সীমা নির্ধারণ করুন।",
    securityEventLog: "নিরাপত্তা ইভেন্ট লগ",
    log1: "ক্লায়েন্টের সাথে নিরাপদ সকেট সংযোগ স্থাপন (আইপি: ১৯২.১৬৮.১.১০৯)",
    log2: "হ্যাশ নোড #৩ অটোস্কেল করা হয়েছে। লোড: ৮৯.২% দক্ষতা: ৯৯.৮%",
    log3: "অটো-সুইপ নিয়ম পরীক্ষা: ব্যালেন্স স্থানান্তরের সীমার নিচে রয়েছে",
    log4: "ক্লায়েন্ট ভাষা পরিবর্তন ইঞ্জিন সক্রিয় করার অনুরোধ করেছেন",
    operatorPreferences: "অপারেটর পছন্দসমূহ",
    twoFactorAuth: "দ্বি-স্তর বিশিষ্ট নিরাপত্তা যাচাই (2FA)",
    twoFactorAuthDesc: "প্রতিটি লগইন অনুরোধে একটি হার্ডওয়্যার সিকিউরিটি কী এর প্রয়োজন হবে।",
    autoSweepCold: "কোল্ড স্টোরেজে অটো সুইপ",
    autoSweepColdDesc: "হট ওয়ালেটের ব্যালেন্স ৫.০ BTC এর উপরে গেলে অটো কোল্ড ভল্টে পাঠায়।",
    realtimeAlerts: "রিয়েল-টাইম নোড সতর্কতা",
    realtimeAlertsDesc: "মোট সংগৃহীত হ্যাশরেট ৩০০ TH/s এর নিচে নামলে এসএমএস নোটিফিকেশন পাঠান।",
    secureLink: "সুরক্ষিত লিংক",
    roleAdmin: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
    authenticating: "সেশন যাচাই করা হচ্ছে...",
    connectingGate: "সুরক্ষিত গেট সংযোগ করা হচ্ছে",
    
    // Admin additions
    adminConsole: "অ্যাডমিন কনসোল",
    systemHealth: "সিস্টেমের স্বাস্থ্য ও নিয়ন্ত্রণ",
    userDirectory: "অপারেটর ডিরেক্টরি",
    emergencyActions: "জরুরি পদক্ষেপসমূহ",
    shutdownAll: "জরুরি শাটডাউন",
    forceSweep: "বাধ্যতামূলক কোল্ড সুইপ",
    supabaseStatus: "ডাটাবেজ সংযোগ অবস্থা",
    overclockLabel: "হ্যাশরেট বৃদ্ধি (ওভারক্লকিং)",
    revokeAccess: "অ্যাক্সেস বাতিল করুন",
    activeOperators: "সক্রিয় অপারেটরসমূহ",
    dbEndpoint: "ডাটাবেজ এন্ডপয়েন্ট",
    anonKeyLength: "পাবলিক কী অবস্থা",
    revokedStatus: "বাতিলকৃত",
    activeStatus: "সক্রিয়",
    idleStatus: "নিষ্ক্রিয়"
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { language, t, isRtl } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "mining" | "wallet" | "settings" | "admin" | "purchases" | "support" | "shop">("overview");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  
  // Real-time live Bitcoin price state
  const [btcPrice, setBtcPrice] = useState(64250);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function fetchBtcPrice() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data = await res.json();
        if (data?.bitcoin?.usd) {
          setBtcPrice(data.bitcoin.usd);
        }
      } catch (err) {
        console.warn("Failed to fetch live BTC price:", err);
      }
    }
    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "overview", label: t("navOverview"), icon: LayoutDashboard },
    { id: "mining", label: "Mining", icon: Cpu },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "shop", label: "Shop", icon: ShoppingBag },
    { id: "purchases", label: "Orders", icon: Package },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];

  // Interactive Admin Dashboard States
  const [overclocked, setOverclocked] = useState(false);
  const [systemActive, setSystemActive] = useState(true);
  const [revokedUsers, setRevokedUsers] = useState<string[]>([]);
  const [adminLogs, setAdminLogs] = useState<string[]>([]);
  
  // Real Admin Data
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [allNodes, setAllNodes] = useState<any[]>([]);

  // User Balance and Nodes simulation states
  const [usdBalance, setUsdBalance] = useState(100.00);
  const [nodesList, setNodesList] = useState<any[]>([]);
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>([]);
  const [offlineEarningsAlert, setOfflineEarningsAlert] = useState<{ earnings: number; elapsedHours: number } | null>(null);

  const code = language.code;
  const l = DASH_LOCAL_I18N[code] || DASH_LOCAL_I18N.EN;

  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const reloadUpgrades = async () => {
    try {
      let upgrades: string[] = [];
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("purchases")
          .select("product_id")
          .eq("user_id", session.user.id);
        if (data) {
          upgrades = data.map((p: any) => p.product_id);
        }
      }
      setOwnedUpgrades(upgrades);
      return upgrades;
    } catch (err) {
      console.warn("Failed to load upgrades:", err);
      return [];
    }
  };

  useEffect(() => {
    async function checkUser() {
      try {
        setIsDemo(false);
        
        const upgrades = await reloadUpgrades();

        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user?.email || "operator@appsminers.com");

          const token = session.access_token;
          const res = await syncMiningEarnings(
            token,
            overclocked,
            systemActive
          );

          if (res && res.success && typeof res.newBalance === "number" && typeof res.earnings === "number" && typeof res.elapsedHours === "number") {
            if (res.earnings > 0) {
              setOfflineEarningsAlert({ earnings: res.earnings, elapsedHours: res.elapsedHours });
            }
            setUsdBalance(res.newBalance);
            localStorage.setItem("appsminers_usd_balance", res.newBalance.toFixed(2));
            setNodesList(res.updatedNodes);
          } else {
            console.warn("Server action offline earnings sync failed, using client-side fallback:", res?.error);
            const { data: wallet } = await supabase
              .from("wallets")
              .select("usd_balance")
              .eq("user_id", session.user.id)
              .single();

            if (wallet && wallet.usd_balance !== null) {
              const dbBal = parseFloat(String(wallet.usd_balance));
              setUsdBalance(dbBal);
              localStorage.setItem("appsminers_usd_balance", dbBal.toFixed(2));
            }

            const { data: nodesData } = await supabase
              .from("nodes")
              .select("*")
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: false });

            if (nodesData) {
              const mapped = nodesData.map(n => ({
                id: n.id,
                productName: n.product_name,
                hashrate: n.hashrate,
                power: n.power,
                region: n.region,
                status: n.status,
                hosting_type: n.hosting_type || "remote",
                setup_configured: n.setup_configured !== undefined && n.setup_configured !== null ? n.setup_configured : false,
                shipping_address: n.shipping_address || null,
                shipping_started_at: n.shipping_started_at || null,
                created_at: n.created_at
              }));
              setNodesList(mapped);
            }
          }

          // Check if admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
            
          if (profile?.is_admin) {
            setIsAdmin(true);

            // Fetch admin data
            const [profilesRes, nodesRes] = await Promise.all([
              supabase.from("profiles").select("*"),
              supabase.from("nodes").select("*")
            ]);

            if (profilesRes.data) setAllProfiles(profilesRes.data);
            if (nodesRes.data) setAllNodes(nodesRes.data);
          }
          
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.warn("Supabase session check failed", err);
        router.push("/login");
      }
    }
    checkUser();

    let subscription: any = null;

    try {
      const authRes = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUserId(session.user?.id || "");
          setUserEmail(session.user?.email || "operator@appsminers.com");
        }
      });
      subscription = authRes.data?.subscription;
    } catch (err) {
      console.warn("Supabase auth state listener failed", err);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  // Real-time mining earnings tick loop
  useEffect(() => {
    let lastSyncTime = Date.now();
    const interval = setInterval(async () => {
      const getRate = (name: string): number => {
        const lower = name.toLowerCase();
        if (lower.includes("t200")) return 0.05;
        if (lower.includes("f100")) return 0.025;
        if (lower.includes("f50")) return 0.0125;
        if (lower.includes("starter")) return 0.006;
        if (lower.includes("mini")) return 0.002;
        if (lower.includes("nano")) return 0.0006;
        if (lower.includes("pocket")) return 0.0002;
        return 0.001;
      };

      let balanceDiff = 0;
      let nodesChanged = false;
      
      let multiplier = 1.0;
      if (ownedUpgrades.includes("overclock-license")) {
        multiplier += 0.10;
      }
      if (ownedUpgrades.includes("cooling-booster")) {
        multiplier += 0.15;
      }
      if (overclocked) {
        multiplier += 0.15;
      }
      
      const updatedNodes = nodesList.map(node => {
        if (node.status === "activating" && node.created_at) {
          const elapsed = Date.now() - new Date(node.created_at).getTime();
          if (elapsed >= 120000) { // 2 minutes activation delay
            nodesChanged = true;
            const updatedNode = { ...node, status: "online" };
            
            if (userId) {
              supabase
                .from("nodes")
                .update({ status: "online" })
                .eq("id", node.id)
                .eq("user_id", userId)
                .then();
            }
            return updatedNode;
          }
        }

        // Transition from shipping to delivered
        if (node.status === "shipping" && node.shipping_started_at) {
          const elapsed = Date.now() - new Date(node.shipping_started_at).getTime();
          if (elapsed >= 30000) { // 30 seconds transit delay for simulation quick feedback
            nodesChanged = true;
            const updatedNode = { ...node, status: "delivered" };
            
            if (userId) {
              supabase
                .from("nodes")
                .update({ status: "delivered" })
                .eq("id", node.id)
                .eq("user_id", userId)
                .then();
            }
            return updatedNode;
          }
        }

        if (node.status === "online" && systemActive) {
          const baseRate = getRate(node.productName);
          // 15% maintenance and energy fee deduction for remote hosting
          const nodeYield = node.hosting_type === "remote" ? baseRate * 0.85 : baseRate;
          balanceDiff += nodeYield * multiplier;
        }

        return node;
      });

      if (nodesChanged) {
        setNodesList(updatedNodes);
      }

      if (balanceDiff > 0) {
        setUsdBalance(prev => {
          const nextBal = prev + balanceDiff;
          localStorage.setItem("appsminers_usd_balance", nextBal.toFixed(2));
          
          if (Date.now() - lastSyncTime >= 15000 && userId) {
            lastSyncTime = Date.now();
            supabase
              .from("wallets")
              .update({ usd_balance: nextBal, updated_at: new Date().toISOString() })
              .eq("user_id", userId)
              .then();
          }
          return nextBal;
        });
      } else {
        if (Date.now() - lastSyncTime >= 15000 && userId) {
          lastSyncTime = Date.now();
          supabase
            .from("wallets")
            .update({ updated_at: new Date().toISOString() })
            .eq("user_id", userId)
            .then();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nodesList, systemActive, ownedUpgrades, overclocked, userId]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("appsminers_demo");
      setUserId("");
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("appsminers_auth_change"));
      }
    } catch (e) {}
    router.push("/");
  };

  const user = {
    name: userEmail ? userEmail.split("@")[0].toUpperCase() : "OPERATOR",
    email: userEmail,
    role: isAdmin ? l.roleAdmin : "Operator",
    joined: "June 2026",
    avatar: "/Products/icon blue.png"
  };

  // Helper actions
  const triggerShutdown = () => {
    setSystemActive(!systemActive);
    const now = new Date().toLocaleTimeString();
    setAdminLogs(prev => [`[${now}] EMERGENCY SHUTDOWN TOGGLED. SYSTEM STATUS: ${!systemActive ? "ONLINE" : "SHUT DOWN"}`, ...prev]);
  };

  const triggerSweep = () => {
    const now = new Date().toLocaleTimeString();
    setAdminLogs(prev => [`[${now}] SECURE WALLET SWEEP INITIATED. ALL HOT FUNDS MOVED TO DEEP VAULT`, ...prev]);
    alert("Force sweep executed successfully. Hot wallets are cleared.");
  };

  const toggleOverclock = () => {
    setOverclocked(!overclocked);
    const now = new Date().toLocaleTimeString();
    setAdminLogs(prev => [`[${now}] SYSTEM OVERCLOCK ${!overclocked ? "ENABLED (+15% Hashing Power)" : "DISABLED"}`, ...prev]);
  };

  const revokeUser = (email: string) => {
    if (revokedUsers.includes(email)) return;
    setRevokedUsers(prev => [...prev, email]);
    const now = new Date().toLocaleTimeString();
    setAdminLogs(prev => [`[${now}] REVOKED ACCESS FOR OPERATOR: ${email}`, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f2ff]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative w-36 h-36">
            <Image
              src="/Products/loading.gif"
              alt="AppsMiners Loading"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00f2ff] animate-pulse">
              {l.authenticating}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              {l.connectingGate}
            </span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row pb-20 lg:pb-0 overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-80 bg-[#070707] border-r border-white/5 flex-col p-6 gap-8 z-20 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <Image
              src="/Products/icon blue.png"
              alt="AppsMiners"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-black tracking-tighter text-white block leading-none">AppsMiners</span>
            <span className="text-[9px] font-bold text-[#00f2ff] tracking-widest uppercase">{t("dashSecuredTerminal")}</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20">
            <User size={18} className="text-[#00f2ff]" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-black text-white truncate">{user.name}</h4>
            <p className="text-[10px] text-gray-500 font-medium truncate">{user.role}</p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "overview" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={14} />
            {t("navOverview")}
          </button>
          
          <button
            onClick={() => setActiveTab("mining")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "mining" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cpu size={14} />
            {t("dashMiningProgress")}
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "wallet" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wallet size={14} />
            {t("dashWalletStatus")}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "settings" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings size={14} />
            {t("dashSettings")}
          </button>

          <button
            onClick={() => setActiveTab("shop")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "shop" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingBag size={14} />
            Shop
          </button>

          <button
            onClick={() => setActiveTab("purchases")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "purchases" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Package size={14} />
            {l.dashPurchases || "Order History"}
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "support" 
                ? "bg-[#00f2ff] text-black" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <LifeBuoy size={14} />
            {l.dashSupport || "Support"}
          </button>

          {/* Admin tab visible only to administrators */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === "admin" 
                  ? "bg-red-500 text-black shadow-[0_4px_15px_rgba(239,68,68,0.2)]" 
                  : "text-gray-500 hover:text-red-400 hover:bg-red-500/5"
              }`}
            >
              <ShieldAlert size={14} />
              {l.adminConsole}
            </button>
          )}

          <div className="h-[1px] bg-white/5 my-2" />

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-gray-500 hover:text-white hover:bg-white/5"
          >
            <Globe size={14} className="text-[#00f2ff]" />
            Home
          </Link>
        </nav>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase px-2">
            <span className="flex items-center gap-1.5"><Shield size={10} className="text-emerald-500" /> {l.secureLink}</span>
            <span>v2.4.0</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 text-red-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
          >
            <LogOut size={14} />
            {t("dashLogOut")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#030303] overflow-y-auto relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00f2ff]/3 rounded-full blur-[100px] pointer-events-none" />

        {/* Dashboard Header Banner */}
        <div className="border-b border-white/5 px-6 py-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050505]/40 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
              {activeTab === "overview" && t("dashTerminalOverview")}
              {activeTab === "mining" && t("dashMiningProgress")}
              {activeTab === "wallet" && t("dashWalletStatus")}
              {activeTab === "settings" && t("dashSettings")}
              {activeTab === "purchases" && (l.dashPurchases || "Order History")}
              {activeTab === "support" && (l.dashSupport || "Support")}
              {activeTab === "shop" && "Store & Upgrades"}
              {activeTab === "admin" && l.adminConsole}
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              {l.secureSessionId}: <span className="text-white/80 font-mono">session_ams_0994cf8e23b</span>
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f2ff]/30 text-white hover:text-[#00f2ff] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
            >
              <Globe size={11} className="text-[#00f2ff]" />
              Home
            </Link>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${systemActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {systemActive ? l.networkOnline : "Offline Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-6 md:p-10">
          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 bg-[#00f2ff] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t("dashAggregateHashrate")}</p>
                  <h3 className="text-3xl font-black text-white">{overclocked ? "478.20 TH/s" : "415.82 TH/s"}</h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <span>{l.vsLastHour} {overclocked && " (OVERCLOCKED)"}</span>
                  </div>
                </div>

                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 bg-amber-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t("dashWalletValue")}</p>
                  <h3 className="text-3xl font-black text-[#00f2ff]">
                    ${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-bold">
                    <span>{(usdBalance / btcPrice).toFixed(8)} BTC total</span>
                    <span className="text-[10px] text-[#00f2ff]/80 uppercase tracking-wider">LIVE: ${btcPrice.toLocaleString()} / BTC</span>
                  </div>
                </div>

                <div className="glass-card p-6 border border-white/10 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                  <div className="absolute top-0 left-0 h-1 bg-emerald-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t("dashActiveClusters")}</p>
                  <h3 className="text-3xl font-black text-white">
                    {systemActive 
                      ? `${nodesList.filter(n => n.status === "online" || n.status === "activating" || n.status === "paused").length} / ${nodesList.length} Systems` 
                      : `0 / ${nodesList.length} Systems`}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <span>{systemActive ? l.allOperational : "Emergency Stop Active"}</span>
                  </div>
                </div>
              </div>

              {/* Quick links to details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveTab("mining")}
                  className="glass-card p-8 border border-white/5 hover:border-[#00f2ff]/30 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-colors">
                      <Cpu size={20} />
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{t("dashManageNodes")}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{l.manageNodesDesc}</p>
                </div>

                <div 
                  onClick={() => setActiveTab("wallet")}
                  className="glass-card p-8 border border-white/5 hover:border-[#00f2ff]/30 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-colors">
                      <Wallet size={20} />
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{t("dashAccessVaults")}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{l.accessSecureWalletsDesc}</p>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="glass-card p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <Terminal size={14} className="text-[#00f2ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l.securityEventLog}</span>
                </div>
                <div className="font-mono text-[11px] text-gray-500 space-y-2">
                  <p><span className="text-gray-700">[22:34:10]</span> {l.log1}</p>
                  <p><span className="text-gray-700">[22:35:12]</span> {l.log2}</p>
                  <p><span className="text-[#00f2ff]/80">[22:38:00]</span> {l.log3}</p>
                  <p><span className="text-gray-700">[22:38:58]</span> {l.log4}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mining" && (
            <div className="space-y-6">
              <div className="glass-card p-2 border border-white/5 bg-[#050505]/40">
                <MiningDashboard nodes={nodesList} setNodes={setNodesList} usdBalance={usdBalance} />
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="glass-card p-2 border border-white/5 bg-[#050505]/40">
                <WalletServices btcPrice={btcPrice} usdBalance={usdBalance} setUsdBalance={setUsdBalance} />
              </div>
            </div>
          )}

          {activeTab === "shop" && (
            <div className="space-y-6">
              <ShopView 
                usdBalance={usdBalance} 
                setUsdBalance={setUsdBalance} 
                onPurchaseSuccess={reloadUpgrades} 
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8 py-4">
              <div className="glass-card p-8 space-y-6 border border-white/5">
                <h3 className="text-lg font-black uppercase tracking-tight">{l.operatorPreferences}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold">{l.twoFactorAuth}</p>
                      <p className="text-[10px] text-gray-500">{l.twoFactorAuthDesc}</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00f2ff] rounded-full p-1 cursor-pointer flex items-center justify-end">
                      <div className="w-4 h-4 rounded-full bg-black" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold">{l.autoSweepCold}</p>
                      <p className="text-[10px] text-gray-500">{l.autoSweepColdDesc}</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00f2ff] rounded-full p-1 cursor-pointer flex items-center justify-end">
                      <div className="w-4 h-4 rounded-full bg-black" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-xs font-bold">{l.realtimeAlerts}</p>
                      <p className="text-[10px] text-gray-500">{l.realtimeAlertsDesc}</p>
                    </div>
                    <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer flex items-center justify-start">
                      <div className="w-4 h-4 rounded-full bg-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div className="space-y-6">
              <OrderHistoryView />
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6">
              <SupportView />
            </div>
          )}

          {activeTab === "admin" && (
            <div className="space-y-10">
              
              {/* Emergency Operations & Speed Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* System Controls */}
                <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} className="text-red-500" />
                    {l.systemHealth}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide">{l.overclockLabel}</p>
                        <p className="text-[10px] text-gray-500">Safely overclock chip logic by 15% (increases cooling demands).</p>
                      </div>
                      <button 
                        onClick={toggleOverclock}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                          overclocked ? "bg-[#00f2ff] text-black" : "bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {overclocked ? "Overclock ON" : "Overclock OFF"}
                      </button>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide">{l.emergencyActions}</p>
                        <p className="text-[10px] text-gray-500">Trigger immediate actions across hot wallets and systems.</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={triggerSweep}
                          className="px-3.5 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                        >
                          {l.forceSweep}
                        </button>
                        <button 
                          onClick={triggerShutdown}
                          className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                            systemActive 
                              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black" 
                              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                          }`}
                        >
                          {systemActive ? <Square size={10} /> : <Play size={10} />}
                          {systemActive ? l.shutdownAll : "Boot Systems"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DB Integration Telemetry */}
                <div className="glass-card p-6 border border-white/10">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Database size={16} className="text-[#00f2ff]" />
                    {l.supabaseStatus}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] font-black uppercase text-gray-500 tracking-wider mb-1">{l.dbEndpoint}</p>
                      <p className="text-xs font-mono text-white truncate">{dbUrl || "Not Configured"}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black uppercase text-gray-500 tracking-wider mb-1">{l.anonKeyLength}</p>
                        <p className="text-xs font-mono text-white">
                          Connected (Live Client)
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                        Linked
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Directory */}
              <div className="glass-card p-6 border border-white/10">
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {l.userDirectory}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-400">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest font-black text-gray-500">
                        <th className="pb-3 px-2">Operator Identity</th>
                        <th className="pb-3 px-2">Contact</th>
                        <th className="pb-3 px-2">Location</th>
                        <th className="pb-3 px-2">Role</th>
                        <th className="pb-3 px-2 text-center">Status</th>
                        <th className="pb-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProfiles.length > 0 ? allProfiles.map((op) => {
                        const isRevoked = revokedUsers.includes(op.id);
                        return (
                          <tr key={op.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                            <td className="py-4 px-2 font-mono text-white font-medium">
                              {op.username || op.first_name || "Unknown Operator"}
                            </td>
                            <td className="py-4 px-2 font-mono text-xs text-gray-400">
                              {op.phone_number || "—"}
                            </td>
                            <td className="py-4 px-2 text-gray-400 font-medium">
                              {op.country || "—"}
                            </td>
                            <td className="py-4 px-2 font-bold text-gray-500">
                              {op.is_admin ? l.roleAdmin : "Operator"}
                            </td>
                            <td className="py-4 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                isRevoked 
                                  ? "bg-red-500/20 text-red-500" 
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {isRevoked ? l.revokedStatus : l.activeStatus}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              {!op.is_admin && (
                                <button
                                  onClick={() => revokeUser(op.id)}
                                  disabled={isRevoked}
                                  className="text-[10px] font-black uppercase text-red-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-red-400 transition-colors"
                                >
                                  {l.revokeAccess}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            Loading operators...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Audit Event Log */}
              <div className="glass-card p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <Terminal size={14} className="text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Admin Action Feed</span>
                </div>
                <div className="font-mono text-[11px] text-gray-500 space-y-2">
                  {adminLogs.length === 0 ? (
                    <p className="text-gray-700 italic">No admin actions performed in this session.</p>
                  ) : (
                    adminLogs.map((log, i) => (
                      <p key={i} className="text-red-400/90">{log}</p>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 z-[100] px-4 pb-safe">
        <div className="h-full max-w-md mx-auto flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all ${
                  isActive ? "text-[#00f2ff]" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <div className="relative">
                  <item.icon size={22} className={isActive ? "drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" : ""} />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00f2ff]"
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Offline Mining Modal */}
      <AnimatePresence>
        {offlineEarningsAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full p-6 text-center border-[#00f2ff]/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,transparent_70%)]" />
              <div className="w-16 h-16 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center mx-auto mb-4 text-[#00f2ff] animate-pulse">
                <Activity size={28} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff] mb-2">Offline Mining Report</h3>
              <h4 className="text-2xl font-black text-white mb-4">Welcome Back, Operator</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                While you were away for <span className="text-white font-bold">{offlineEarningsAlert.elapsedHours.toFixed(1)} hours</span>, your virtual hardware nodes remained online and active.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Estimated Earnings Mined</span>
                <span className="text-3xl font-black text-emerald-400">+${offlineEarningsAlert.earnings.toFixed(4)} USD</span>
              </div>
              <button
                onClick={() => setOfflineEarningsAlert(null)}
                className="w-full py-3 bg-[#00f2ff] hover:bg-[#00e1ec] text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02]"
              >
                Collect Earnings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


