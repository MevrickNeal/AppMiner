"use client";

const COINS = [
  { symbol: "BTC", name: "Bitcoin", price: "$52,430.21", change: "+2.4%" },
  { symbol: "DOGE", name: "Dogecoin", price: "$0.0842", change: "+5.1%" },
  { symbol: "ETH", name: "Ethereum", price: "$2,840.15", change: "-0.4%" },
  { symbol: "LTC", name: "Litecoin", price: "$72.10", change: "+1.2%" },
];

export default function CryptoTicker() {
  const tickerItems = [...COINS, ...COINS, ...COINS, ...COINS]; // duplicate for seamless loop

  return (
    <div className="bg-black py-4 border-y border-white/10 overflow-hidden flex w-full relative">
      <div className="flex whitespace-nowrap items-center ticker-track w-max">
        {tickerItems.map((coin, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {coin.symbol[0]}
            </span>
            <span className="text-white font-black text-xs uppercase tracking-widest">{coin.name}</span>
            <span className="text-gray-400 font-mono text-xs">{coin.price}</span>
            <span className={`font-bold text-[10px] ${coin.change.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>
              {coin.change}
            </span>
            <div className="w-1 h-1 bg-gray-700 rounded-full mx-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
