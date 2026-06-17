-- AppsMiners Database Security & Performance Updates
-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR

-- 1. Create Password Reset Tokens Table (Expires in 30 minutes)
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '30 minutes') NOT NULL
);

-- Enable RLS for reset tokens table
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so forgot password page can request a link anonymously)
CREATE POLICY "Anyone can request password reset token" 
  ON public.password_reset_tokens FOR INSERT 
  WITH CHECK (true);

-- Allow public lookup of tokens (to verify validation status)
CREATE POLICY "Anyone can verify reset token" 
  ON public.password_reset_tokens FOR SELECT 
  USING (true);

-- 2. Performance: Indexes on Main Queries under High Traffic
-- Index user_id columns on key tables queried on every sync/auth check
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_nodes_user_id ON public.nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);

-- Optional: Automated Cleanup function to prune expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.password_reset_tokens WHERE expires_at < timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Security Definer function to reset user password via token
CREATE OR REPLACE FUNCTION public.reset_password_by_token(p_token TEXT, p_new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_email TEXT;
  v_user_id UUID;
BEGIN
  -- 1. Find and validate token
  SELECT email INTO v_email
  FROM public.password_reset_tokens
  WHERE token = p_token AND expires_at > timezone('utc'::text, now());
  
  IF v_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 2. Find user
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 3. Update password in auth.users (encrypting with pgcrypto crypt)
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
  WHERE id = v_user_id;
  
  -- 4. Delete the used token
  DELETE FROM public.password_reset_tokens WHERE token = p_token;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
