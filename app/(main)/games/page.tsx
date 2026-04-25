"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Zap, 
  Shield, 
  Package, 
  Gamepad2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const containerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.07 } }
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
}

export default function GamesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reseller/auth/me')
      .then(async r => {
        if (r.ok) {
          const data = await r.json()
          setUser(data)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [router])

  const [hovered, setHovered] = useState(false)

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter overflow-hidden">
      <Navbar />
      
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* PAGE HEADER */}
        <section className="relative bg-[#0a0f1e] pt-32 pb-10 px-4 md:px-6 overflow-hidden">
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            pointerEvents: 'none',
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              CATALOGUE
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '32px', fontWeight: '700', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
              All Games
            </h1>
            <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '14px', marginTop: '8px' }}>
              Top up credits for your favorite games instantly.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-8 mt-8">
              <div className="flex flex-col pr-8 border-r border-white/5">
                <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                  1
                </div>
                <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>
                  Game Available
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(34,197,94,0.1)',
                }}>
                  <Zap size={16} color="#22c55e" />
                </div>
                <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Instant Delivery</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                  border: '1px solid rgba(255,215,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255,215,0,0.1)',
                }}>
                  <Shield size={16} color="#ffd700" />
                </div>
                <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Secure Payments</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTER BAR */}
        <section className="py-8 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#334155]" 
                size={18} 
              />
              <input 
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d1120',
                  border: '1px solid rgba(255,215,0,0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px 12px 44px',
                  color: '#ffffff',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,215,0,0.3)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,215,0,0.1)'}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {['ALL', 'TOP UP'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '99px',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: '700',
                    transition: 'all 0.2s ease',
                    border: '1px solid',
                    backgroundColor: filter === t ? '#ffd700' : 'transparent',
                    color: filter === t ? '#050810' : '#64748b',
                    borderColor: filter === t ? 'transparent' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== t) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== t) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* GAMES GRID */}
          <motion.div 
            className="mt-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* MLBB GAME CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div 
                variants={cardVariants}
                onClick={() => router.push('/games/mobile-legends/topup')}
                style={{
                  background: '#0d1120',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: 0,
                  boxShadow: hovered 
                    ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.15)' 
                    : '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '240px',
                  cursor: 'pointer',
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={e => e.currentTarget.style.transform = 'translateY(-2px) scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)',
                  zIndex: 20
                }} />

                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    backgroundImage: "url('/assets/games/mlbb/bg.jpg')",
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/95 via-[#050810]/80 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-center">
                  <img 
                    src="/assets/games/mlbb/logo.png" 
                    alt="MLBB" 
                    style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px' }}
                  />
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '1px', margin: 0, textTransform: 'uppercase', fontStyle: 'italic' }}>
                      Mobile Legends
                    </h2>
                    <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: '4px', padding: '4px 8px' }}>
                      MOBA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      ACTIVE
                    </span>
                  </div>

                  <div className="mt-6">
                    <button style={{ 
                      backgroundColor: '#ffd700', 
                      color: '#050810', 
                      fontFamily: 'Inter', 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      padding: '10px 24px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      transition: 'all 0.15s ease',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <Zap size={14} />
                      Top Up
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </motion.div>
      
      <MobileBottomNav />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
