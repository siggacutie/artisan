"use client";

import React from "react";

interface IconProps {
  className?: string;
  glow?: boolean;
}

export const DiamondSVG = ({ className = "w-full h-full", glow = true }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="diamond-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00c3ff" />
        <stop offset="50%" stopColor="#0088ff" />
        <stop offset="100%" stopColor="#0044cc" />
      </linearGradient>
      <filter id="diamond-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path 
      d="M50 5L90 35L50 95L10 35L50 5Z" 
      fill="url(#diamond-grad)" 
      filter={glow ? "url(#diamond-glow)" : ""}
      stroke="#00c3ff"
      strokeWidth="1"
    />
    <path d="M50 5L50 95" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
    <path d="M10 35L90 35" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
    <path d="M50 5L90 35L50 35L10 35L50 5Z" fill="white" fillOpacity="0.1" />
  </svg>
);

interface RankBadgeProps {
  type?: "Epic" | "Legend" | "Mythic" | string;
  className?: string;
}

export const RankBadgeSVG = ({ type = "Mythic", className = "w-12 h-12" }: RankBadgeProps) => {
  const configs: Record<string, { color: string; icon: string }> = {
    Epic: { color: "#7B2FBE", icon: "M50 20 L30 50 L50 80 L70 50 Z" },
    Legend: { color: "#C8962E", icon: "M50 15 L60 40 L85 40 L65 55 L75 80 L50 65 L25 80 L35 55 L15 40 L40 40 Z" },
    Mythic: { color: "#C0392B", icon: "M50 10 C60 30 80 40 80 60 C80 80 65 90 50 90 C35 90 20 80 20 60 C20 40 40 30 50 10 Z" },
    "Mythical Glory": { color: "#1e1b4b", icon: "M50 5 L65 25 L85 25 L75 45 L85 65 L65 65 L50 85 L35 65 L15 65 L25 45 L15 25 L35 25 Z" }
  };
  const config = configs[type] || configs.Mythic;

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id={`rank-grad-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={config.color} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle cx="50%" cy="50%" r="45%" fill={`url(#rank-grad-${type})`} stroke={config.color} strokeWidth="2" />
      <path d={config.icon} fill="white" />
    </svg>
  );
};

export const Icons = {
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
}

interface HexagonProps {
  children: React.ReactNode;
  className?: string;
}

export const HexagonIcon = ({ children, className = "" }: HexagonProps) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
      <path 
        d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
        fill="transparent" 
        stroke="#ffd700" 
        strokeWidth="2"
      />
    </svg>
    <div className="relative z-10 text-gold">{children}</div>
  </div>
);
