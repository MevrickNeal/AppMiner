"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const totalFrames = 240;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Eagerly preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${num}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= 3) {
          setReady(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = images[Math.floor(index)];
    if (!img || !img.complete) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // object-fit: contain logic
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (ready) {
      draw(latest);
    }
  });

  // Initial draw and handle resize
  useEffect(() => {
    if (ready) {
      draw(frameIndex.get());
      const handleResize = () => draw(frameIndex.get());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [ready]);

  // Caption 1: 10% - 30%
  const caption1Opacity = useTransform(scrollYProgress, [0.05, 0.1, 0.25, 0.3], [0, 1, 1, 0]);
  const caption1Y = useTransform(scrollYProgress, [0.05, 0.15], [50, 0]);

  // Caption 2: 40% - 60%
  const caption2Opacity = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0]);
  const caption2Y = useTransform(scrollYProgress, [0.35, 0.45], [50, 0]);

  // Caption 3: 70% - 90%
  const caption3Opacity = useTransform(scrollYProgress, [0.65, 0.7, 0.85, 0.9], [0, 1, 1, 0]);
  const caption3Y = useTransform(scrollYProgress, [0.65, 0.75], [50, 0]);

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Captions Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center lg:justify-start lg:pl-32">
          
          <motion.div 
            style={{ opacity: caption1Opacity, y: caption1Y }}
            className="absolute bento-card-light p-8 max-w-sm"
          >
            <h3 className="text-2xl font-black text-black mb-2 tracking-tighter">Precision Engineering</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">Every component is machined to sub-millimeter tolerances, ensuring maximum thermal dissipation and continuous peak performance.</p>
          </motion.div>

          <motion.div 
            style={{ opacity: caption2Opacity, y: caption2Y }}
            className="absolute bento-card-light p-8 max-w-sm lg:left-auto lg:right-32"
          >
            <h3 className="text-2xl font-black text-black mb-2 tracking-tighter">Quantum Hashrate</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">Our proprietary ASICs break the boundaries of conventional silicon, delivering up to 200 TH/s while maintaining 15 J/TH efficiency.</p>
          </motion.div>

          <motion.div 
            style={{ opacity: caption3Opacity, y: caption3Y }}
            className="absolute bento-card-light p-8 max-w-sm"
          >
            <h3 className="text-2xl font-black text-black mb-2 tracking-tighter">Immutable Architecture</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">Directly integrated with cold storage protocols, ensuring your mined assets are instantly secured offline without intermediate pool risk.</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
