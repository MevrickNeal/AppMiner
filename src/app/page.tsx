// src/app/page.tsx
import HeroIntro from "@/components/HeroIntro";
import HeroSection from "@/components/HeroSection";
import CryptoTicker from "@/components/CryptoTicker";
import HardwareCatalog from "@/components/HardwareCatalog";
import Features from "@/components/Features";
import LiveClusterTicker from "@/components/LiveClusterTicker";
import CryptoServices from "@/components/CryptoServices";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroIntro />
      <HeroSection />
      <CryptoTicker />
      <HardwareCatalog />
      <Features />
      <CryptoServices />
      <LiveClusterTicker />
    </main>
  );
}
