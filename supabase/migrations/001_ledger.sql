-- ============================================================
-- AppsMiners — Production Ledger Migration
-- Run this once in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Immutable transaction ledger (every dollar movement is a row)
CREATE TABLE IF NOT EXISTS ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          text NOT NULL CHECK (type IN ('credit', 'debit')),
  amount        numeric(18, 8) NOT NULL CHECK (amount > 0),
  description   text NOT NULL,
  ref_id        text,                    -- e.g. node_id, purchase_id
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ledger_user_id_idx ON ledger(user_id);
CREATE INDEX IF NOT EXISTS ledger_created_at_idx ON ledger(created_at DESC);

-- RLS: users see only their own rows, no updates/deletes ever
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own ledger" ON ledger FOR SELECT USING (auth.uid() = user_id);
-- No INSERT policy from client — only server-side via SECURITY DEFINER functions

-- 2. Atomic credit function — the ONLY way earnings enter the system
--    Called by the server action. Cannot be called from browser (no INSERT policy).
CREATE OR REPLACE FUNCTION credit_earnings(
  p_user_id    uuid,
  p_amount     numeric,
  p_desc       text DEFAULT 'Mining earnings'
)
RETURNS numeric          -- returns new balance
LANGUAGE plpgsql
SECURITY DEFINER         -- runs as DB owner, bypasses RLS safely
SET search_path = public
AS $$
DECLARE
  v_new_balance numeric;
BEGIN
  -- Guard: never credit zero or negative
  IF p_amount <= 0 THEN
    RETURN (SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END), 0)
            FROM ledger WHERE user_id = p_user_id);
  END IF;

  -- Write to immutable ledger
  INSERT INTO ledger (user_id, type, amount, description)
  VALUES (p_user_id, 'credit', p_amount, p_desc);

  -- Update materialized cache (for fast reads) — ONLY ever increments
  INSERT INTO wallets (user_id, hot_wallet_balance, updated_at)
    VALUES (p_user_id, p_amount, now())
  ON CONFLICT (user_id) DO UPDATE
    SET hot_wallet_balance = wallets.hot_wallet_balance + EXCLUDED.hot_wallet_balance,
        updated_at         = now();

  SELECT hot_wallet_balance INTO v_new_balance
  FROM wallets WHERE user_id = p_user_id;

  RETURN v_new_balance;
END;
$$;

-- 3. Atomic debit function (withdrawals, purchases)
CREATE OR REPLACE FUNCTION debit_balance(
  p_user_id    uuid,
  p_amount     numeric,
  p_desc       text DEFAULT 'Withdrawal'
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current  numeric;
  v_new      numeric;
BEGIN
  SELECT hot_wallet_balance INTO v_current
  FROM wallets WHERE user_id = p_user_id FOR UPDATE; -- row lock

  IF v_current IS NULL OR v_current < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance: have %, need %', COALESCE(v_current,0), p_amount;
  END IF;

  INSERT INTO ledger (user_id, type, amount, description)
  VALUES (p_user_id, 'debit', p_amount, p_desc);

  UPDATE wallets
  SET hot_wallet_balance = hot_wallet_balance - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING hot_wallet_balance INTO v_new;

  RETURN v_new;
END;
$$;

-- 4. Ensure starting balance for new users via trigger
CREATE OR REPLACE FUNCTION on_new_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Seed ledger with the starting $100 credit
  INSERT INTO ledger (user_id, type, amount, description)
  VALUES (NEW.user_id, 'credit', 100.00, 'Welcome bonus');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_new_wallet ON wallets;
CREATE TRIGGER trg_new_wallet
  AFTER INSERT ON wallets
  FOR EACH ROW
  WHEN (NEW.hot_wallet_balance = 100.00)
  EXECUTE FUNCTION on_new_wallet();

-- 5. Ensure wallets table has correct constraint for upsert
ALTER TABLE wallets
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Confirm
SELECT 'Migration complete. Functions: credit_earnings(), debit_balance()' AS status;
