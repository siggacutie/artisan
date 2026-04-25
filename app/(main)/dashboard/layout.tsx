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
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch('/api/reseller/auth/me')
      .then(async r => {
        if (r.ok) {
          const data = await r.json()
          setUser(data)
        } else {
          setUser(null)
          router.push('/login')
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [router])

  useEffect(() => {
    if (!user) return;
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
  }, [user]);

  const handleSignOut = async () => {
    await fetch('/api/reseller/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { id: "wallet", label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
    { id: "orders", label: "Orders", icon: Package, href: "/dashboard/orders" },
    { id: "profile", label: "Profile", icon: Settings, href: "/dashboard/profile" },
    { id: "membership", label: "Membership", icon: Shield, href: "/membership" },
  ];

  const activeTab = navItems.find(item => pathname.startsWith(item.href))?.id || "wallet";

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter pb-24 md:pb-0 overflow-hidden">
      <Navbar />
      
      <div className="flex pt-20 h-screen overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          width: '260px',
          background: '#0d1120',
          borderRight: '1px solid rgba(255,215,0,0.08)',
          height: '100%',
          overflowY: 'auto',
          flexShrink: 0,
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 20
        }} className="hidden md:flex">
          <div className="p-8 pb-4 space-y-6">
            <div className="flex flex-col space-y-2 text-left p-4 bg-white/5 rounded-2xl border border-white/5">
              <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>{user?.name ?? 'Player'}</h3>
              <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '11px' }}>{user?.email}</p>
              <div className="flex items-center space-x-1.5 mt-2 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 w-fit">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified</span>
              </div>
            </div>

            <nav className="space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    backgroundColor: activeTab === item.id ? 'rgba(255,215,0,0.08)' : 'transparent',
                    borderLeft: activeTab === item.id ? '2px solid #ffd700' : '2px solid transparent',
                  }}
                  className={activeTab === item.id ? "text-gold" : "text-white/70 hover:bg-white/5 hover:text-white"}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-gold" : "text-gray-400"}`} />
                  <span style={{ 
                    fontFamily: 'Inter', 
                    fontSize: '11px', 
                    fontWeight: activeTab === item.id ? '700' : '500', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px' 
                  }}>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
            <button 
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: '#64748b',
                transition: 'all 0.2s ease',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <LogOut className="w-4 h-4" />
              <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-[#050810] relative max-w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8 w-full">
            {/* Mobile Header & Tabs */}
            <div className="md:hidden space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '1px' }}>My Dashboard</h1>
                  <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px', marginTop: '4px' }}>Welcome back, {user?.name?.split(' ')[0] ?? 'Player'}</p>
                </div>
                <Avatar className="w-10 h-10 border border-gold/20">
                  <AvatarImage src={user?.image ?? ''} />
                  <AvatarFallback className="bg-gold/10 text-gold font-bold">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '99px',
                      fontFamily: 'Inter',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'all 0.2s ease',
                      backgroundColor: activeTab === item.id ? '#ffd700' : '#0d1120',
                      color: activeTab === item.id ? '#050810' : '#94a3b8',
                      border: activeTab === item.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: activeTab === item.id ? '0 4px 12px rgba(255,215,0,0.2)' : 'none',
                      whiteSpace: 'nowrap',
                      textDecoration: 'none'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
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
