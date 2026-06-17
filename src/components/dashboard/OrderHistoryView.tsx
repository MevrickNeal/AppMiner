"use client";

import { useEffect, useState } from "react";
import { Package, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface OrderHistoryViewProps {
  onNavigateToMining?: () => void;
}

export default function OrderHistoryView({ onNavigateToMining }: OrderHistoryViewProps) {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [purchasesRes, nodesRes] = await Promise.all([
        supabase
          .from("purchases")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("nodes")
          .select("*")
          .eq("user_id", session.user.id)
      ]);

      if (purchasesRes.data) setPurchases(purchasesRes.data);
      if (nodesRes.data) setNodes(nodesRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="text-gray-500 p-8 text-center font-mono">Loading orders...</div>;

  return (
    <div className="glass-card p-8 space-y-6 border border-white/5">
      <h3 className="text-lg font-black uppercase tracking-tight text-white mb-6">Order History & Rigs</h3>
      
      {purchases.length === 0 ? (
        <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
          <Package className="mx-auto mb-3 text-gray-500" size={32} />
          <p className="text-gray-400 font-medium">No purchase history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((p) => {
            const associatedNode = nodes.find(n => n.purchase_id === p.id);
            const isPreorder = p.status === "pending" || p.is_preorder;
            const displayName = p.product_name || p.device_type || "Unknown Device";
            const displayPrice = p.price_paid ? `$${Number(p.price_paid).toLocaleString()}` : "—";
            
            // Determine active/action state for nodes
            let badgeText = isPreorder ? "Pre-ordered (Shipping Soon)" : "Active";
            let badgeStyle = isPreorder 
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            
            let actionButton = null;

            if (associatedNode) {
              const status = associatedNode.status ? associatedNode.status.toLowerCase() : "";
              if (status === "pending_setup") {
                badgeText = "Awaiting Deployment";
                badgeStyle = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                actionButton = (
                  <button
                    onClick={onNavigateToMining}
                    className="px-4 py-2 bg-[#60a5fa] hover:bg-[#3b82f6] hover:text-white text-black font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    Deploy Rig <ArrowRight size={10} />
                  </button>
                );
              } else if (status === "shipping") {
                badgeText = "In Transit";
                badgeStyle = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                actionButton = (
                  <button
                    onClick={onNavigateToMining}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    Track shipping <ArrowRight size={10} />
                  </button>
                );
              } else if (status === "delivered") {
                badgeText = "Delivered";
                badgeStyle = "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
                actionButton = (
                  <button
                    onClick={onNavigateToMining}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    Activate Node <ArrowRight size={10} />
                  </button>
                );
              } else if (status === "activating" || status === "online" || status === "overclocked") {
                badgeText = "Online & Mining";
                badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5";
              }
            }

            return (
              <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isPreorder ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {isPreorder ? <Clock size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{displayName}</h4>
                    <p className="text-xs text-gray-400 mt-1">Order ID: <span className="font-mono text-gray-500">{p.id.split('-')[0]}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="text-right">
                    <div className="text-sm font-black text-[#60a5fa]">{displayPrice}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 px-2.5 py-0.5 rounded-full border inline-block ${badgeStyle}`}>
                      {badgeText === "Online & Mining" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                      )}
                      {badgeText}
                    </div>
                  </div>
                  {actionButton}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
