"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GitBranch, MessageCircle, Globe, Mail, ArrowUpRight, Zap } from "lucide-react";

const NAV_COLS = [
  {
    title: "Products",
    links: ["T200 Pro", "F100 Pro", "F50 Pro", "Appsminer Mini", "Appsminer Nano", "Appsminer Pocket"],
  },
  {
    title: "Services",
    links: ["Mining Pool", "Trading House", "Hot Wallet", "Cold Storage", "API Access"],
  },
  {
    title: "Company",
    links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
  },
];

const SOCIALS = [
  { icon: MessageCircle, href: "#", label: "Twitter/X"  },
  { icon: GitBranch,     href: "#", label: "GitHub"     },
  { icon: Globe,         href: "#", label: "LinkedIn"   },
  { icon: Mail,          href: "#", label: "Email"      },
];

const STATS = [
  { value: "200+",    label: "Countries Served" },
  { value: "$1.2B+",  label: "Assets Secured" },
  { value: "99.9%",   label: "Uptime SLA" },
  { value: "24/7",    label: "Expert Support" },
];

export default function Footer() {
  return (
    <footer className="bg-[#030303] text-white border-t border-white/5">

      {/* ── CTA Band ───────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-3">
              Ready to Mine<br />
              <span className="text-gray-600">At Scale?</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Join 14,000+ miners already running on AppsMiner infrastructure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#00f2ff] transition-colors"
            >
              Get Started <ArrowUpRight size={14} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 glass-card-dark rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 hover:border-white/30 transition-colors"
            >
              Book a Demo
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Stats Band ─────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer ────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {/* Icon version of logo on dark bg */}
              <div className="relative w-10 h-10 bg-white rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/Products/icon blue.png"
                  alt="AppsMiner icon"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">APPSMINER</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Industrial-grade ASIC mining hardware, institutional trading, and enterprise-level asset security.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  title={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#00f2ff] hover:border-[#00f2ff]/40 transition-colors"
                >
                  <s.icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm font-medium text-gray-500 hover:text-white transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Full logo on white pill */}
          <div className="flex items-center gap-4">
            <div className="relative h-8 w-32 bg-white rounded-lg overflow-hidden">
              <Image
                src="/Products/logo.png"
                alt="AppsMiner"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <span className="text-gray-700 text-xs font-medium">
              © {new Date().getFullYear()} AppsMiner. All rights reserved.
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1">
              <Zap size={10} className="text-[#00f2ff]" /> All Systems Operational
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
