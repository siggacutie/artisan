"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const banners = [
  {
    id: 1,
    label: "MEGA DIAMOND SALE",
    heading: "Double Diamonds\nThis Weekend",
    subtext: "Limited time offer on all MLBB packages",
    ctaText: "SHOP NOW",
    ctaLink: "/games/mobile-legends/topup",
    gradientStart: "#1a0533",
    gradientEnd: "#2d0a4e",
    accentColor: "#c084fc",
    decorativeText: "2X",
  },
  {
    id: 2,
    label: "INSTANT TOP-UP",
    heading: "Diamonds Credited\nIn Under 5 Mins",
    subtext: "Fast, reliable, and secure top-ups for all players",
    ctaText: "TOP UP NOW",
    ctaLink: "/games/mobile-legends/topup",
    gradientStart: "#0a1628",
    gradientEnd: "#0f2347",
    accentColor: "#00c3ff",
    decorativeText: "FAST",
  },
  {
    id: 3,
    label: "ARTISAN WALLET",
    heading: "Get Artisan Coins\nFor Faster Checkout",
    subtext: "Top up your wallet with coins and checkout instantly",
    ctaText: "GET COINS",
    ctaLink: "/wallet/add",
    gradientStart: "#1a1200",
    gradientEnd: "#2d1f00",
    accentColor: "#ffd700",
    decorativeText: "COINS",
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[320px] overflow-hidden bg-[#050810]" style={{ borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
      {/* Noise Texture Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 15,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
        pointerEvents: 'none',
      }} />
      
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center px-6 md:px-16 lg:px-24 h-[320px]",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          style={{
            background: `linear-gradient(to right, ${banner.gradientStart}, ${banner.gradientEnd})`,
          }}
        >
          {/* Subtle Diagonal Light Streak */}
          <div 
            className="absolute top-[-50%] left-[30%] w-[1px] h-[200%] rotate-[25deg] pointer-events-none"
            style={{ 
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)' 
            }}
          />

          {/* Left Side (60%) */}
          <div className="w-full md:w-[60%] z-20 flex flex-col items-start">
            <span 
              className="mb-4 inline-block text-[11px] font-black uppercase tracking-[3px]"
              style={{ color: "#ffd700", fontFamily: "Orbitron" }}
            >
              {banner.label}
            </span>
            <div style={{ borderLeft: '3px solid #ffd700', paddingLeft: '20px' }} className="mb-4">
              <h2 
                className="text-white text-2xl md:text-[48px] font-black leading-[1.1] whitespace-pre-line uppercase tracking-tight"
                style={{ fontFamily: "Orbitron" }}
              >
                {banner.heading}
              </h2>
            </div>
            <p 
              className="text-[#e2e8f0] text-sm md:text-[15px] mb-8 max-w-md line-clamp-1 leading-relaxed"
              style={{ fontFamily: "Inter" }}
            >
              {banner.subtext}
            </p>
            <Link
              href={banner.ctaLink}
              className="bg-[#ffd700] text-[#050810] px-[32px] py-[12px] rounded-[8px] text-[13px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all cursor-pointer border-none shadow-[0_4px_16px_rgba(255,215,0,0.2)]"
              style={{ fontFamily: "Inter" }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1.05)'}
            >
              {banner.ctaText}
            </Link>
          </div>

          {/* Right Side (40%) - Decorative Text */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[40%] flex items-center justify-end pointer-events-none overflow-hidden pr-6 md:pr-16">
            <span 
              className="text-[100px] md:text-[140px] font-black uppercase tracking-tighter opacity-10 select-none leading-none translate-x-1/4 md:translate-x-0"
              style={{ 
                color: banner.accentColor, 
                fontFamily: "Orbitron",
                fontWeight: 900,
                fontStyle: 'italic'
              }}
            >
              {banner.decorativeText}
            </span>
          </div>
        </div>
      ))}

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              i === current ? "bg-[#ffd700]" : "bg-white/30"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
