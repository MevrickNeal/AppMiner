"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Zap, ShieldCheck, Flame, Cpu, CheckCircle, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ShopItem = {
  id: string;
  name: string;
  category: "upgrade" | "merch";
  price: number;
  description: string;
  detail: string;
  icon: any;
  effect?: string;
};

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "overclock-license",
    name: "Stratum Overclock License",
    category: "upgrade",
    price: 40.00,
    description: "Safely unlock a permanent +10% hashrate performance boost on all your active mining hardware.",
    detail: "Permits stratum firmware modifications to increase hash frequency.",
    icon: Flame,
    effect: "+10% Hashing Power"
  },
  {
    id: "cooling-booster",
    name: "Liquid Cooling Booster",
    category: "upgrade",
    price: 60.00,
    description: "Upgrade your virtual mining cluster configuration with high-flow liquid cooling loops.",
    detail: "Decreases simulated hardware thermal throttling by 15%.",
    icon: Cpu,
    effect: "+15% Thermal Efficiency"
  },
  {
    id: "vip-firmware",
    name: "VIP Beta Firmware Access",
    category: "upgrade",
    price: 80.00,
    description: "Gain exclusive access to experimental beta firmware builds with cutting-edge optimization algorithms.",
    detail: "Early access builds with advanced block-solving heuristics.",
    icon: Zap,
    effect: "Early Release Builds"
  },
  {
    id: "geothermal-lease",
    name: "Reykjavik Geothermal Contract",
    category: "upgrade",
    price: 75.00,
    description: "Lease geothermal power lines in Reykjavik to reduce remote node hosting fees to 5%.",
    detail: "Bypasses default municipal grid overhead.",
    icon: Flame,
    effect: "5% Remote Hosting Fee"
  },
  {
    id: "hydro-lease",
    name: "Luleå Hydro-Power Contract",
    category: "upgrade",
    price: 60.00,
    description: "Lease clean hydro-electric power in Luleå to reduce remote node hosting fees to 8%.",
    detail: "Harnesses turbine grid infrastructure.",
    icon: Zap,
    effect: "8% Remote Hosting Fee"
  },
  {
    id: "wind-lease",
    name: "Helsinki Wind Grid Lease",
    category: "upgrade",
    price: 45.00,
    description: "Secure wind energy quotas in Helsinki to reduce remote node hosting fees to 10%.",
    detail: "Leverages regional offshore wind generation.",
    icon: Cpu,
    effect: "10% Remote Hosting Fee"
  },
  {
    id: "merch-stickers",
    name: "AppsMiners Decal Pack",
    category: "merch",
    price: 10.00,
    description: "High-durability, holographic vinyl stickers featuring the official AppsMiners brand logo.",
    detail: "Shipped directly to your operator address.",
    icon: Package,
    effect: "Physical Merchandise"
  },
  {
    id: "merch-hat",
    name: "Cyberpunk Operator Hat",
    category: "merch",
    price: 25.00,
    description: "Classic snapback featuring the embroidered AppsMiners blue icon and reflective trims.",
    detail: "Structured design with cyber-mesh ventilation.",
    icon: ShieldCheck,
    effect: "Physical Merchandise"
  },
  {
    id: "merch-hoodie",
    name: "Heavyweight Tech Hoodie",
    category: "merch",
    price: 55.00,
    description: "Ultra-comfortable double-knit heavyweight hoodie with custom pockets for hardware accessories.",
    detail: "Premium 400 GSM brushed fleece cotton.",
    icon: ShoppingBag,
    effect: "Physical Merchandise"
  }
];

export default function ShopView({
  usdBalance,
  setUsdBalance,
  onPurchaseSuccess
}: {
  usdBalance: number;
  setUsdBalance: React.Dispatch<React.SetStateAction<number>>;
  onPurchaseSuccess?: () => void;
}) {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  useEffect(() => {
    async function loadOwnedItems() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("purchases")
          .select("product_id")
          .eq("user_id", session.user.id);
        if (data) {
          setOwnedItems(data.map((p: any) => p.product_id));
        }
      }
    }
    loadOwnedItems();
  }, [successId]);

  const handleBuyItem = async (item: ShopItem) => {
    if (usdBalance < item.price) {
      alert(`Insufficient balance to purchase ${item.name}. Keep mining to earn more credits!`);
      return;
    }

    if (ownedItems.includes(item.id) && item.category === "upgrade") {
      alert(`You already own the ${item.name} upgrade.`);
      return;
    }

    setPurchasingId(item.id);

    try {
      const newBalance = usdBalance - item.price;
      
      // Update local balance
      setUsdBalance(newBalance);
      localStorage.setItem("appsminers_usd_balance", newBalance.toFixed(2));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session found");

      // Update wallet balance in database
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ hot_wallet_balance: newBalance })
        .eq("user_id", session.user.id);
      
      if (walletError) throw walletError;

      // Insert purchase transaction
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: session.user.id,
          product_id: item.id,
          product_name: item.name,
          price_paid: item.price,
          status: "completed"
        });
      
      if (purchaseError) throw purchaseError;

      setSuccessId(item.id);
      setTimeout(() => {
        setSuccessId(null);
        if (onPurchaseSuccess) onPurchaseSuccess();
      }, 3000);

    } catch (err: any) {
      console.error(err);
      alert("Purchase failed: " + err.message);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="glass-card p-8 border border-white/5 space-y-8">
      <div>
        <h3 className="text-xl font-black uppercase tracking-tight text-white">Upgrade & Merchandise Store</h3>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
          Spend your earned mining credits on network boosts and exclusive merchandise.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
          const Icon = item.icon;
          const isPurchasing = purchasingId === item.id;
          const isSuccess = successId === item.id;
          const isOwnedUpgrade = ownedItems.includes(item.id) && item.category === "upgrade";

          return (
            <div 
              key={item.id} 
              className={`p-6 bg-white/5 border rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-all hover:scale-[1.02] relative overflow-hidden group ${
                isOwnedUpgrade ? "border-[#60a5fa]/20 bg-[#60a5fa]/3" : "border-white/10"
              }`}
            >
              {/* Overlay for success state */}
              {isSuccess && (
                <div className="absolute inset-0 bg-[#060d1f]/95 z-10 flex flex-col items-center justify-center p-4">
                  <CheckCircle size={36} className="text-[#60a5fa] animate-bounce mb-2" />
                  <p className="text-xs font-black uppercase tracking-widest text-[#60a5fa]">Order Confirmed!</p>
                  <p className="text-[10px] text-gray-400 mt-1 text-center font-bold">Credits deducted successfully.</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#60a5fa] group-hover:bg-[#60a5fa]/10 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    {item.effect}
                  </span>
                </div>

                <h4 className="text-base font-black text-white">{item.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mt-2">{item.description}</p>
                <p className="text-[10px] text-gray-500 font-medium italic mt-3">{item.detail}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Price</p>
                  <p className="text-lg font-black text-[#60a5fa]">${item.price.toFixed(2)} USD</p>
                </div>

                <button
                  onClick={() => handleBuyItem(item)}
                  disabled={isPurchasing || isOwnedUpgrade}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-[1.03] ${
                    isOwnedUpgrade 
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : isPurchasing 
                        ? "bg-[#60a5fa]/20 text-[#60a5fa] cursor-wait"
                        : "bg-[#60a5fa] text-black hover:bg-[#3b82f6] hover:text-white active:scale-[0.98]"
                  }`}
                >
                  {isOwnedUpgrade ? "Owned" : isPurchasing ? "Buying..." : "Purchase"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs text-gray-500">
        <AlertCircle size={16} className="text-[#60a5fa] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-400 block mb-0.5">Operator Note</span>
          Physical merchandise purchases are simulated demo orders. Upgrades are applied instantly and modify active mining efficiency calculations dynamically.
        </div>
      </div>
    </div>
  );
}
