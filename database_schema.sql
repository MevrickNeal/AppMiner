-- AppsMiners Database Schema
-- Run this script in the Supabase SQL Editor

-- 1. Create Profiles Table (extends auth.users)
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

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Prevent users from escalating to admin
CREATE OR REPLACE FUNCTION public.protect_is_admin()
RETURNS trigger AS $$
BEGIN
  -- Revert is_admin to its old value if it was changed
  NEW.is_admin = OLD.is_admin;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ensure_is_admin_protected
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.protect_is_admin();

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    is_admin,
    username,
    reference_code,
    first_name,
    last_name,
    country,
    phone_number,
    date_of_birth,
    transaction_pin,
    security_key
  )
  VALUES (
    new.id, 
    false,
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create Purchases Table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price_paid NUMERIC NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" 
  ON public.purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" 
  ON public.purchases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. Create Nodes Table (The mining hardware)
CREATE TABLE public.nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  status TEXT DEFAULT 'Online',
  hashrate TEXT NOT NULL,
  power TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nodes" 
  ON public.nodes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nodes" 
  ON public.nodes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 4. Enable public reading of total aggregate stats (for admin dashboard, though usually admins bypass RLS)
-- For simplicity, we can let authenticated users view aggregates, or create admin-specific policies
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can view all nodes"
  ON public.nodes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
