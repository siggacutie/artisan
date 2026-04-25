"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Zap, 
  Shield, 
  Gamepad2
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* PAGE HEADER */}
        <section style={{
          position: 'relative',
          background: '#0a0f1e',
          borderRadius: '24px',
          padding: isMobile ? '24px' : '48px',
          marginBottom: '32px',
          overflow: 'hidden',
          border: '1px solid rgba(255,215,0,0.05)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            pointerEvents: 'none',
          }} />
          <div className="relative z-10">
            <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '10px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              CATALOGUE
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
              All Games
            </h1>
            <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: isMobile ? '13px' : '14px', marginTop: '8px' }}>
              Top up credits for your favorite games instantly.
            </p>
            
            {/* Stats Row */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '16px' : '32px',
              marginTop: '32px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', paddingRight: isMobile ? 0 : '32px', borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: isMobile ? '22px' : '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                  1
                </div>
                <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>
                  Game Available
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={16} color="#22c55e" />
                </div>
                <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Instant Delivery</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                  border: '1px solid rgba(255,215,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Shield size={16} color="#ffd700" />
                </div>
                <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Secure Payments</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTER BAR */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
              <Search 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }} 
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
                  padding: '12px 16px 12px 48px',
                  color: '#ffffff',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: isMobile ? '8px' : 0 }}>
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
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* GAMES GRID */}
          <motion.div 
            style={{ marginTop: '32px' }}
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* MLBB GAME CARD */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? '16px' : '24px',
            }}>
              <motion.div 
                variants={cardVariants}
                onClick={() => router.push('/games/mobile-legends/topup')}
                style={{
                  background: '#0d1120',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  boxShadow: hovered 
                    ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.15)' 
                    : '0 4px 32px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: isMobile ? '200px' : '260px',
                  cursor: 'pointer',
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)',
                  zIndex: 20
                }} />

                {/* Background Image */}
                <div 
                  style={{ 
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('/assets/games/mlbb/bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s ease'
                  }}
                />
                
                {/* Dark Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, #050810 0%, #050810 30%, transparent 100%)',
                  opacity: 0.9
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, padding: isMobile ? '20px' : '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <img 
                    src="/assets/games/mlbb/logo.png" 
                    alt="MLBB" 
                    style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '12px' }}
                  />
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '18px' : '24px', fontWeight: '700', letterSpacing: '1px', margin: 0, textTransform: 'uppercase', fontStyle: 'italic' }}>
                      Mobile Legends
                    </h2>
                    <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: '4px', padding: '2px 6px', textTransform: 'uppercase' }}>
                      MOBA
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }} />
                    <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      ACTIVE
                    </span>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <button style={{ 
                      backgroundColor: '#ffd700', 
                      color: '#050810', 
                      fontFamily: 'Inter', 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      padding: '8px 20px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <Zap size={12} />
                      Top Up
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
