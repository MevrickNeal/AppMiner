# APPSMINERS System Architecture & Developer Guide

## Warm Greetings & Well Wishes

> "To the next generation of engineers shaping the future of this ecosystem: Welcome to AppsMiners. May your builds be clean, your queries fast, and your mining pools always filled. This project has been designed with robust security, fluid aesthetics, and modern web paradigms at its core. Take it, improve it, and build the next frontier."
> 
> — **Lian Mollick Nehal**

---

## 1. Project Overview & Identity
**AppsMiners** is an enterprise-grade ASIC hardware distribution, mining cluster management, and user wallet ecosystem. It bridges physical hardware management with real-time web telemetry and secure crypto financial services.

### Core Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (v4 Utility-First)
- **Database / Backend**: Supabase (PostgREST, Auth, Webhooks, Postgres Triggers)
- **Animations**: Framer Motion (Hardware acceleration, smooth layouts, micro-interactions)
- **Icons**: Lucide React
- **Translation / Internationalization**: Context-driven multi-language support (English, French, Arabic, Bengali, etc.)

---

## 2. Environment Variables & Secret Management
To run or modify AppsMiners, you require a `.env.local` file at the root.

```bash
# Supabase Project Connection Details
NEXT_PUBLIC_SUPABASE_URL=https://dgrocbdhttwouzsyarub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_aqBFXh6dM8qNnJp2xg0bLA_bV3Bgvjv
```

### Rotating Keys & Secrets
1. **Frontend Client Keys**: If you regenerate the anonymous keys in the Supabase API portal, update both `.env.local` (local) and Vercel's Environment Variables page immediately.
2. **Database Connection String**: Should only be exposed to secure workflows or direct admin environments (keep out of repository commits).

---

## 3. Database Architecture (Supabase SQL Schema)

The database runs on PostgreSQL. Below is the breakdown of the core tables, RLS policies, and Postgres automated routines.

### Tables
1. **`public.profiles`**: Connects users to metadata.
2. **`public.purchases`**: Manages orders, tracking if an ASIC is pre-ordered (`is_preorder: boolean`).
3. **`public.nodes`**: Tracks telemetry for active ASICs, including hashrate, temperatures, and status (e.g. `overclocked`, `online`, `offline`).
4. **`public.wallets`**: Tracks user funds across `hot_balance` and `cold_balance` vaults.

```sql
-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets Table
CREATE TABLE public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  hot_balance NUMERIC(20, 8) DEFAULT 0.00000000,
  cold_balance NUMERIC(20, 8) DEFAULT 0.00000000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases Table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  series TEXT,
  price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  is_preorder BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nodes Table (Telemetry)
CREATE TABLE public.nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES public.purchases ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  hashrate NUMERIC(10, 2) DEFAULT 0.00,
  temp_c NUMERIC(5, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'Initializing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Automation Triggers (Stored Procedures)
To guarantee data consistency, triggers handle profile instantiation and wallet setups immediately when users complete sign-up.

```sql
-- Trigger: Handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Handle wallet initialization
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, hot_balance, cold_balance)
  VALUES (NEW.id, 0.0, 0.0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Frontend Component & Layout Map

```
src/
├── app/
│   ├── layout.tsx         # Root layout, viewports, global styling, dynamic fonts
│   ├── page.tsx           # Home landing page with HardwareCatalog, Features, Hero
│   ├── login/
│   │   └── page.tsx       # Auth form (Tabs for Sign In and Sign Up + registration fields)
│   └── dashboard/
│       └── page.tsx       # Main Operator Hub (Switches views, holds mobile Bottom Nav)
├── components/
│   ├── HardwareCatalog.tsx# Dynamic e-commerce grid + "Bottom Sheet" mobile modals
│   ├── MiningDashboard.tsx# Live telemetry displays, cluster visualizers, admin switches
│   ├── WalletServices.tsx # Crypto hot/cold balance visualizer and address actions
│   ├── dashboard/
│   │   ├── OrderHistoryView.tsx # Custom order and pre-order lists
│   │   └── SupportView.tsx      # searchable Help FAQ + interactive support channels
├── lib/
│   └── supabase.ts        # Singleton supabase client initialization
└── context/
    └── LanguageContext.tsx# Dynamic localized strings, i18n support
```

---

## 5. Mobile & App-Like UX Enhancements

To achieve a "native app" feel, several core parameters are implemented:
1. **Viewport Locking (`layout.tsx`)**:
   `maximumScale: 1, userScalable: false` are configured via Next.js Viewport export. This stops the native browser zoom actions when a user double-taps interactive elements on mobile.
2. **Bottom Navigation (`dashboard/page.tsx`)**:
   On viewport widths `< 1024px` (Tailwind `< lg:`), the vertical sidebar nav changes to a fixed bottom navigation bar displaying icons (`Home`, `Cpu`, `Wallet`, `ShoppingCart`, `HelpCircle`) for rapid page switching.
3. **Bottom-Sheet Modals (`HardwareCatalog.tsx`)**:
   On mobile viewports, the catalog details modal slides up from the base of the viewport (`items-end`) instead of hanging in the center, maximizing text and form real estate.

---

## 6. Developer Runbook: Modifying the System

### A. How to Add a New Tab to the Dashboard
1. Open `src/app/dashboard/page.tsx`.
2. Locate the navigation data list `navItems` (around line 450).
3. Append a new item with an ID, localized label key, and a Lucide icon:
   ```typescript
   { id: "analytics", label: t("analyticsTab"), icon: BarChart2 }
   ```
4. Find the main conditional switch render block inside the `<main>` tag:
   ```typescript
   {activeTab === "analytics" && <YourNewAnalyticsComponent />}
   ```

### B. How to Add a Product to the Catalog
1. Open `src/components/HardwareCatalog.tsx`.
2. Scroll to the static array of products (`flagships` or `micros`).
3. Insert a new product object inside the array matching the interface schema:
   ```typescript
   {
     id: "asic-model-x1",
     name: "Asic Alpha X1",
     series: "PRO SERIES",
     hashrate: "480 TH/s",
     power: "3100W",
     efficiency: "6.5 J/TH",
     price: 12499.00,
     image: "/Products/asic-gold.png",
     badge: "NEW MODEL",
     specs: {
       chipType: "3nm Quantum ASIC",
       cooling: "Dual-Chamber Liquid Immersion",
       dimensions: "340 x 160 x 280 mm",
       weight: "11.2 kg",
       noise: "42 dB (Silent Mode)",
       network: "10GbE SFP+ / Wi-Fi 6E"
     }
   }
   ```

### C. Development Commands
```bash
# 1. Install Dependencies
npm install

# 2. Run Local Development Server
npm run dev

# 3. Create Production Build
npm run build

# 4. Start Production Server
npm run start
```

---

## 7. Security Hardening Configurations
The system is built on **Zero-Trust Client Access**:
- **Next.js Security Headers (`next.config.ts`)**:
  Protects users from clickjacking, MIME-sniffing, and data leakages via headers configuration:
  ```typescript
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ]
  }
  ```
- **Supabase Row Level Security (RLS)**:
  Make sure RLS is ALWAYS enabled when creating new database tables. Never allow broad public read/write access. Use the following baseline:
  ```sql
  ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can only read own data" ON public.table_name
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
  ```

---

*Build with passion, scale with efficiency, and keep the miners spinning!*
**- Lian Mollick Nehal**
