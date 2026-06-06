# AppsMiners System Architecture & Developer Guide

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
1. **`public.profiles`**: Extends `auth.users` to save detailed operator records (name, dob, pins, keys).
2. **`public.purchases`**: Manages orders, tracking if an ASIC is pre-ordered (`is_preorder: boolean`) and purchase transaction status.
3. **`public.nodes`**: Tracks telemetry for active ASICs, including hashrate, power draw, hosting type (remote/physical), setup status, and transit.
4. **`public.wallets`**: Tracks user funds across virtual balance ($100.00 starting credit) and mock hot/cold vaults.

```sql
-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT false,
  language_preference TEXT DEFAULT 'EN',
  username TEXT,
  reference_code TEXT,
  first_name TEXT,
  last_name TEXT,
  country TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  transaction_pin TEXT,
  security_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wallets Table
CREATE TABLE public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  hot_wallet_balance NUMERIC DEFAULT 0.00000000,
  cold_vault_balance NUMERIC DEFAULT 0.00000000,
  total_withdrawn NUMERIC DEFAULT 0.00000000,
  usd_balance NUMERIC DEFAULT 100.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Purchases Table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price_paid NUMERIC NOT NULL,
  is_preorder BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Nodes Table (Telemetry & Deployment Setup)
CREATE TABLE public.nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  status TEXT DEFAULT 'Online',
  hashrate TEXT NOT NULL,
  power TEXT NOT NULL,
  region TEXT NOT NULL,
  hosting_type TEXT DEFAULT 'remote',
  setup_configured BOOLEAN DEFAULT false,
  shipping_address TEXT,
  shipping_started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Row Level Security (RLS) & Recursion Bypass
To prevent stack overflows when evaluating permissions, admin status queries are decoupled using a `SECURITY DEFINER` function which bypasses RLS on subqueries:

```sql
-- Security Definer helper function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));

ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own nodes" ON public.nodes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own nodes" ON public.nodes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own nodes" ON public.nodes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all nodes" ON public.nodes FOR SELECT USING (public.is_admin(auth.uid()));
```

### Automation Triggers (Stored Procedures)
To guarantee data consistency, triggers handle profile instantiation and wallet setups immediately when users complete sign-up.

```sql
-- Trigger: Handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, is_admin, username, reference_code, first_name,
    last_name, country, phone_number, date_of_birth, transaction_pin, security_key
  )
  VALUES (
    new.id, false,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'reference_code',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'phone_number',
    NULLIF(new.raw_user_meta_data->>'date_of_birth', '')::DATE,
    new.raw_user_meta_data->>'transaction_pin',
    new.raw_user_meta_data->>'security_key'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Handle wallet initialization with $100 starting credit
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.wallets (user_id, hot_wallet_balance, cold_vault_balance, usd_balance)
  VALUES (new.id, 0.00000000, 0.00000000, 100.00);
  RETURN new;
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

## 8. ATtiny85 / Digispark Hardware Authentication Key

AppsMiners supports physical cold vault verification using a low-cost ATtiny85-based **Digispark USB development key** to simulate an authentication token.

### How it Works (Simulation Flow)
1. **USB Keyboard (HID) Emulation**: When plugged into the host computer, the Digispark identifies itself as a standard keyboard.
2. **On-Board Signature Typing**: It waits 2 seconds for OS drivers to initialize, blinks its onboard LEDs twice, and then dynamically types the hardcoded cryptographic hardware signature:
   `AppsMiners-ATTINY85-ColdWallet-KEY-7f8a9c2b4d6e`
3. **Automatic Submit**: It sends an `Enter` keystroke to immediately submit the signature to the text box on the Operator Dashboard to unlock access to cold storage.

### Flashing Instructions (Arduino IDE)
The source code is located in the root file [`digispark_wallet.ino`](file:///C:/Users/Lian%20Mollick/Desktop/AppMiner/digispark_wallet.ino).
1. Open the Arduino IDE.
2. Go to **File -> Preferences -> Additional Boards Manager URLs** and add:
   `http://drazzy.com/package_drazzy.com_index.json`
3. Go to **Tools -> Board -> Board Manager** and search/install **"Digistump AVR Boards"**.
4. Set **Tools -> Board** to **"Digispark (Default - 16.5mhz)"**.
5. Click **Upload** to compile. When prompted by the output console, plug the Digispark into your USB port to flash.

---

*Build with passion, scale with efficiency, and keep the miners spinning!*
**- Lian Mollick Nehal**
