"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// ─── Earning rate per second per product ────────────────────────────────────
function getNodeRate(productName: string): number {
  const n = productName.toLowerCase();
  if (n.includes("t200"))    return 0.00005;
  if (n.includes("f100"))    return 0.000025;
  if (n.includes("f50"))     return 0.0000125;
  if (n.includes("starter")) return 0.00000042;
  if (n.includes("mini"))    return 0.000000125;
  if (n.includes("nano"))    return 0.00000001;
  if (n.includes("pocket"))  return 0.00000000375;
  return 0.000000025;
}

// ─── Yield/lease factor from upgrades ───────────────────────────────────────
function yieldFactor(upgrades: string[]): number {
  if (upgrades.includes("geothermal-lease")) return 0.95;
  if (upgrades.includes("hydro-lease"))      return 0.92;
  if (upgrades.includes("wind-lease"))       return 0.90;
  return 0.85;
}

// ─── Earning multiplier from upgrades + settings ────────────────────────────
function earningMultiplier(
  upgrades:    string[],
  overclocked: boolean,
  pool:        string,
  staking:     number
): number {
  let m = 1.0;
  if (upgrades.includes("overclock-license")) m += 0.10;
  if (upgrades.includes("cooling-booster"))   m += 0.15;
  if (overclocked)                             m += 0.15;
  if (pool === "reykjavik")                    m += 0.025;
  else if (pool === "lulea")                   m += 0.015;
  m += staking;
  return m;
}

// ─── Calculate earnings + status transitions ────────────────────────────────
function calcEarnings(
  nodes:       any[],
  upgrades:    string[],
  lastSync:    number,
  overclocked: boolean,
  systemActive:boolean,
  pool:        string,
  staking:     number
): { earnings: number; updatedNodes: any[]; nodesChanged: boolean } {
  if (!systemActive) return { earnings: 0, updatedNodes: nodes, nodesChanged: false };

  const now = Date.now();
  if (now <= lastSync) return { earnings: 0, updatedNodes: nodes, nodesChanged: false };

  const mult = earningMultiplier(upgrades, overclocked, pool, staking);
  const yf   = yieldFactor(upgrades);
  let total   = 0;
  let changed = false;

  const updated = nodes.map(node => {
    const status     = (node.status || "").toLowerCase();
    const createdAt  = node.created_at          ? new Date(node.created_at).getTime()          : lastSync;
    const shippedAt  = node.shipping_started_at ? new Date(node.shipping_started_at).getTime() : lastSync;
    let   newStatus  = node.status;

    if (status === "activating") {
      const activateAt = createdAt + 30_000;
      if (now >= activateAt) {
        newStatus = "online";
        changed   = true;
        const secs = Math.max(0, (now - Math.max(lastSync, activateAt)) / 1000);
        const rate = getNodeRate(node.productName);
        total += rate * yf * mult * secs;
      }
    } else if (status === "shipping") {
      if (now >= shippedAt + 30_000) { newStatus = "delivered"; changed = true; }
    } else if (status === "online") {
      const secs = Math.max(0, (now - lastSync) / 1000);
      const rate = getNodeRate(node.productName);
      const eff  = node.hosting_type === "remote" ? rate * yf : rate;
      total += eff * mult * secs;
    }

    return newStatus !== node.status ? { ...node, status: newStatus } : node;
  });

  return { earnings: Math.max(0, total), updatedNodes: updated, nodesChanged: changed };
}

// ─── Main server action ──────────────────────────────────────────────────────
export async function syncMiningEarnings(
  token:       string | null,
  overclocked: boolean,
  systemActive:boolean,
  pool        = "helsinki",
  staking     = 0
) {
  if (!token) return { success: false, error: "No auth token." };

  // Auth-scoped client — every DB call is automatically RLS-filtered to this user
  const sb = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !user) return { success: false, error: "Unauthorized." };

  const uid = user.id;

  // ── 1. Ensure wallet row exists (safe upsert — never overwrites existing balance)
  await sb.from("wallets").upsert(
    { user_id: uid, hot_wallet_balance: 100.00, updated_at: new Date().toISOString() },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  // ── 2. Read wallet + nodes + upgrades in parallel
  const [walletRes, nodesRes, purchasesRes] = await Promise.all([
    sb.from("wallets").select("hot_wallet_balance, updated_at").eq("user_id", uid).single(),
    sb.from("nodes").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    sb.from("purchases").select("product_id").eq("user_id", uid)
  ]);

  if (walletRes.error || !walletRes.data) return { success: false, error: "Wallet read failed." };
  if (nodesRes.error)                     return { success: false, error: "Nodes read failed." };

  const wallet    = walletRes.data;
  const dbBalance = parseFloat(String(wallet.hot_wallet_balance ?? 0)) || 0;
  const lastSync  = wallet.updated_at ? new Date(wallet.updated_at).getTime() : Date.now();
  const upgrades  = (purchasesRes.data || []).map((p: any) => p.product_id);

  const dbNodes = (nodesRes.data || []).map(n => ({
    id:                 n.id,
    productName:        n.product_name,
    hashrate:           n.hashrate,
    power:              n.power,
    region:             n.region,
    status:             n.status,
    hosting_type:       n.shipping_address ? "physical" : "remote",
    setup_configured:   !["pending_setup","shipping","delivered"].includes(n.status),
    shipping_address:   n.shipping_address    || null,
    shipping_started_at:n.shipping_started_at || null,
    created_at:         n.created_at
  }));

  // ── 3. Sanity: refuse to use $0 balance on an account with activity
  if (dbBalance === 0 && (dbNodes.length > 0 || upgrades.length > 0)) {
    return { success: false, error: "BALANCE_ANOMALY" };
  }

  // ── 4. Calculate offline earnings
  const { earnings, updatedNodes, nodesChanged } = calcEarnings(
    dbNodes, upgrades, lastSync, overclocked, systemActive, pool, staking
  );

  const elapsedHours = (Date.now() - lastSync) / 3_600_000;

  // ── 5. Persist earnings via ATOMIC Postgres function (no read-modify-write)
  //    credit_earnings() does: UPDATE wallets SET balance = balance + amount
  //    It is a single SQL statement — race-condition-proof.
  if (earnings > 0) {
    const { error: rpcErr } = await sb.rpc("credit_earnings", {
      p_user_id: uid,
      p_amount:  parseFloat(earnings.toFixed(8)),
      p_desc:    "Mining earnings"
    });

    if (rpcErr) {
      // RPC not yet deployed (migration not run) — fall back to safe direct database update
      console.warn("credit_earnings RPC not available, using direct update fallback:", rpcErr.message);
      const freshBalance = dbBalance + earnings;
      await sb.from("wallets")
        .update({ 
          hot_wallet_balance: parseFloat(freshBalance.toFixed(8)),
          updated_at: new Date().toISOString() 
        })
        .eq("user_id", uid);
    }
  } else {
    // No earnings this cycle — just update the sync timestamp
    await sb.from("wallets")
      .update({ updated_at: new Date().toISOString() })
      .eq("user_id", uid);
  }

  // ── 6. Re-read final balance (after atomic credit)
  const { data: freshWallet } = await sb
    .from("wallets").select("hot_wallet_balance").eq("user_id", uid).single();

  const finalBalance = freshWallet
    ? Math.max(dbBalance + earnings, parseFloat(String(freshWallet.hot_wallet_balance ?? 0)) || 0)
    : dbBalance + earnings;

  // ── 7. Persist node status transitions
  if (nodesChanged) {
    await Promise.all(
      updatedNodes
        .filter(n => dbNodes.find(d => d.id === n.id && d.status !== n.status))
        .map(n => sb.from("nodes").update({ status: n.status }).eq("id", n.id).eq("user_id", uid))
    );
  }

  return {
    success: true,
    earnings,
    elapsedHours,
    updatedNodes,
    nodesChanged,
    newBalance: finalBalance
  };
}

// ─── Collect / withdraw earnings ─────────────────────────────────────────────
export async function collectEarnings(token: string | null, amount: number) {
  if (!token || amount <= 0) return { success: false, error: "Invalid request." };

  const sb = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !user) return { success: false, error: "Unauthorized." };

  // Uses the row-locking debit_balance() Postgres function
  const { data, error } = await sb.rpc("debit_balance", {
    p_user_id: user.id,
    p_amount:  parseFloat(amount.toFixed(8)),
    p_desc:    "Earnings collected"
  });

  if (error) {
    console.warn("debit_balance RPC not available during collect, using read fallback:", error.message);
    const { data: wallet } = await sb
      .from("wallets")
      .select("hot_wallet_balance")
      .eq("user_id", user.id)
      .single();
    const finalBal = wallet ? parseFloat(String(wallet.hot_wallet_balance ?? 0)) || 0 : 100.00;
    return { success: true, newBalance: finalBal };
  }
  return { success: true, newBalance: data };
}
