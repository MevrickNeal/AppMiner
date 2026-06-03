"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "EN" | "AR" | "HI" | "DE" | "FR" | "ES" | "BN";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { code: "EN", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "AR", name: "Arabic", nativeName: "العربية (Dubai)", flag: "🇦🇪", dir: "rtl" },
  { code: "HI", name: "Hindi", nativeName: "हिन्दी (India)", flag: "🇮🇳", dir: "ltr" },
  { code: "DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "FR", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "BN", name: "Bengali", nativeName: "বাংলা (Bangladesh)", flag: "🇧🇩", dir: "ltr" },
];

type TranslationKey = keyof typeof translations.EN;

const translations = {
  EN: {
    // Navigation
    navProducts: "Products",
    navServices: "Services",
    navPrices: "Prices",
    navLogin: "Log In",
    navLogout: "Log Out",
    navDashboard: "Dashboard",
    navOverview: "Overview",
    navTerminal: "Terminal",

    // Hero Section
    heroBadge: "Enterprise ASIC Infrastructure",
    heroTitlePart1: "Sophisticated",
    heroTitlePart2: "Mining Ecosystem",
    heroSubtitle: "Diamond-grade liquidity, high-performance liquid-cooled hashing servers, and self-custody wallet vaults engineered for institutional miners.",
    heroCtaDeploy: "Deploy Hardware",
    heroCtaTerminal: "Access Terminal",
    tickerLiveCluster: "Live Cluster Performance",

    // Hero Intro Specific
    heroIntroBadge: "The Next Generation of Mining",
    heroIntroTitleMine: "Mine",
    heroIntroTitleWith: "With",
    heroIntroTitleAbsolute: "Absolute",
    heroIntroTitlePower: "Power",
    heroIntroSub: "Experience industrial-grade hashpower with AppsMiner. Unmatched efficiency, seamless scaling, and absolute control.",
    heroIntroShop: "Shop Now",
    heroIntroLearn: "Learn More",

    // Hardware Catalog
    catalogTitle: "ASIC Hardware Catalog",
    catalogSubtitle: "Deploy high-efficiency hashing rigs configured for immediate network synchronization.",
    catalogSpecPerformance: "Performance",
    catalogSpecPhysical: "Physical Data",
    catalogSpecElectrical: "Electrical",
    catalogSpecConnectivity: "Connectivity",
    catalogSpecViewDetails: "View Detailed Specs",
    catalogSpecBuy: "Acquire Unit",
    catalogSpecAddCart: "Add to Order",

    // Mining Dashboard
    miningTitle: "Mining Operations",
    miningSubtitle: "Live cluster activity, hash rates, and network performance indicators.",
    miningLiveHashrate: "Live Hashrate",
    miningPowerDraw: "Power Draw",
    miningActiveNodes: "Active Nodes",
    miningTodayEarnings: "Today's Yield",
    miningWeeklyYield: "Weekly BTC Yield",
    miningAllSystems: "All Nodes Operational",

    // Wallet Section
    walletTitle: "Asset Security",
    walletSubtitle: "Layered wallet architecture to safeguard liquid assets and cold vaults.",
    walletHot: "Hot Wallet",
    walletCold: "Cold Storage",
    walletTotalPortfolio: "Total Portfolio Value",
    walletAllocation: "Portfolio Allocation",
    walletInstantAccess: "Instant Access",
    walletMaximumSecurity: "Maximum Security",
    walletSecureAccess: "Access Wallet",
    walletAuthorized: "Security Cleared",

    // Footer
    footerCtaTitle: "Ready to Mine at Scale?",
    footerCtaDesc: "Connect with our infrastructure specialists to configure your custom mining array today.",
    footerCtaGetStarted: "Get Started",
    footerCtaBookDemo: "Book Array Demo",
    footerStatsSecured: "Secured Assets",
    footerStatsUptime: "Cluster Uptime",
    footerStatsSupport: "Operator Support",
    footerStatsCountries: "Countries Served",
    footerSystemsOperational: "All Systems Operational",
    footerAllRightsReserved: "All rights reserved.",
  },
  AR: {
    // Navigation
    navProducts: "المنتجات",
    navServices: "الخدمات",
    navPrices: "الأسعار",
    navLogin: "تسجيل الدخول",
    navLogout: "تسجيل الخروج",
    navDashboard: "لوحة التحكم",
    navOverview: "نظرة عامة",
    navTerminal: "المحطة الطرفية",

    // Hero Section
    heroBadge: "بنية تحتية لتعدين ASIC للمؤسسات",
    heroTitlePart1: "نظام تعدين",
    heroTitlePart2: "متقدم وذكي",
    heroSubtitle: "سيولة بمستوى الماس، وخوادم تعدين عالية الأداء مبردة بالسائل، وخزائن محفظة ذاتية الحفظ مصممة للمعدنين من المؤسسات.",
    heroCtaDeploy: "نشر الأجهزة",
    heroCtaTerminal: "دخول المحطة",
    tickerLiveCluster: "أداء المجموعة المباشر",

    // Hero Intro Specific
    heroIntroBadge: "الجيل القادم من التعدين",
    heroIntroTitleMine: "عدّن",
    heroIntroTitleWith: "بقوة",
    heroIntroTitleAbsolute: "مطلقة",
    heroIntroTitlePower: "وكاملة",
    heroIntroSub: "جرب قوة الهاش الصناعية مع أبتس ماينر. كفاءة لا مثيل لها، وقابلية توسع سلسة، وتحكم مطلق.",
    heroIntroShop: "تسوق الآن",
    heroIntroLearn: "أعرف أكثر",

    // Hardware Catalog
    catalogTitle: "كتالوج أجهزة ASIC",
    catalogSubtitle: "نشر أجهزة التعدين عالية الكفاءة المهيأة للمزامنة الفورية مع الشبكة.",
    catalogSpecPerformance: "الأداء",
    catalogSpecPhysical: "البيانات المادية",
    catalogSpecElectrical: "الكهرباء",
    catalogSpecConnectivity: "الاتصال",
    catalogSpecViewDetails: "عرض المواصفات بالتفصيل",
    catalogSpecBuy: "شراء الوحدة",
    catalogSpecAddCart: "إضافة إلى الطلب",

    // Mining Dashboard
    miningTitle: "عمليات التعدين",
    miningSubtitle: "نشاط المجموعة المباشر، ومعدلات الهاش، ومؤشرات أداء الشبكة.",
    miningLiveHashrate: "الهاش المباشر",
    miningPowerDraw: "استهلاك الطاقة",
    miningActiveNodes: "العقد النشطة",
    miningTodayEarnings: "عائد اليوم",
    miningWeeklyYield: "عائد BTC الأسبوعي",
    miningAllSystems: "جميع العقد تعمل بنجاح",

    // Wallet Section
    walletTitle: "أمان الأصول",
    walletSubtitle: "بنية محفظة متعددة الطبقات لحماية الأصول السائلة والخزائن الباردة.",
    walletHot: "محفظة ساخنة",
    walletCold: "خزنة باردة",
    walletTotalPortfolio: "قيمة المحفظة الإجمالية",
    walletAllocation: "توزيع المحفظة",
    walletInstantAccess: "وصول فوري",
    walletMaximumSecurity: "أقصى درجات الأمان",
    walletSecureAccess: "دخول المحفظة",
    walletAuthorized: "مصرح أمنياً",

    // Footer
    footerCtaTitle: "جاهز للتعدين على نطاق واسع؟",
    footerCtaDesc: "اتصل بمتخصصي البنية التحتية لدينا لتهيئة مصفوفة التعدين المخصصة لك اليوم.",
    footerCtaGetStarted: "ابدأ الآن",
    footerCtaBookDemo: "حجز عرض تجريبي للمصفوفة",
    footerStatsSecured: "الأصول المؤمنة",
    footerStatsUptime: "وقت تشغيل المجموعة",
    footerStatsSupport: "دعم المشغلين",
    footerStatsCountries: "الدول المخدومة",
    footerSystemsOperational: "جميع الأنظمة تعمل بكفاءة",
    footerAllRightsReserved: "جميع الحقوق محفوظة.",
  },
  HI: {
    // Navigation
    navProducts: "उत्पाद",
    navServices: "सेवाएं",
    navPrices: "कीमतें",
    navLogin: "लॉग इन",
    navLogout: "लॉग आउट",
    navDashboard: "डैशबोर्ड",
    navOverview: "अवलोकन",
    navTerminal: "टर्मिनल",

    // Hero Section
    heroBadge: "एंटरप्राइज ASIC माइनिंग इंफ्रास्ट्रक्चर",
    heroTitlePart1: "उन्नत माइनिंग",
    heroTitlePart2: "इकोसिस्टम",
    heroSubtitle: "डायमंड-ग्रेड लिक्विडिटी, हाई-परफॉर्मेंस लिक्विड-कूल्ड हैशिंग सर्वर और कॉर्पोरेट माइनर्स के लिए डिज़ाइन की गई स्व-कस्टडी वॉलेट वॉल्ट।",
    heroCtaDeploy: "हार्डवेयर तैनात करें",
    heroCtaTerminal: "टर्मिनल खोलें",
    tickerLiveCluster: "लाइव क्लस्टर प्रदर्शन",

    // Hero Intro Specific
    heroIntroBadge: "माइनिंग की अगली पीढ़ी",
    heroIntroTitleMine: "माइन करें",
    heroIntroTitleWith: "पूर्ण",
    heroIntroTitleAbsolute: "शक्ति",
    heroIntroTitlePower: "के साथ",
    heroIntroSub: "ऐप्समाइनर के साथ औद्योगिक-ग्रेड हैशपावर का अनुभव करें। बेजोड़ दक्षता, सहज स्केलिंग और पूर्ण नियंत्रण।",
    heroIntroShop: "अभी खरीदें",
    heroIntroLearn: "अधिक जानें",

    // Hardware Catalog
    catalogTitle: "ASIC हार्डवेयर कैटलॉग",
    catalogSubtitle: "तत्काल नेटवर्क सिंक्रोनाइज़ेशन के लिए कॉन्फ़िगर किए गए उच्च-दक्षता वाले हैशिंग रिग तैनात करें।",
    catalogSpecPerformance: "प्रदर्शन",
    catalogSpecPhysical: "भौतिक डेटा",
    catalogSpecElectrical: "विद्युत",
    catalogSpecConnectivity: "कनेक्टिविटी",
    catalogSpecViewDetails: "विस्तृत विवरण देखें",
    catalogSpecBuy: "यूनिट खरीदें",
    catalogSpecAddCart: "ऑर्डर में जोड़ें",

    // Mining Dashboard
    miningTitle: "माइनिंग ऑपरेशन्स",
    miningSubtitle: "लाइव क्लस्टर गतिविधि, हैश रेट और नेटवर्क प्रदर्शन संकेतक।",
    miningLiveHashrate: "लाइव हैशरेट",
    miningPowerDraw: "बिजली खपत",
    miningActiveNodes: "सक्रिय नोड्स",
    miningTodayEarnings: "आज की उपज",
    miningWeeklyYield: "साप्ताहिक BTC उपज",
    miningAllSystems: "सभी नोड्स सक्रिय हैं",

    // Wallet Section
    walletTitle: "परिसंपत्ति सुरक्षा",
    walletSubtitle: "तरल संपत्ति और कोल्ड स्टोरेज को सुरक्षित रखने के लिए बहु-स्तरीय वॉलेट आर्किटेक्चर।",
    walletHot: "हॉट वॉलेट",
    walletCold: "कोल्ड स्टोरेज",
    walletTotalPortfolio: "कुल पोर्टफोलियो मूल्य",
    walletAllocation: "पोर्टफोलियो आवंटन",
    walletInstantAccess: "तत्काल पहुंच",
    walletMaximumSecurity: "अधिकतम सुरक्षा",
    walletSecureAccess: "वॉलेट खोलें",
    walletAuthorized: "सुरक्षा स्वीकृत",

    // Footer
    footerCtaTitle: "क्या आप बड़े पैमाने पर माइनिंग के लिए तैयार हैं?",
    footerCtaDesc: "अपने कस्टम माइनिंग ऐरे को कॉन्फ़िगर करने के लिए आज ही हमारे इंफ्रास्ट्रक्चर विशेषज्ञों से संपर्क करें।",
    footerCtaGetStarted: "शुरू करें",
    footerCtaBookDemo: "डेमो बुक करें",
    footerStatsSecured: "सुरक्षित संपत्ति",
    footerStatsUptime: "क्लस्टर अपटाइम",
    footerStatsSupport: "सक्रिय ऑपरेटर सहायता",
    footerStatsCountries: "सेवाकृत देश",
    footerSystemsOperational: "सभी सिस्टम चालू हैं",
    footerAllRightsReserved: "सर्वाधिकार सुरक्षित।",
  },
  DE: {
    // Navigation
    navProducts: "Produkte",
    navServices: "Dienstleistungen",
    navPrices: "Preise",
    navLogin: "Anmelden",
    navLogout: "Abmelden",
    navDashboard: "Dashboard",
    navOverview: "Übersicht",
    navTerminal: "Terminal",

    // Hero Section
    heroBadge: "Enterprise ASIC-Infrastruktur",
    heroTitlePart1: "Hochmodernes",
    heroTitlePart2: "Mining-System",
    heroSubtitle: "Premium-Liquidität, flüssigkeitsgekühlte Hochleistungs-Mining-Server und ultra-sichere Cold-Storage-Tresore für institutionelle Miner.",
    heroCtaDeploy: "Hardware aktivieren",
    heroCtaTerminal: "Terminal öffnen",
    tickerLiveCluster: "Live-Cluster-Performance",

    // Hero Intro Specific
    heroIntroBadge: "Die nächste Mining-Generation",
    heroIntroTitleMine: "Minen Sie",
    heroIntroTitleWith: "mit",
    heroIntroTitleAbsolute: "absoluter",
    heroIntroTitlePower: "Power",
    heroIntroSub: "Erleben Sie Hashing-Power auf Industrieniveau mit AppsMiner. Unübertroffene Effizienz, nahtlose Skalierung und absolute Kontrolle.",
    heroIntroShop: "Jetzt Kaufen",
    heroIntroLearn: "Mehr erfahren",

    // Hardware Catalog
    catalogTitle: "ASIC-Hardware-Katalog",
    catalogSubtitle: "Hocheffiziente Hashing-Systeme, vorkonfiguriert für die sofortige Netzwerksynchronisation.",
    catalogSpecPerformance: "Leistung",
    catalogSpecPhysical: "Physische Daten",
    catalogSpecElectrical: "Elektrisch",
    catalogSpecConnectivity: "Konnektivität",
    catalogSpecViewDetails: "Details anzeigen",
    catalogSpecBuy: "Einheit erwerben",
    catalogSpecAddCart: "Zum Auftrag hinzufügen",

    // Mining Dashboard
    miningTitle: "Mining-Betrieb",
    miningSubtitle: "Live-Cluster-Aktivität, Hash-Raten und Netzwerk-Performance-Indikatoren.",
    miningLiveHashrate: "Live-Hashrate",
    miningPowerDraw: "Stromverbrauch",
    miningActiveNodes: "Aktive Nodes",
    miningTodayEarnings: "Heutiger Ertrag",
    miningWeeklyYield: "Wöchentlicher BTC-Ertrag",
    miningAllSystems: "Alle Nodes betriebsbereit",

    // Wallet Section
    walletTitle: "Asset-Sicherheit",
    walletSubtitle: "Mehrschichtige Wallet-Architektur zum Schutz von liquiden Mitteln und Cold Vaults.",
    walletHot: "Hot Wallet",
    walletCold: "Cold Storage",
    walletTotalPortfolio: "Gesamter Portfoliowert",
    walletAllocation: "Portfolio-Allokation",
    walletInstantAccess: "Sofortiger Zugriff",
    walletMaximumSecurity: "Maximale Sicherheit",
    walletSecureAccess: "Wallet öffnen",
    walletAuthorized: "Sicherheitsprüfung bestanden",

    // Footer
    footerCtaTitle: "Bereit für Großtaten?",
    footerCtaDesc: "Kontaktieren Sie unsere Spezialisten, um noch heute Ihr individuelles Mining-System zu konfigurieren.",
    footerCtaGetStarted: "Jetzt starten",
    footerCtaBookDemo: "System-Demo buchen",
    footerStatsSecured: "Gesicherte Assets",
    footerStatsUptime: "Cluster-Uptime",
    footerStatsSupport: "Operator-Support",
    footerStatsCountries: "Bediente Länder",
    footerSystemsOperational: "Alle Systeme betriebsbereit",
    footerAllRightsReserved: "Alle Rechte vorbehalten.",
  },
  FR: {
    // Navigation
    navProducts: "Produits",
    navServices: "Services",
    navPrices: "Tarifs",
    navLogin: "Connexion",
    navLogout: "Déconnexion",
    navDashboard: "Tableau de bord",
    navOverview: "Vue d'ensemble",
    navTerminal: "Console",

    // Hero Section
    heroBadge: "Infrastructure ASIC d'Entreprise",
    heroTitlePart1: "Écosystème de",
    heroTitlePart2: "Minage Avancé",
    heroSubtitle: "Liquidité de niveau diamant, serveurs de hachage haute performance refroidis par liquide, et coffres-forts de stockage à froid autonomes conçus pour les mineurs institutionnels.",
    heroCtaDeploy: "Déployer le Matériel",
    heroCtaTerminal: "Accéder au Terminal",
    tickerLiveCluster: "Performance du Cluster en Direct",

    // Hero Intro Specific
    heroIntroBadge: "La Nouvelle Génération du Minage",
    heroIntroTitleMine: "Minez",
    heroIntroTitleWith: "avec une",
    heroIntroTitleAbsolute: "Puissance",
    heroIntroTitlePower: "Absolue",
    heroIntroSub: "Faites l'expérience d'une puissance de hachage de niveau industriel avec AppsMiner. Une efficacité inégalée, une mise à l'échelle transparente et un contrôle absolu.",
    heroIntroShop: "Acheter",
    heroIntroLearn: "En savoir plus",

    // Hardware Catalog
    catalogTitle: "Catalogue Matériel ASIC",
    catalogSubtitle: "Déployez des rigs de hachage à haute efficacité configurés pour une synchronisation immédiate avec le réseau.",
    catalogSpecPerformance: "Performance",
    catalogSpecPhysical: "Données Physiques",
    catalogSpecElectrical: "Électricité",
    catalogSpecConnectivity: "Connectivité",
    catalogSpecViewDetails: "Voir les Spécifications",
    catalogSpecBuy: "Acheter l'Unité",
    catalogSpecAddCart: "Ajouter à la Commande",

    // Mining Dashboard
    miningTitle: "Opérations de Minage",
    miningSubtitle: "Activité en direct du cluster, taux de hachage et indicateurs de performance du réseau.",
    miningLiveHashrate: "Hashrate en Direct",
    miningPowerDraw: "Consommation",
    miningActiveNodes: "Nœuds Actifs",
    miningTodayEarnings: "Rendement du Jour",
    miningWeeklyYield: "Rendement BTC Hebdo",
    miningAllSystems: "Tous les Nœuds Opérationnels",

    // Wallet Section
    walletTitle: "Sécurité des Actifs",
    walletSubtitle: "Architecture de portefeuille multicouche pour sécuriser les actifs liquides et les coffres froids.",
    walletHot: "Hot Wallet",
    walletCold: "Stockage à Froid",
    walletTotalPortfolio: "Valeur Totale",
    walletAllocation: "Allocation du Portefeuille",
    walletInstantAccess: "Accès Instantané",
    walletMaximumSecurity: "Sécurité Maximale",
    walletSecureAccess: "Ouvrir le Portefeuille",
    walletAuthorized: "Sécurité Validée",

    // Footer
    footerCtaTitle: "Prêt à miner à grande échelle ?",
    footerCtaDesc: "Contactez nos spécialistes en infrastructure pour configurer votre parc de minage personnalisé dès aujourd'hui.",
    footerCtaGetStarted: "Démarrer",
    footerCtaBookDemo: "Réserver une Démo",
    footerStatsSecured: "Actifs Sécurisés",
    footerStatsUptime: "Disponibilité Cluster",
    footerStatsSupport: "Support Opérateur",
    footerStatsCountries: "Pays Desservis",
    footerSystemsOperational: "Tous les systèmes opérationnels",
    footerAllRightsReserved: "Tous droits réservés.",
  },
  ES: {
    // Navigation
    navProducts: "Productos",
    navServices: "Servicios",
    navPrices: "Precios",
    navLogin: "Iniciar Sesión",
    navLogout: "Cerrar Sesión",
    navDashboard: "Panel",
    navOverview: "Resumen",
    navTerminal: "Terminal",

    // Hero Section
    heroBadge: "Infraestructura ASIC Empresarial",
    heroTitlePart1: "Ecosistema de",
    heroTitlePart2: "Minería Avanzado",
    heroSubtitle: "Liquidez de grado diamante, servidores de minería de alto rendimiento refrigerados por líquido y bóvedas de almacenamiento en frío autónomas diseñadas para mineros institucionales.",
    heroCtaDeploy: "Desplegar Equipos",
    heroCtaTerminal: "Acceder a la Terminal",
    tickerLiveCluster: "Rendimiento del Clúster en Vivo",

    // Hero Intro Specific
    heroIntroBadge: "La Próxima Generación de Minería",
    heroIntroTitleMine: "Mine",
    heroIntroTitleWith: "con",
    heroIntroTitleAbsolute: "Poder",
    heroIntroTitlePower: "Absoluto",
    heroIntroSub: "Experimente el poder de hash de grado industrial con AppsMiner. Eficiencia inigualable, escalabilidad sin problemas y control absoluto.",
    heroIntroShop: "Comprar Ahora",
    heroIntroLearn: "Saber Más",

    // Hardware Catalog
    catalogTitle: "Catálogo de Hardware ASIC",
    catalogSubtitle: "Despliegue equipos de minería de alta eficiencia configurados para la sincronización inmediata con la red.",
    catalogSpecPerformance: "Rendimiento",
    catalogSpecPhysical: "Datos Físicos",
    catalogSpecElectrical: "Eléctrico",
    catalogSpecConnectivity: "Conectividad",
    catalogSpecViewDetails: "Ver Especificaciones",
    catalogSpecBuy: "Adquirir Unidad",
    catalogSpecAddCart: "Añadir al Pedido",

    // Mining Dashboard
    miningTitle: "Operaciones de Minería",
    miningSubtitle: "Actividad del clúster en vivo, tasas de hash y rendimiento de la red.",
    miningLiveHashrate: "Tasa de Hash en Vivo",
    miningPowerDraw: "Consumo Eléctrico",
    miningActiveNodes: "Nodos Activos",
    miningTodayEarnings: "Rendimiento Diario",
    miningWeeklyYield: "Rendimiento Semanal",
    miningAllSystems: "Todos los Nodos Operativos",

    // Wallet Section
    walletTitle: "Seguridad de Activos",
    walletSubtitle: "Arquitectura de billetera multicapa para proteger fondos líquidos y bóvedas frías.",
    walletHot: "Billetera Caliente",
    walletCold: "Bóveda Fría",
    walletTotalPortfolio: "Valor Total",
    walletAllocation: "Asignación del Portafolio",
    walletInstantAccess: "Acceso Instantáneo",
    walletMaximumSecurity: "Máxima Seguridad",
    walletSecureAccess: "Acceder a Billetera",
    walletAuthorized: "Seguridad Autorizada",

    // Footer
    footerCtaTitle: "¿Listo para minar a gran escala?",
    footerCtaDesc: "Póngase en contacto con nuestros especialistas en infraestructura para configurar su sistema de minería hoy.",
    footerCtaGetStarted: "Comenzar",
    footerCtaBookDemo: "Reservar Demo",
    footerStatsSecured: "Activos Asegurados",
    footerStatsUptime: "Disponibilidad de Clúster",
    footerStatsSupport: "Soporte Técnico 24/7",
    footerStatsCountries: "Países Atendidos",
    footerSystemsOperational: "Todos los Sistemas Operativos",
    footerAllRightsReserved: "Todos los derechos reservados.",
  },
  BN: {
    // Navigation
    navProducts: "পণ্যসমূহ",
    navServices: "সেবাসমূহ",
    navPrices: "মূল্য তালিকা",
    navLogin: "লগ ইন",
    navLogout: "লগ আউট",
    navDashboard: "ড্যাশবোর্ড",
    navOverview: "সংক্ষিপ্ত বিবরণ",
    navTerminal: "টার্মিনাল",

    // Hero Section
    heroBadge: "এন্টারপ্রাইজ ASIC মাইনিং পরিকাঠামো",
    heroTitlePart1: "উন্নত মাইনিং",
    heroTitlePart2: "ইকোসিস্টেম",
    heroSubtitle: "ডায়মন্ড-গ্রেড লিকুইডিটি, উচ্চ ক্ষমতাসম্পন্ন লিকুইড-কুলড হ্যাশিং সার্ভার এবং প্রাতিষ্ঠানিক মাইনারদের জন্য ডিজাইন করা স্ব-কাস্টডি ওয়ালেট ভল্ট।",
    heroCtaDeploy: "হার্ডওয়্যার স্থাপন করুন",
    heroCtaTerminal: "টার্মিনাল এক্সেস",
    tickerLiveCluster: "লাইভ ক্লাস্টার পারফরম্যান্স",

    // Hero Intro Specific
    heroIntroBadge: "মাইনিংয়ের পরবর্তী প্রজন্ম",
    heroIntroTitleMine: "মাইনিং করুন",
    heroIntroTitleWith: "পূর্ণ",
    heroIntroTitleAbsolute: "ক্ষমতার",
    heroIntroTitlePower: "সাথে",
    heroIntroSub: "অ্যাপ্সমাইনারের সাথে শিল্প-মানের হ্যাশপাওয়ারের অভিজ্ঞতা নিন। অতুলনীয় দক্ষতা, নিরবচ্ছিন্ন স্কেলিং এবং নিখুঁত নিয়ন্ত্রণ।",
    heroIntroShop: "কিনুন",
    heroIntroLearn: "আরও জানুন",

    // Hardware Catalog
    catalogTitle: "ASIC হার্ডওয়্যার ক্যাটালগ",
    catalogSubtitle: "তাত্ক্ষণিক নেটওয়ার্ক সিঙ্ক্রোনাইজেশনের জন্য কনফিগার করা উচ্চ-দক্ষতার হ্যাশিং রিগগুলি স্থাপন করুন।",
    catalogSpecPerformance: "কর্মক্ষমতা",
    catalogSpecPhysical: "শারীরিক গঠন ও ওজন",
    catalogSpecElectrical: "বৈদ্যুতিক তথ্য",
    catalogSpecConnectivity: "সংযোগ ব্যবস্থা",
    catalogSpecViewDetails: "বিস্তারিত স্পেসিফিকেশন দেখুন",
    catalogSpecBuy: "ইউনিট কিনুন",
    catalogSpecAddCart: "অর্ডারে যুক্ত করুন",

    // Mining Dashboard
    miningTitle: "মাইনিং কার্যক্রম",
    miningSubtitle: "লাইভ ক্লাস্টার অ্যাক্টিভিটি, হ্যাশ রেট এবং নেটওয়ার্ক পারফরম্যান্স ইন্ডিকেটরসমূহ।",
    miningLiveHashrate: "লাইভ হ্যাশরেট",
    miningPowerDraw: "বিদ্যুৎ খরচ",
    miningActiveNodes: "সক্রিয় নোডসমূহ",
    miningTodayEarnings: "আজকের মোট আয়",
    miningWeeklyYield: "সাপ্তাহিক BTC লাভ",
    miningAllSystems: "সব নোড সচল রয়েছে",

    // Wallet Section
    walletTitle: "সম্পদ নিরাপত্তা",
    walletSubtitle: "লিকুইড ফান্ড এবং কোল্ড ভল্ট সুরক্ষিত রাখার জন্য বহু-স্তরের ওয়ালেট আর্কিটেকচার।",
    walletHot: "হট ওয়ালেট",
    walletCold: "কোল্ড স্টোরেজ",
    walletTotalPortfolio: "মোট পোর্টফোলিও মূল্য",
    walletAllocation: "পোর্টফোলিও বন্টন",
    walletInstantAccess: "তাত্ক্ষণিক এক্সেস",
    walletMaximumSecurity: "সর্বোচ্চ নিরাপত্তা",
    walletSecureAccess: "ওয়ালেট এক্সেস",
    walletAuthorized: "নিরাপত্তা ছাড়পত্রপ্রাপ্ত",

    // Footer
    footerCtaTitle: "আপনি কি বড় আকারে মাইনিং করতে প্রস্তুত?",
    footerCtaDesc: "আপনার কাস্টম মাইনিং অ্যারে কনফিগার করতে আজই আমাদের ইনফ্রাস্ট্রাকচার বিশেষজ্ঞদের সাথে যোগাযোগ করুন।",
    footerCtaGetStarted: "শুরু করুন",
    footerCtaBookDemo: "ডিমো বুক করুন",
    footerStatsSecured: "সুরক্ষিত সম্পদ",
    footerStatsUptime: "ক্লাস্টার আপটাইম",
    footerStatsSupport: "অপারেটর সহায়তা",
    footerStatsCountries: "সেবাপ্রাপ্ত দেশসমূহ",
    footerSystemsOperational: "সব সিস্টেম সচল রয়েছে",
    footerAllRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLangCode, setCurrentLangCode] = useState<LanguageCode>("EN");

  // Load language from localStorage on client render
  useEffect(() => {
    const stored = localStorage.getItem("appminer_lang") as LanguageCode;
    if (stored && translations[stored]) {
      setCurrentLangCode(stored);
    } else {
      // Check browser locale defaults
      const browserLang = navigator.language.slice(0, 2).toUpperCase();
      if (browserLang === "AR") setCurrentLangCode("AR");
      else if (browserLang === "HI") setCurrentLangCode("HI");
      else if (browserLang === "DE") setCurrentLangCode("DE");
      else if (browserLang === "FR") setCurrentLangCode("FR");
      else if (browserLang === "ES") setCurrentLangCode("ES");
      else if (browserLang === "BN") setCurrentLangCode("BN");
    }
  }, []);

  const language = LANGUAGES.find((l) => l.code === currentLangCode) || LANGUAGES[0];

  const setLanguage = (code: LanguageCode) => {
    if (translations[code]) {
      setCurrentLangCode(code);
      localStorage.setItem("appminer_lang", code);
      // Sync document direction
      const dir = code === "AR" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = code.toLowerCase();
    }
  };

  // On initial mount or language switch, update DOM attributes
  useEffect(() => {
    const dir = currentLangCode === "AR" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLangCode.toLowerCase();
  }, [currentLangCode]);

  const t = (key: TranslationKey): string => {
    return translations[currentLangCode]?.[key] || translations.EN[key] || String(key);
  };

  const isRtl = currentLangCode === "AR";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
