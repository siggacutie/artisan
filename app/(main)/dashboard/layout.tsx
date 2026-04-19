"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  Package, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  ChevronRight,
  Loader2,
  Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch('/api/dashboard/summary')
      .then(r => r.json())
      .then(s => {
        setSummary(s);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  }, [session]);

  const navItems = [
    { id: "wallet", label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
    { id: "orders", label: "Orders", icon: Package, href: "/dashboard/orders" },
    { id: "profile", label: "Profile", icon: Settings, href: "/dashboard/profile" },
    { id: "membership", label: "Membership", icon: Shield, href: "/membership" },
  ];

  const activeTab = navItems.find(item => pathname.startsWith(item.href))?.id || "wallet";

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter pb-24 md:pb-0">
      <Navbar />
      
      <div className="flex pt-20 h-screen overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:flex flex-col w-[260px] bg-[#0d1120] border-r border-[rgba(255,215,0,0.08)] h-full overflow-y-auto shrink-0">
          <div className="p-8 pb-4 space-y-4">
            <div className="flex flex-col space-y-0.5 text-left">
              <h3 className="text-white font-bold font-orbitron text-sm">{session?.user?.name ?? 'Player'}</h3>
              <p className="text-gray-400 text-[10px]">{session?.user?.email}</p>
              <div className="flex items-center space-x-1.5 mt-2 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 w-fit">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <nav className="space-y-0.5 pt-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id 
                      ? "bg-[rgba(255,215,0,0.08)] text-gold border-l-2 border-gold" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-gold" : "text-gray-400"}`} />
                  <span className="text-[11px] font-bold font-rajdhani uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-500 hover:text-red-500 transition-all duration-200 group text-[11px] font-bold uppercase tracking-widest font-rajdhani"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-[#050810] relative">
          <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8">
            {/* Mobile Header & Tabs */}
            <div className="md:hidden space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-orbitron text-white">My Dashboard</h1>
                  <p className="text-gray-500 text-xs mt-1">Welcome back, {session?.user?.name?.split(' ')[0] ?? 'Player'}</p>
                </div>
                <Avatar className="w-10 h-10 border border-gold/20">
                  <AvatarImage src={session?.user?.image ?? ''} />
                  <AvatarFallback className="bg-gold/10 text-gold font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`px-6 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === item.id 
                        ? "bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.2)]" 
                        : "bg-[#0d1120] text-gray-400 border border-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-fast {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
