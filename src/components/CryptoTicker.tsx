"use client";

const COINS = [
  { symbol: "BTC", name: "Bitcoin",  price: "Live Prices",  change: "+2.4%" },
  { symbol: "DOGE", name: "Dogecoin", price: "—",           change: "+5.1%" },
  { symbol: "ETH",  name: "Ethereum", price: "Live Prices", change: "-0.4%" },
  { symbol: "LTC",  name: "Litecoin", price: "—",           change: "+1.2%" },
];

export default function CryptoTicker() {
  const tickerItems = [...COINS, ...COINS, ...COINS, ...COINS];

  return (
    <div className="bg-[#050505] py-4 border-y border-white/8 overflow-hidden flex w-full relative">
      <div className="flex whitespace-nowrap items-center ticker-track w-max">
        {tickerItems.map((coin, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <span className="w-7 h-7 rounded-full bg-[#00f2ff]/15 flex items-center justify-center text-[#00f2ff] font-black text-xs">
              {coin.symbol[0]}
            </span>
            <span className="text-white font-black text-xs uppercase tracking-widest">{coin.name}</span>
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
