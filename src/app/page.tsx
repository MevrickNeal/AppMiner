// src/app/page.tsx
import HeroIntro        from "@/components/HeroIntro";
import HeroSection      from "@/components/HeroSection";
import CryptoTicker     from "@/components/CryptoTicker";
import HardwareCatalog  from "@/components/HardwareCatalog";
import Features         from "@/components/Features";
import MiningDashboard  from "@/components/MiningDashboard";
import WalletServices   from "@/components/WalletServices";
import CryptoServices   from "@/components/CryptoServices";
import LiveClusterTicker from "@/components/LiveClusterTicker";
import Footer           from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Light zone ─────────────────────────── */}
      <HeroIntro />
      <HeroSection />

      {/* ── Dark zone ──────────────────────────── */}
      <CryptoTicker />
      <HardwareCatalog />
      <Features />
      <MiningDashboard />
      <WalletServices />
      <CryptoServices />
      <LiveClusterTicker />
      <Footer />
    </main>
  );
}
