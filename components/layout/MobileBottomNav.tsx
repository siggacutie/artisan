"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Zap, Wallet as WalletIcon, UserCircle, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const role = (session?.user as any)?.role;
  if (!session || role !== "RESELLER") return null;

  const tabs = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <Zap size={20} />, label: "Top Up", href: "/games/mobile-legends/topup" },
    { icon: <WalletIcon size={20} />, label: "Wallet", href: "/wallet/add" },
    { icon: <MessageSquare size={20} />, label: "Support", href: "/contact" },
    { icon: <UserCircle size={20} />, label: "Profile", href: "/dashboard" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 h-[72px] flex items-center justify-around px-4 z-[100] pb-safe">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      {tabs.map((tab, i) => {
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
        
        return (
          <Link 
            key={i} 
            href={tab.href}
            className={`relative flex flex-col items-center justify-center space-y-1 py-1 px-4 rounded-xl transition-all ${isActive ? "text-gold" : "text-zinc-600"}`}
          >
            {isActive && (
              <motion.div 
                layoutId="mobile-active-bg" 
                className="absolute inset-0 bg-gold/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10">{tab.icon}</div>
            <span className="relative z-10 text-[8px] font-bold uppercase tracking-tight">{tab.label}</span>
            {isActive && (
              <motion.div 
                layoutId="mobile-dot" 
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};
