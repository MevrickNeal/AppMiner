"use client";

import { useEffect, useState } from "react";

const DEFAULT_COINS = [
  { symbol: "BTC", name: "Bitcoin",  price: 64250, change: "+2.4%" },
  { symbol: "ETH",  name: "Ethereum", price: 3450,  change: "-0.4%" },
  { symbol: "LTC",  name: "Litecoin", price: 85.2,  change: "+1.2%" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.12,  change: "+5.1%" },
];

export default function CryptoTicker() {
  const [coins, setCoins] = useState(DEFAULT_COINS);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,dogecoin&vs_currencies=usd&include_24hr_change=true");
        const data = await res.json();
        if (data) {
          const updated = [
            {
              symbol: "BTC",
              name: "Bitcoin",
              price: data.bitcoin?.usd || 64250,
              change: (data.bitcoin?.usd_24h_change >= 0 ? "+" : "") + (data.bitcoin?.usd_24h_change?.toFixed(2) || "2.40") + "%"
            },
            {
              symbol: "ETH",
              name: "Ethereum",
              price: data.ethereum?.usd || 3450,
              change: (data.ethereum?.usd_24h_change >= 0 ? "+" : "") + (data.ethereum?.usd_24h_change?.toFixed(2) || "-0.40") + "%"
            },
            {
              symbol: "LTC",
              name: "Litecoin",
              price: data.litecoin?.usd || 85.2,
              change: (data.litecoin?.usd_24h_change >= 0 ? "+" : "") + (data.litecoin?.usd_24h_change?.toFixed(2) || "1.20") + "%"
            },
            {
              symbol: "DOGE",
              name: "Dogecoin",
              price: data.dogecoin?.usd || 0.12,
              change: (data.dogecoin?.usd_24h_change >= 0 ? "+" : "") + (data.dogecoin?.usd_24h_change?.toFixed(2) || "5.10") + "%"
            }
          ];
          setCoins(updated);
        }
      } catch (e) {
        console.warn("CoinGecko ticker load failed, using local rates", e);
      }
    }
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [...coins, ...coins, ...coins, ...coins];

  return (
    <div className="bg-[#050505] py-4 border-y border-white/8 overflow-hidden flex w-full relative">
      <div className="flex whitespace-nowrap items-center ticker-track w-max">
        {tickerItems.map((coin, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <span className="w-7 h-7 rounded-full bg-[#00f2ff]/15 flex items-center justify-center text-[#00f2ff] font-black text-xs">
              {coin.symbol[0]}
            </span>
            <span className="text-white font-black text-xs uppercase tracking-widest">{coin.name}</span>
            <span className="text-gray-400 font-bold text-xs">
              ${typeof coin.price === "number" ? coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 }) : coin.price} USD
            </span>
            <span
              className={`font-bold text-[10px] ${
                coin.change.startsWith("+") ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {coin.change}
            </span>
            <div className="w-1 h-1 bg-white/20 rounded-full mx-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
