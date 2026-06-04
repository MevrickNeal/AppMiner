"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t, isRtl } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const totalFrames = 240;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // ── Draw a single frame onto the canvas ──────────────────
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[Math.floor(index)];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // object-fit: contain
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.min(hRatio, vRatio);
    const cx = (canvas.width - img.naturalWidth * ratio) / 2;
    const cy = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, cx, cy, img.naturalWidth * ratio, img.naturalHeight * ratio);
  }, []);

  // ── Set canvas size (only on mount + resize, NOT inside draw) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(frameIndex.get());
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ready, draw, frameIndex]);

  // ── Preload all frames ────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${num}.png`;
      img.onload = () => {
        loadedCount++;
        // Show animation as soon as first few frames are ready
        if (loadedCount === 3) setReady(true);
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  // ── Redraw on scroll ─────────────────────────────────────
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (ready) draw(latest);
  });

  // ── Initial draw when ready ───────────────────────────────
  useEffect(() => {
    if (ready) draw(frameIndex.get());
  }, [ready, draw, frameIndex]);

  // ── Caption scroll-linked visibility ─────────────────────
  const cap1Opacity = useTransform(scrollYProgress, [0.05, 0.12, 0.27, 0.33], [0, 1, 1, 0]);
  const cap1Y      = useTransform(scrollYProgress, [0.05, 0.15], [40, 0]);

  const cap2Opacity = useTransform(scrollYProgress, [0.38, 0.44, 0.57, 0.63], [0, 1, 1, 0]);
  const cap2Y      = useTransform(scrollYProgress, [0.38, 0.48], [40, 0]);

  const cap3Opacity = useTransform(scrollYProgress, [0.67, 0.73, 0.87, 0.93], [0, 1, 1, 0]);
  const cap3Y      = useTransform(scrollYProgress, [0.67, 0.77], [40, 0]);

  return (
    // ── The tall scroll container ─────────────────────────
    // Starts on the off-white hero, transitions to dark at the bottom
    <div ref={containerRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Seamless gradient background ────────────────
            Top = off-white (matching HeroIntro)
            Bottom = site dark (#080808)                    */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa] via-[#c0c0c0] to-[#080808]" />

        {/* ── Canvas — no blend mode, it sits on gradient ─ */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* ── Gradient fade into dark at bottom ───────────
            Ensures clean blend into the dark catalog below */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-[#080808]" />

        {/* ── Caption overlays ─────────────────────────── */}
        {/* Caption 1 – lower-left */}
        <motion.div
          style={{ opacity: cap1Opacity, y: cap1Y }}
          className="pointer-events-none absolute left-8 lg:left-20 bottom-[30%] glass-panel rounded-3xl p-6 lg:p-8 max-w-xs lg:max-w-sm"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <h3 className="text-xl lg:text-2xl font-black text-black mb-2 tracking-tighter">{t("heroSecTitle1")}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{t("heroSecDesc1")}</p>
        </motion.div>

        {/* Caption 2 – upper-right */}
        <motion.div
          style={{ opacity: cap2Opacity, y: cap2Y }}
          className="pointer-events-none absolute right-8 lg:right-20 top-[25%] glass-panel rounded-3xl p-6 lg:p-8 max-w-xs lg:max-w-sm"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <h3 className="text-xl lg:text-2xl font-black text-black mb-2 tracking-tighter">{t("heroSecTitle2")}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{t("heroSecDesc2")}</p>
        </motion.div>

        {/* Caption 3 – lower-right */}
        <motion.div
          style={{ opacity: cap3Opacity, y: cap3Y }}
          className="pointer-events-none absolute right-8 lg:right-20 bottom-[25%] glass-panel rounded-3xl p-6 lg:p-8 max-w-xs lg:max-w-sm"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <h3 className="text-xl lg:text-2xl font-black text-black mb-2 tracking-tighter">{t("heroSecTitle3")}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{t("heroSecDesc3")}</p>
        </motion.div>

      </div>
    </div>
  );
}
