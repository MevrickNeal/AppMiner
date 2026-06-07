"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function calculateOfflineEarnings(
  lastSyncTime: number,
  nodes: any[],
  upgrades: string[],
  overclocked: boolean,
  systemActive: boolean
): { earnings: number; updatedNodes: any[]; nodesChanged: boolean } {
  if (!systemActive) {
    return { earnings: 0, updatedNodes: nodes, nodesChanged: false };
  }

  const now = Date.now();
  const elapsedMs = now - lastSyncTime;
  if (elapsedMs <= 0) {
    return { earnings: 0, updatedNodes: nodes, nodesChanged: false };
  }

  let multiplier = 1.0;
  if (upgrades.includes("overclock-license")) {
    multiplier += 0.10;
  }
  if (upgrades.includes("cooling-booster")) {
    multiplier += 0.15;
  }
  if (overclocked) {
    multiplier += 0.15;
  }

  const getRate = (name: string): number => {
    const lower = name.toLowerCase();
    if (lower.includes("t200")) return 0.0005;
    if (lower.includes("f100")) return 0.00025;
    if (lower.includes("f50")) return 0.000125;
    if (lower.includes("starter")) return 0.00006;
    if (lower.includes("mini")) return 0.00002;
    if (lower.includes("nano")) return 0.000006;
    if (lower.includes("pocket")) return 0.000002;
    return 0.00001;
  };

  let totalEarnings = 0;
  let nodesChanged = false;

  const updatedNodes = nodes.map(node => {
    let status = node.status;
    const normStatus = status ? status.toLowerCase() : "";
    let nodeCreatedAt = node.created_at ? new Date(node.created_at).getTime() : lastSyncTime;
    let nodeShippingStartedAt = node.shipping_started_at ? new Date(node.shipping_started_at).getTime() : lastSyncTime;

    if (normStatus === "activating") {
      const activationTime = nodeCreatedAt + 120000;
      if (now >= activationTime) {
        status = "online";
        nodesChanged = true;
        const miningStart = Math.max(lastSyncTime, activationTime);
        const miningDurationSec = Math.max(0, (now - miningStart) / 1000);
        const baseRate = getRate(node.productName);
        const nodeYield = node.hosting_type === "remote" ? baseRate * 0.85 : baseRate;
        totalEarnings += nodeYield * multiplier * miningDurationSec;
      }
    } else if (normStatus === "shipping") {
      const deliveryTime = nodeShippingStartedAt + 30000;
      if (now >= deliveryTime) {
        status = "delivered";
        nodesChanged = true;
      }
    } else if (normStatus === "online") {
      const miningStart = lastSyncTime;
      const miningDurationSec = Math.max(0, (now - miningStart) / 1000);
      const baseRate = getRate(node.productName);
      const nodeYield = node.hosting_type === "remote" ? baseRate * 0.85 : baseRate;
      totalEarnings += nodeYield * multiplier * miningDurationSec;
    }
    if (status !== node.status) {
      return { ...node, status };
    }
    return node;
  });

  return { earnings: totalEarnings, updatedNodes, nodesChanged };
}

export async function syncMiningEarnings(
  token: string | null,
  overclocked: boolean,
  systemActive: boolean
) {
  try {
    if (!token) {
      return { success: false, error: "Authentication token required." };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return { success: false, error: "Unauthorized access token." };
    }

    const userId = user.id;

    // Fetch wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("hot_wallet_balance, updated_at")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: "Wallet not found." };
    }

    // Fetch user's nodes
    const { data: nodesData, error: nodesError } = await supabase
      .from("nodes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (nodesError || !nodesData) {
      return { success: false, error: "Failed to retrieve nodes." };
    }

    const dbNodes = nodesData.map(n => ({
      id: n.id,
      productName: n.product_name,
      hashrate: n.hashrate,
      power: n.power,
      region: n.region,
      status: n.status,
      hosting_type: n.hosting_type || "remote",
      setup_configured: n.setup_configured !== undefined && n.setup_configured !== null ? n.setup_configured : false,
      shipping_address: n.shipping_address || null,
      shipping_started_at: n.shipping_started_at || null,
      created_at: n.created_at
    }));

    // Fetch user's upgrades
    const { data: purchasesData } = await supabase
      .from("purchases")
      .select("product_id")
      .eq("user_id", userId);

    const dbUpgrades = purchasesData ? purchasesData.map((p: any) => p.product_id) : [];

    let currentBalance = parseFloat(String(wallet.hot_wallet_balance || 0));

    // If it's a new account (balance is 0 and no nodes/purchases), give them $100 starting credit
    if (currentBalance === 0 && dbNodes.length === 0 && dbUpgrades.length === 0) {
      currentBalance = 100.00;
      await supabase
        .from("wallets")
        .update({ hot_wallet_balance: 100.00 })
        .eq("user_id", userId);
    }

    const lastSyncTime = wallet.updated_at ? new Date(wallet.updated_at).getTime() : Date.now();
    const now = Date.now();
    const elapsedHours = (now - lastSyncTime) / 3600000;

    // Calculate offline earnings securely
    const { earnings, updatedNodes, nodesChanged } = calculateOfflineEarnings(
      lastSyncTime,
      dbNodes,
      dbUpgrades,
      overclocked,
      systemActive
    );

    const finalBalance = currentBalance + earnings;

    // Persist new balance and sync timestamp securely
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ hot_wallet_balance: finalBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) {
      return { success: false, error: "Failed to update wallet balance." };
    }

    // Persist node status transitions
    if (nodesChanged) {
      for (const n of updatedNodes) {
        const oldNode = dbNodes.find(dn => dn.id === n.id);
        if (oldNode && oldNode.status !== n.status) {
          await supabase
            .from("nodes")
            .update({ status: n.status })
            .eq("id", n.id)
            .eq("user_id", userId);
        }
      }
    }

    return {
      success: true,
      earnings,
      elapsedHours,
      updatedNodes,
      nodesChanged,
      newBalance: finalBalance
    };
  } catch (err: any) {
    console.error("Server Action Exception:", err);
    return { success: false, error: err.message };
  }
}
