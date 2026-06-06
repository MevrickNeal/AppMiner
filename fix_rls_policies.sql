-- Fix AppsMiners Database RLS policies and add missing permissions
-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR

-- 1. Drop the recursive and broken policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all nodes" ON public.nodes;
DROP POLICY IF EXISTS "Users can update own nodes" ON public.nodes;

-- 2. Create a SECURITY DEFINER function to safely check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create the admin select policies using the helper function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can view all nodes"
  ON public.nodes FOR SELECT
  USING (
    public.is_admin(auth.uid())
  );

-- 4. Add missing UPDATE policy for nodes so users can setup and manage their hardware
CREATE POLICY "Users can update own nodes"
  ON public.nodes FOR UPDATE
  USING (
    auth.uid() = user_id
  );
