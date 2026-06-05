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
    heroIntroSub: "Experience industrial-grade hashpower with AppsMiners. Unmatched efficiency, seamless scaling, and absolute control.",
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

    // Features
    featuresUptime: "Uptime Rate",
    featuresSupport: "Expert Support",
    featuresPoolFees: "Pool Fees",
    featuresProtocol: "Node Protocol",

    // Crypto Services
    servicesHeading: "Financial Infrastructure",
    servicesTitle1: "Institutional",
    servicesTitle2: "Trading & Storage",
    servicesDesc: "Beyond mining, AppsMiners offers an enterprise-grade crypto trading house and hybrid hot/cold wallet service.",
    servicesTradingHouseTitle: "Crypto Trading House",
    servicesTradingHouseDesc: "Execute high-volume trades with zero slippage. Our matching engine handles millions of transactions per second, providing diamond-grade liquidity.",
    servicesTradingHouseFeat1: "0.05% Maker/Taker Fees",
    servicesTradingHouseFeat2: "Direct Mining Pool Integration",
    servicesTradingHouseFeat3: "API Access for Quants",
    servicesTradingHouseCta: "Enter Exchange",
    servicesWalletTitle: "Hybrid Wallet Services",
    servicesWalletDesc: "The ultimate balance of accessibility and security. Keep operating funds in our Multi-Sig Hot Wallets while your bulk assets are air-gapped in deep Cold Storage vaults.",
    servicesWalletFeat1: "$150M Insurance Policy",
    servicesWalletFeat2: "Geographically Distributed Nodes",
    servicesWalletFeat3: "Instant Hot-to-Cold Sweeps",
    servicesWalletCta: "Open Vault",

    // Hero Section Captions
    heroSecTitle1: "Precision Engineering",
    heroSecDesc1: "Every component machined to sub-millimeter tolerances for peak thermal performance.",
    heroSecTitle2: "Quantum Hashrate",
    heroSecDesc2: "Proprietary ASICs delivering up to 200 TH/s at industry-leading 15 J/TH efficiency.",
    heroSecTitle3: "Immutable Architecture",
    heroSecDesc3: "Direct cold-storage integration keeps your mined assets air-gapped from the moment they're earned.",

    // Asic Research
    researchTitle: "Silicon Research Lab",
    researchHeading: "Silicon Innovation",
    researchSub: "Pushing the boundaries of thermodynamic hashing efficiency on a custom 5nm TSMC process node.",
    researchParagraph1: "Through direct collaboration with global semiconductor foundries, AppsMiners custom designs ASIC chip microarchitectures specifically optimized for SHA-256 logic gates. By pruning non-essential instruction sets at the hardware layout level, we achieve up to 40% higher efficiency than off-the-shelf mining hardware.",
    researchParagraph2: "Our current research focus lies in liquid-cooled multi-die modules that dissipate heat directly through synthetic dielectric fluid loops. This engineering breakthrough allows custom silicon dies to run at peak speeds with zero thermal throttling, extending the overall hardware lifetime to over 5 years.",

    // Login Page
    authAccessSecured: "ACCESS SECURED",
    authEnterCredentials: "Enter your credentials to access the dashboard.",
    authEmailLabel: "Email Address",
    authPasswordLabel: "Password",
    authForgot: "Forgot?",
    authSignIn: "Authenticate",
    authSignUp: "Create Account",
    authNoAccount: "No account?",
    authApplyAccess: "Apply for Access",
    authBackToHome: "Back to Home",
    authInvalidCredentials: "Invalid email or password.",
    authSignUpSuccess: "Account created! You can now log in.",
    authSignUpError: "Error creating account. Please try again.",

    // Dashboard
    dashTerminalOverview: "Operator Terminal Overview",
    dashMiningProgress: "Mining Progress",
    dashWalletStatus: "Wallet Status",
    dashSettings: "Terminal Settings",
    dashSecuredTerminal: "Secured Terminal",
    dashAggregateHashrate: "Aggregate Hashrate",
    dashWalletValue: "Wallet Vault Value",
    dashActiveClusters: "Active Node Clusters",
    dashManageNodes: "Manage Mining Nodes",
    dashAccessVaults: "Access Secure Wallets",
    dashLogOut: "Log Out",
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

    // Features
    featuresUptime: "معدل وقت التشغيل",
    featuresSupport: "دعم الخبراء",
    featuresPoolFees: "رسوم التعدين 0%",
    featuresProtocol: "بروتوكول العقدة",

    // Crypto Services
    servicesHeading: "البنية التحتية المالية",
    servicesTitle1: "التداول والحفظ",
    servicesTitle2: "للمؤسسات والشركات",
    servicesDesc: "بجانب التعدين، تقدم أبتس ماينر منصة تداول عملات رقمية للمؤسسات ومحفظة ساخنة/باردة هجينة.",
    servicesTradingHouseTitle: "بيت تداول العملات الرقمية",
    servicesTradingHouseDesc: "نفذ صفقات ضخمة بدون انزلاق سعري. يتعامل محرك المطابقة لدينا مع ملايين المعاملات في الثانية مع سيولة ممتازة.",
    servicesTradingHouseFeat1: "رسوم صانع/آخذ 0.05%",
    servicesTradingHouseFeat2: "تكامل مباشر مع مجمع التعدين",
    servicesTradingHouseFeat3: "وصول API للمتداولين الكميين",
    servicesTradingHouseCta: "دخول المنصة",
    servicesWalletTitle: "خدمات المحافظ الهجينة",
    servicesWalletDesc: "التوازن المطلق بين سهولة الوصول والأمان. احتفظ بأموال التشغيل في محافظنا الساخنة متعددة التوقيعات بينما تكون أصولك الكبيرة في مخازن باردة آمنة تماماً.",
    servicesWalletFeat1: "بوليصة تأمين بقيمة 150 مليون دولار",
    servicesWalletFeat2: "عقد موزعة جغرافياً",
    servicesWalletFeat3: "سحب تلقائي فوري من الساخن إلى البارد",
    servicesWalletCta: "افتح الخزنة",

    // Hero Section Captions
    heroSecTitle1: "الهندسة الدقيقة",
    heroSecDesc1: "كل مكون تم تصنيعه بدقة أجزاء من المليمتر للحصول على أعلى أداء حراري.",
    heroSecTitle2: "معدل هاش الكمومية",
    heroSecDesc2: "رقاقات ASIC مخصصة تقدم ما يصل إلى 200 TH/s بكفاءة طاقة رائدة تبلغ 15 J/TH.",
    heroSecTitle3: "بنية غير قابلة للتغيير",
    heroSecDesc3: "يحافظ تكامل التخزين البارد المباشر على أصولك المعدنة معزولة تماماً عن الإنترنت من لحظة كسبها.",

    // Asic Research
    researchTitle: "مختبر أبحاث السيليكون",
    researchHeading: "ابتكار السيليكون",
    researchSub: "دفع حدود كفاءة التجزئة الحرارية على عقدة عملية 5nm TSMC مخصصة.",
    researchParagraph1: "من خلال التعاون المباشر مع مصانع أشباه الموصلات العالمية، تقوم AppsMiners بتصميم هياكل رقاقات ASIC الدقيقة المخصصة خصيصًا لبوابات منطق SHA-256. ومن خلال إزالة مجموعات التعليمات غير الأساسية، نحقق كفاءة أعلى بنسبة تصل إلى 40% مقارنة بأجهزة التعدين العادية.",
    researchParagraph2: "ينصب تركيزنا البحثي الحالي على الوحدات متعددة القوالب المبردة بالسوائل والتي تبدد الحرارة مباشرة من خلال حلقات السوائل الاصطناعية. يتيح ذلك تشغيل الرقاقات بأقصى سرعات دون اختناق حراري، مما يطيل عمر الأجهزة لأكثر من 5 سنوات.",

    // Login Page
    authAccessSecured: "تأمين الدخول للمحطة",
    authEnterCredentials: "أدخل بيانات الاعتماد للوصول إلى لوحة التحكم.",
    authEmailLabel: "البريد الإلكتروني",
    authPasswordLabel: "كلمة المرور",
    authForgot: "نسيت كلمة المرور؟",
    authSignIn: "تسجيل الدخول",
    authSignUp: "إنشاء حساب جديد",
    authNoAccount: "ليس لديك حساب؟",
    authApplyAccess: "طلب صلاحية الدخول",
    authBackToHome: "العودة للرئيسية",
    authInvalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صالحة.",
    authSignUpSuccess: "تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.",
    authSignUpError: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة لاحقاً.",

    // Dashboard
    dashTerminalOverview: "لوحة تحكم المشغل الرئيسية",
    dashMiningProgress: "حالة عمليات التعدين",
    dashWalletStatus: "حالة المحفظة والأصول",
    dashSettings: "إعدادات المحطة الطرفية",
    dashSecuredTerminal: "المحطة المؤمنة",
    dashAggregateHashrate: "إجمالي معدل الهاش",
    dashWalletValue: "إجمالي قيمة الخزائن",
    dashActiveClusters: "مجموعات العقد النشطة",
    dashManageNodes: "إدارة عقد التعدين",
    dashAccessVaults: "الوصول للمحافظ المؤمنة",
    dashLogOut: "تسجيل الخروج",
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

    // Features
    featuresUptime: "अपटाइम दर",
    featuresSupport: "विशेषज्ञ सहायता",
    featuresPoolFees: "पूल शुल्क 0%",
    featuresProtocol: "नोड प्रोटोकॉल",

    // Crypto Services
    servicesHeading: "वित्तीय बुनियादी ढांचा",
    servicesTitle1: "संस्थागत",
    servicesTitle2: "ट्रेडिंग और स्टोरेज",
    servicesDesc: "माइनिंग के अलावा, ऐप्स माइनर एक एंटरप्राइज-ग्रेड क्रिप्टो ट्रेडिंग हाउस और हाइब्रिड हॉट/कोल्ड वॉलेट सेवा प्रदान करता है।",
    servicesTradingHouseTitle: "क्रिप्टो ट्रेडिंग हाउस",
    servicesTradingHouseDesc: "बिना किसी स्लिपेज के बड़े आकार के ट्रेड निष्पादित करें। हमारा मैचिंग इंजन प्रति सेकंड लाखों लेनदेन संभालता है, जिससे प्रीमियम तरलता मिलती है।",
    servicesTradingHouseFeat1: "0.05% मेकर/टेकर शुल्क",
    servicesTradingHouseFeat2: "सीधा माइनिंग पूल एकीकरण",
    servicesTradingHouseFeat3: "क्वांट्स के लिए एपीआई एक्सेस",
    servicesTradingHouseCta: "एक्सचेंज में प्रवेश करें",
    servicesWalletTitle: "हाइब्रिड वॉलेट सेवाएं",
    servicesWalletDesc: "पहुंच और सुरक्षा का अंतिम संतुलन। ऑपरेटिंग फंड हमारे मल्टी-सिग हॉट वॉलेट में रखें जबकि आपकी बड़ी संपत्ति सुरक्षित कोल्ड स्टोरेज वॉल्ट में ऑफ़लाइन रहे।",
    servicesWalletFeat1: "$150 मिलियन बीमा पॉलिसी",
    servicesWalletFeat2: "भौगोलिक रूप से वितरित नोड्स",
    servicesWalletFeat3: "त्वरित हॉट-टू-कोल्ड स्वीप",
    servicesWalletCta: "वॉल्ट खोलें",

    // Hero Section Captions
    heroSecTitle1: "सटीक इंजीनियरिंग",
    heroSecDesc1: "शीर्ष थर्मल प्रदर्शन के लिए हर घटक को सब-मिलीमीटर सहनशीलता के साथ तैयार किया गया है।",
    heroSecTitle2: "क्वांटम हैशरेट",
    heroSecDesc2: "उद्योग-अग्रणी 15 J/TH दक्षता पर 200 TH/s तक प्रदान करने वाले मालिकाना ASICs।",
    heroSecTitle3: "अपरिवर्तनीय वास्तुकला",
    heroSecDesc3: "सीधा कोल्ड-स्टोरेज एकीकरण आपकी अर्जित संपत्तियों को उसी क्षण से सुरक्षित ऑफ़लाइन रखता है जब वे अर्जित की जाती हैं।",

    // Asic Research
    researchTitle: "सिलिकॉन अनुसंधान प्रयोगशाला",
    researchHeading: "सिलिकॉन नवाचार",
    researchSub: "कस्टम 5nm TSMC प्रोसेस नोड पर थर्मोडायनामिक हैशिंग दक्षता की सीमाओं को आगे बढ़ाना।",
    researchParagraph1: "वैश्विक सेमीकंडक्टर फाउंड्री के साथ सीधे सहयोग के माध्यम से, AppsMiners विशेष रूप से SHA-256 लॉजिक गेट्स के लिए अनुकूलित ASIC चिप माइक्रोआर्किटेक्चर को कस्टम डिज़ाइन करता है। हार्डवेयर लेआउट स्तर पर गैर-आवश्यक निर्देश सेटों को हटाकर, हम सामान्य हार्डवेयर की तुलना में 40% तक अधिक दक्षता प्राप्त करते हैं।",
    researchParagraph2: "हमारा वर्तमान अनुसंधान फोकस लिक्विड-कूल्ड मल्टी-डाई मॉड्यूल पर है जो सीधे सिंथेटिक डाइइलेक्ट्रिक लिक्विड लूप के माध्यम से गर्मी को फैलाते हैं। यह इंजीनियरिंग सफलता कस्टम सिलिकॉन डाई को बिना थर्मल थ्रॉटलिंग के चरम गति पर चलाने की अनुमति देती है, जिससे हार्डवेयर का जीवन 5 वर्ष से अधिक हो जाता है।",

    // Login Page
    authAccessSecured: "सुरक्षित पहुंच प्राप्त करें",
    authEnterCredentials: "डैशबोर्ड तक पहुंचने के लिए अपने क्रेडेंशियल दर्ज करें।",
    authEmailLabel: "ईमेल पता",
    authPasswordLabel: "पासवर्ड",
    authForgot: "भूल गए?",
    authSignIn: "प्रमाणित करें",
    authSignUp: "खाता बनाएं",
    authNoAccount: "खाता नहीं है?",
    authApplyAccess: "पहुंच के लिए आवेदन करें",
    authBackToHome: "होम पर वापस जाएं",
    authInvalidCredentials: "अमान्य ईमेल या पासवर्ड।",
    authSignUpSuccess: "खाता सफलतापूर्वक बन गया! अब आप लॉग इन कर सकते हैं।",
    authSignUpError: "खाता बनाने में त्रुटि। कृपया पुनः प्रयास करें।",

    // Dashboard
    dashTerminalOverview: "ऑपरेटर टर्मिनल अवलोकन",
    dashMiningProgress: "माइनिंग प्रगति",
    dashWalletStatus: "वॉलेट स्थिति",
    dashSettings: "टर्मिनल सेटिंग्स",
    dashSecuredTerminal: "सुरक्षित टर्मिनल",
    dashAggregateHashrate: "कुल हैशरेट",
    dashWalletValue: "वॉलेट वॉल्ट मूल्य",
    dashActiveClusters: "सक्रिय नोड क्लस्टर",
    dashManageNodes: "माइनिंग नोड्स प्रबंधित करें",
    dashAccessVaults: "सुरक्षित वॉलेट तक पहुंचें",
    dashLogOut: "लॉग आउट",
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
    heroIntroSub: "Erleben Sie Hashing-Power auf Industrieniveau mit AppsMiners. Unübertroffene Effizienz, nahtlose Skalierung und absolute Kontrolle.",
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

    // Features
    featuresUptime: "Uptime-Rate",
    featuresSupport: "Experten-Support",
    featuresPoolFees: "Pool-Gebühren 0%",
    featuresProtocol: "Node-Protokoll",

    // Crypto Services
    servicesHeading: "Finanzielle Infrastruktur",
    servicesTitle1: "Institutioneller",
    servicesTitle2: "Handel & Aufbewahrung",
    servicesDesc: "Neben Mining bietet AppsMiners eine Krypto-Handelsplattform der Enterprise-Klasse und hybride Wallet-Dienste.",
    servicesTradingHouseTitle: "Krypto-Handelshaus",
    servicesTradingHouseDesc: "Führen Sie Großaufträge ohne Slippage aus. Unsere Matching-Engine verarbeitet Millionen Transaktionen pro Sekunde mit exzellenter Liquidität.",
    servicesTradingHouseFeat1: "0,05% Maker/Taker-Gebühren",
    servicesTradingHouseFeat2: "Direkte Mining-Pool-Integration",
    servicesTradingHouseFeat3: "API-Zugang für Quants",
    servicesTradingHouseCta: "Börse betreten",
    servicesWalletTitle: "Hybride Wallet-Dienste",
    servicesWalletDesc: "Die ultimative Balance aus Zugänglichkeit und Sicherheit. Halten Sie Betriebsmittel in unseren Multi-Sig Hot Wallets, während Ihr Hauptvermögen offline in Cold Vaults gesichert ist.",
    servicesWalletFeat1: "$150 Mio. Versicherungspolice",
    servicesWalletFeat2: "Geografisch verteilte Nodes",
    servicesWalletFeat3: "Sofortige Hot-to-Cold Transfers",
    servicesWalletCta: "Tresor öffnen",

    // Hero Section Captions
    heroSecTitle1: "Präzisionstechnik",
    heroSecDesc1: "Jedes Bauteil ist auf Submillimeter-Toleranzen für maximale thermische Effizienz optimiert.",
    heroSecTitle2: "Quanten-Hashrate",
    heroSecDesc2: "Eigene ASICs mit bis zu 200 TH/s bei einer branchenführenden Effizienz von 15 J/TH.",
    heroSecTitle3: "Unveränderliche Architektur",
    heroSecDesc3: "Durch die direkte Cold-Storage-Integration werden Ihre Hashing-Erträge sofort offline gesichert.",

    // Asic Research
    researchTitle: "Silizium-Forschungslabor",
    researchHeading: "Silizium-Innovation",
    researchSub: "Maximierung der thermodynamischen Hashing-Effizienz auf einem kundenspezifischen 5nm-TSMC-Prozessknoten.",
    researchParagraph1: "In direkter Zusammenarbeit mit globalen Halbleiter-Foundries entwirft AppsMiners maßgeschneiderte ASIC-Mikroarchitekturen, die speziell für SHA-256-Logikgatter optimiert sind. Durch das Entfernen unnötiger Befehlssätze auf Hardware-Ebene erzielen wir eine bis zu 40% höhere Effizienz als Standard-Hardware.",
    researchParagraph2: "Unser aktueller Forschungsschwerpunkt liegt auf flüssigkeitsgekühlten Multi-Die-Modulen, die Wärme direkt über synthetische Flüssigkeitskreisläufe ableiten. Dadurch können die Silizium-Dies ohne thermische Drosselung auf Höchstgeschwindigkeit laufen, was die Lebensdauer auf über 5 Jahre verlängert.",

    // Login Page
    authAccessSecured: "ZUGANG GESICHERT",
    authEnterCredentials: "Geben Sie Ihre Zugangsdaten ein, um auf das Terminal zuzugreifen.",
    authEmailLabel: "E-Mail-Adresse",
    authPasswordLabel: "Passwort",
    authForgot: "Vergessen?",
    authSignIn: "Anmelden",
    authSignUp: "Konto erstellen",
    authNoAccount: "Kein Konto?",
    authApplyAccess: "Zugang beantragen",
    authBackToHome: "Zurück zur Startseite",
    authInvalidCredentials: "Ungültige E-Mail-Adresse oder Passwort.",
    authSignUpSuccess: "Konto erstellt! Sie können sich jetzt anmelden.",
    authSignUpError: "Fehler beim Erstellen des Kontos. Bitte versuchen Sie es erneut.",

    // Dashboard
    dashTerminalOverview: "Operator-Terminal Übersicht",
    dashMiningProgress: "Mining-Fortschritt",
    dashWalletStatus: "Wallet-Status",
    dashSettings: "Terminal-Einstellungen",
    dashSecuredTerminal: "Gesichertes Terminal",
    dashAggregateHashrate: "Gesamt-Hashrate",
    dashWalletValue: "Wallet-Vault Wert",
    dashActiveClusters: "Aktive Node-Cluster",
    dashManageNodes: "Mining-Nodes verwalten",
    dashAccessVaults: "Sichere Wallets öffnen",
    dashLogOut: "Abmelden",
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
    heroIntroSub: "Faites l'expérience d'une puissance de hachage de niveau industriel avec AppsMiners. Une efficacité inégalée, une mise à l'échelle transparente et un contrôle absolu.",
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

    // Features
    featuresUptime: "Taux de Disponibilité",
    featuresSupport: "Support d'Experts",
    featuresPoolFees: "0% Frais de Pool",
    featuresProtocol: "Protocole de Nœud",

    // Crypto Services
    servicesHeading: "Infrastructure Financière",
    servicesTitle1: "Trading & Stockage",
    servicesTitle2: "Institutionnel",
    servicesDesc: "Au-delà du minage, AppsMiners propose une plateforme de trading crypto de niveau entreprise et un service de portefeuille hybride chaud/froid.",
    servicesTradingHouseTitle: "Maison de Trading Crypto",
    servicesTradingHouseDesc: "Exécutez des transactions à gros volumes sans glissement. Notre moteur d'appariement gère des millions de transactions par seconde, offrant une liquidité de premier ordre.",
    servicesTradingHouseFeat1: "0,05% Frais Maker/Taker",
    servicesTradingHouseFeat2: "Intégration Directe Pool de Minage",
    servicesTradingHouseFeat3: "Accès API pour les Quants",
    servicesTradingHouseCta: "Accéder à l'Échange",
    servicesWalletTitle: "Services Portefeuilles Hybrides",
    servicesWalletDesc: "L'équilibre parfait entre accessibilité et sécurité. Conservez vos fonds opérationnels sur nos portefeuilles chauds Multi-Sig, tandis que vos actifs principaux sont stockés hors ligne dans des coffres-forts froids.",
    servicesWalletFeat1: "Police d'Assurance de 150 M$",
    servicesWalletFeat2: "Nœuds Distribués Géographiquement",
    servicesWalletFeat3: "Balayage Instantané Chaud vers Froid",
    servicesWalletCta: "Ouvrir le Coffre",

    // Hero Section Captions
    heroSecTitle1: "Ingénierie de Précision",
    heroSecDesc1: "Chaque composant est usiné avec des tolérances submillimétriques pour des performances thermiques optimales.",
    heroSecTitle2: "Hashrate Quantique",
    heroSecDesc2: "ASIC propriétaires offrant jusqu'à 200 TH/s avec une efficacité record de 15 J/TH.",
    heroSecTitle3: "Architecture Immuable",
    heroSecDesc3: "L'intégration directe au stockage à froid garde vos actifs minés hors ligne dès qu'ils sont générés.",

    // Asic Research
    researchTitle: "Laboratoire de Recherche Silicium",
    researchHeading: "Silicon Innovation",
    researchSub: "Repousser les limites de l'efficacité thermodynamique du hachage sur un nœud de gravure personnalisé de 5nm par TSMC.",
    researchParagraph1: "Grâce à une collaboration directe avec les fonderies mondiales de semi-conducteurs, AppsMiners conçoit des microarchitectures de puces ASIC optimisées spécifiquement pour les portes logiques SHA-256. En élaguant les jeux d'instructions superflus, nous obtenons une efficacité supérieure de 40% par rapport au matériel standard.",
    researchParagraph2: "Nos recherches actuelles portent sur des modules multi-puces refroidis par liquide, dissipant la chaleur par le biais de boucles de fluide diélectrique synthétique. Cette percée permet aux puces de tourner à plein régime sans étranglement thermique, prolongeant la durée de vie à plus de 5 ans.",

    // Login Page
    authAccessSecured: "ACCÈS SÉCURISÉ",
    authEnterCredentials: "Saisissez vos identifiants pour accéder à la console.",
    authEmailLabel: "Adresse E-mail",
    authPasswordLabel: "Mot de passe",
    authForgot: "Oublié ?",
    authSignIn: "Authentifier",
    authSignUp: "Créer un compte",
    authNoAccount: "Pas de compte ?",
    authApplyAccess: "Demander l'accès",
    authBackToHome: "Retour à l'accueil",
    authInvalidCredentials: "E-mail ou mot de passe invalide.",
    authSignUpSuccess: "Compte créé avec succès ! Vous pouvez vous connecter.",
    authSignUpError: "Erreur lors de la création du compte. Veuillez réessayer.",

    // Dashboard
    dashTerminalOverview: "Présentation de la console",
    dashMiningProgress: "Statut du Minage",
    dashWalletStatus: "État du Portefeuille",
    dashSettings: "Réglages de la Console",
    dashSecuredTerminal: "Terminal Sécurisé",
    dashAggregateHashrate: "Hashrate Global",
    dashWalletValue: "Valeur du Coffre",
    dashActiveClusters: "Clusters de Nœuds Actifs",
    dashManageNodes: "Gérer les Nœuds de Minage",
    dashAccessVaults: "Accéder aux Portefeuilles",
    dashLogOut: "Déconnexion",
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
    heroIntroSub: "Experimente el poder de hash de grado industrial con AppsMiners. Eficiencia inigualable, escalabilidad sin problemas y control absoluto.",
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

    // Features
    featuresUptime: "Tasa de Disponibilidad",
    featuresSupport: "Soporte Experto",
    featuresPoolFees: "0% Comisiones de Pool",
    featuresProtocol: "Protocolo de Nodo",

    // Crypto Services
    servicesHeading: "Infraestructura Financiera",
    servicesTitle1: "Trading y Almacenamiento",
    servicesTitle2: "Institucional",
    servicesDesc: "Más allá de la minería, AppsMiners ofrece una casa de trading de criptomonedas de nivel empresarial y un servicio de billetera híbrida.",
    servicesTradingHouseTitle: "Casa de Trading Crypto",
    servicesTradingHouseDesc: "Ejecute operaciones de gran volumen sin deslizamiento. Nuestro motor de emparejamiento maneja millones de transacciones por segundo, ofreciendo una liquidez excelente.",
    servicesTradingHouseFeat1: "0.05% Tarifas Maker/Taker",
    servicesTradingHouseFeat2: "Integración Directa con Pool de Minería",
    servicesTradingHouseFeat3: "Acceso API para Quants",
    servicesTradingHouseCta: "Entrar al Exchange",
    servicesWalletTitle: "Billeteras Híbridas",
    servicesWalletDesc: "El equilibrio definitivo entre accesibilidad y seguridad. Mantenga fondos operativos en nuestras billeteras calientes Multi-Sig mientras sus activos principales están seguros en bóvedas frías.",
    servicesWalletFeat1: "Póliza de Seguro de $150M",
    servicesWalletFeat2: "Nodos Distribuidos Geográficamente",
    servicesWalletFeat3: "Transferencia Automática Instantánea",
    servicesWalletCta: "Abrir Bóveda",

    // Hero Section Captions
    heroSecTitle1: "Ingeniería de Precisión",
    heroSecDesc1: "Cada componente mecanizado con tolerancias submilimétricas para un rendimiento térmico óptimo.",
    heroSecTitle2: "Tasa de Hash Cuántica",
    heroSecDesc2: "Chips ASIC patentados que ofrecen hasta 200 TH/s con una eficiencia líder en la industria de 15 J/TH.",
    heroSecTitle3: "Arquitectura Inmutable",
    heroSecDesc3: "La integración directa de almacenamiento en frío mantiene sus activos minados fuera de línea desde el momento en que se generan.",

    // Asic Research
    researchTitle: "Laboratorio de Investigación de Silicio",
    researchHeading: "Innovación de Silicio",
    researchSub: "Superando los límites de la eficiencia de hash termodinámica en un nodo de proceso TSMC de 5nm personalizado.",
    researchParagraph1: "A través de la colaboración directa con fundiciones globales de semiconductores, AppsMiners diseña microarquitecturas de chips ASIC optimizadas específicamente para puertas lógicas SHA-256. Al eliminar conjuntos de instrucciones innecesarios a nivel de diseño, logramos un 40% más de eficiencia que el hardware comercial.",
    researchParagraph2: "Nuestra investigación actual se centra en módulos multi-die refrigerados por líquido que disipan el calor a través de bucles de fluido sintético. Este avance permite que los chips funcionen a velocidades máximas sin estrangulamiento térmico, extendiendo la vida útil a más de 5 años.",

    // Login Page
    authAccessSecured: "ACCESO SÉCURIZADO",
    authEnterCredentials: "Siga las instrucciones para acceder al panel de control.",
    authEmailLabel: "Correo Electrónico",
    authPasswordLabel: "Contraseña",
    authForgot: "¿Olvidó?",
    authSignIn: "Autenticar",
    authSignUp: "Crear Cuenta",
    authNoAccount: "¿No tiene cuenta?",
    authApplyAccess: "Solicitar Acceso",
    authBackToHome: "Volver a Inicio",
    authInvalidCredentials: "Correo o contraseña no válidos.",
    authSignUpSuccess: "¡Cuenta creada! Ya puede iniciar sesión.",
    authSignUpError: "Error al crear la cuenta. Por favor intente de nuevo.",

    // Dashboard
    dashTerminalOverview: "Resumen del Terminal de Operador",
    dashMiningProgress: "Progreso de Minería",
    dashWalletStatus: "Estado de Billetera",
    dashSettings: "Configuración de Terminal",
    dashSecuredTerminal: "Terminal Asegurado",
    dashAggregateHashrate: "Tasa de Hash Agregada",
    dashWalletValue: "Valor de Bóveda",
    dashActiveClusters: "Clústeres Activos",
    dashManageNodes: "Gestionar Nodos de Minería",
    dashAccessVaults: "Acceder a Billeteras",
    dashLogOut: "Cerrar Sesión",
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

    // Features
    featuresUptime: "আপটাইম রেট",
    featuresSupport: "বিশেষজ্ঞ সহায়তা",
    featuresPoolFees: "পুলের ফি ০%",
    featuresProtocol: "নোড প্রোটোকল",

    // Crypto Services
    servicesHeading: "আর্থিক পরিকাঠামো",
    servicesTitle1: "প্রাতিষ্ঠানিক",
    servicesTitle2: "ট্রেডিং ও স্টোরেজ",
    servicesDesc: "মাইনিংয়ের পাশাপাশি, অ্যাপ্সমাইনার একটি এন্টারপ্রাইজ-গ্রেড ক্রিপ্টো ট্রেডিং হাউজ এবং হাইব্রিড হট/কোল্ড ওয়ালেট সেবা প্রদান করে।",
    servicesTradingHouseTitle: "ক্রিপ্টো ট্রেডিং হাউজ",
    servicesTradingHouseDesc: "বিন্দুমাত্র স্লিপেজ ছাড়াই বড় আকারের ট্রেড সম্পন্ন করুন। আমাদের ম্যাচিং ইঞ্জিন প্রতি সেকেন্ডে লাখ লাখ লেনদেন পরিচালনা করে এবং প্রিমিয়াম লিকুইডিটি প্রদান করে।",
    servicesTradingHouseFeat1: "০.০৫% মেকার/টেকার ফি",
    servicesTradingHouseFeat2: "সরাসরি মাইনিং পুল ইন্টিগ্রেশন",
    servicesTradingHouseFeat3: "কোয়ান্ট ট্রেডারদের জন্য এপিআই অ্যাক্সেস",
    servicesTradingHouseCta: "এক্সচেঞ্জে প্রবেশ করুন",
    servicesWalletTitle: "হাইব্রিড ওয়ালেট সেবাসমূহ",
    servicesWalletDesc: "ব্যবহারযোগ্যতা এবং নিরাপত্তার এক অপূর্ব সমন্বয়। আপনার দৈনিক লেনদেনের তহবিল আমাদের মাল্টি-সিগ হট ওয়ালেটে রাখুন, আর আপনার সঞ্চিত মূল সম্পদসমূহ অফলাইনে নিরাপদ কোল্ড স্টোরেজ ভল্টে সুরক্ষিত রাখুন।",
    servicesWalletFeat1: "$১৫০ মিলিয়ন ডলারের বীমা পলিসি",
    servicesWalletFeat2: "ভৌগোলিকভাবে বিভক্ত নোডসমূহ",
    servicesWalletFeat3: "তাত্ক্ষণিক হট-টু-কোল্ড সুইপ সুবিধা",
    servicesWalletCta: "ভল্ট খুলুন",

    // Hero Section Captions
    heroSecTitle1: "সুক্ষ্ম প্রকৌশল",
    heroSecDesc1: "সর্বোচ্চ থার্মাল কর্মক্ষমতার জন্য প্রতিটি যন্ত্রাংশ মিলিমিটারের চেয়েও সুক্ষ্ম মাপে তৈরি করা হয়েছে।",
    heroSecTitle2: "কোয়ান্টাম হ্যাশরেট",
    heroSecDesc2: "শিল্পের সেরা ১৫ J/TH কার্যক্ষমতা সহ ২০০ TH/s পর্যন্ত হ্যাশরেট প্রদানে সক্ষম আমাদের নিজস্ব ASIC চিপসমূহ।",
    heroSecTitle3: "অপরিবর্তনীয় আর্কিটেকচার",
    heroSecDesc3: "সরাসরি কোল্ড স্টোরেজ ইন্টিগ্রেশনের ফলে আপনার উপার্জিত সম্পদ অর্জিত হওয়ার মুহূর্ত থেকেই অফলাইনে সুরক্ষিত থাকে।",

    // Asic Research
    researchTitle: "সিলিকন রিসার্চ ল্যাব",
    researchHeading: "সিলিকন ইনোভেশন",
    researchSub: "একটি কাস্টম ৫nm TSMC প্রসেস নোডে থার্মোডায়নামিক হ্যাশিং কার্যকারিতার সীমানা অতিক্রম করা হচ্ছে।",
    researchParagraph1: "বৈশ্বিক সেমিকন্ডাক্টর ফাউন্ড্রিগুলোর সাথে সরাসরি সহযোগিতার মাধ্যমে, AppsMiners সরাসরি SHA-256 লজিক গেটের জন্য অপ্টিমাইজ করা কাস্টম ASIC চিপ মাইক্রোআর্কিটেকচার ডিজাইন করে। হার্ডওয়্যার লেআউট স্তর থেকে অপ্রয়োজনীয় নির্দেশাবলী বাদ দিয়ে, আমরা সাধারণ হার্ডওয়্যারের চেয়ে ৪০% পর্যন্ত বেশি কার্যকারিতা অর্জন করি।",
    researchParagraph2: "আমাদের বর্তমান গবেষণা তরল-শীতল (liquid-cooled) মাল্টি-ডাই মডিউলের উপর যা সরাসরি সিন্থেটিক তরল লুপের মাধ্যমে তাপ অপসারণ করে। এই প্রকৌশলগত সাফল্য চিপগুলোকে কোনো থار্মাল থ্রটলিং ছাড়াই সর্বোচ্চ গতিতে কাজ করতে দেয়, যা হার্ডওয়্যারের জীবনকাল ৫ বছরের বেশি বাড়িয়ে দেয়।",

    // Login Page
    authAccessSecured: "সিকিউর এক্সেস",
    authEnterCredentials: "ড্যাশবোর্ডে প্রবেশের জন্য আপনার বিবরণ প্রদান করুন।",
    authEmailLabel: "ইমেইল এড্রেস",
    authPasswordLabel: "পাসওয়ার্ড",
    authForgot: "পাসওয়ার্ড ভুলে গেছেন?",
    authSignIn: "প্রমাণীকরণ করুন",
    authSignUp: "অ্যাকাউন্ট তৈরি করুন",
    authNoAccount: "কোনো অ্যাকাউন্ট নেই?",
    authApplyAccess: "অ্যাক্সেসের জন্য আবেদন করুন",
    authBackToHome: "হোম পেজে ফিরে যান",
    authInvalidCredentials: "ভুল ইমেইল বা পাসওয়ার্ড।",
    authSignUpSuccess: "অ্যাকাউন্ট তৈরি সফল হয়েছে! আপনি এখন লগ ইন করতে পারেন।",
    authSignUpError: "অ্যাকাউন্ট তৈরিতে ত্রুটি দেখা দিয়েছে। আবার চেষ্টা করুন।",

    // Dashboard
    dashTerminalOverview: "অপারেটর টার্মিনাল বিবরণ",
    dashMiningProgress: "মাইনিং প্রগতি",
    dashWalletStatus: "ওয়ালেট স্থিতি",
    dashSettings: "টার্মিনাল সেটিংস",
    dashSecuredTerminal: "সুরক্ষিত টার্মিনাল",
    dashAggregateHashrate: "মোট সংগৃহীত হ্যাশরেট",
    dashWalletValue: "ওয়ালেট ভল্টের মূল্য",
    dashActiveClusters: "সক্রিয় নোড ক্লাস্টারসমূহ",
    dashManageNodes: "মাইনিং নোড পরিচালনা",
    dashAccessVaults: "সুরক্ষিত ওয়ালেট এক্সেস",
    dashLogOut: "লগ আউট",
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
    const stored = localStorage.getItem("appsminers_lang") as LanguageCode;
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
      localStorage.setItem("appsminers_lang", code);
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
    
    // Dynamically apply language className to body for layout-specific typography fonts
    if (typeof document !== "undefined" && document.body) {
      // Clear old lang classes
      document.body.className = document.body.className
        .split(" ")
        .filter((c) => !c.startsWith("lang-"))
        .join(" ");
      // Add current lang class
      document.body.classList.add(`lang-${currentLangCode.toLowerCase()}`);
    }
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
