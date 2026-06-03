// src/app/page.tsx — PUBLIC homepage (no auth required)
import HeroIntro         from "@/components/HeroIntro";
import HeroSection       from "@/components/HeroSection";
import CryptoTicker      from "@/components/CryptoTicker";
import HardwareCatalog   from "@/components/HardwareCatalog";
import Features          from "@/components/Features";
import MiningDashboard   from "@/components/MiningDashboard";
import CryptoServices    from "@/components/CryptoServices";
import LiveClusterTicker from "@/components/LiveClusterTicker";
import Footer            from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Light zone ──────────────────────────── */}
      <HeroIntro />
      <HeroSection />

      {/* ── Dark zone ───────────────────────────── */}
      <CryptoTicker />
      <HardwareCatalog />
      <Features />
      <MiningDashboard />
      {/* WalletServices is gated behind /dashboard — login required */}
      <CryptoServices />
      <LiveClusterTicker />
      <Footer />
    </main>
  );
}
