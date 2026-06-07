"use client";

import { useEffect, useState } from "react";
import { Package, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrderHistoryView() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setPurchases(data);
      setLoading(false);
    }
    loadPurchases();
  }, []);

  if (loading) return <div className="text-gray-500 p-8 text-center">Loading orders...</div>;

  return (
    <div className="glass-card p-8 space-y-6 border border-white/5">
      <h3 className="text-lg font-black uppercase tracking-tight text-white mb-6">Order History & Pre-orders</h3>
      
      {purchases.length === 0 ? (
        <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
          <Package className="mx-auto mb-3 text-gray-500" size={32} />
          <p className="text-gray-400 font-medium">No purchase history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((p) => {
            const isPreorder = p.status === "pending" || p.is_preorder;
            const displayName = p.product_name || p.device_type || "Unknown Device";
            const displayPrice = p.price_paid ? `$${Number(p.price_paid).toLocaleString()}` : "—";
            
            return (
              <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPreorder ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {isPreorder ? <Clock size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{displayName}</h4>
                    <p className="text-xs text-gray-400 mt-1">Order ID: <span className="font-mono text-gray-500">{p.id.split('-')[0]}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#00f2ff]">{displayPrice}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block ${
                    isPreorder ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {isPreorder ? "Pre-ordered (Shipping Soon)" : "Active"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
