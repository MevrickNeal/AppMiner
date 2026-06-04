-- AppMiner Database Updates: Wallets & Pre-orders
-- Run this script in the Supabase SQL Editor

-- 1. Add `is_preorder` column to `public.purchases`
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN DEFAULT false;

-- 2. Create Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hot_wallet_balance NUMERIC DEFAULT 0.00000000,
  cold_vault_balance NUMERIC DEFAULT 0.00000000,
  total_withdrawn NUMERIC DEFAULT 0.00000000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own wallets
CREATE POLICY "Users can view own wallets" 
  ON public.wallets FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to update their own wallets (for deposits/withdrawals)
CREATE POLICY "Users can update own wallets" 
  ON public.wallets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets" 
  ON public.wallets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. Trigger to auto-create wallet when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.wallets (user_id, hot_wallet_balance, cold_vault_balance)
  VALUES (new.id, 0.00000000, 0.00000000);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_wallet();

-- Backfill missing wallets for existing users
INSERT INTO public.wallets (user_id, hot_wallet_balance, cold_vault_balance)
SELECT id, 0.00000000, 0.00000000 FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.wallets WHERE public.wallets.user_id = auth.users.id);
