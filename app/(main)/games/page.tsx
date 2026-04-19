"use client";

import React, { useState } from "react";
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

export default function GamesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter">
      <Navbar />
      
      {/* PAGE HEADER */}
      <section style={{ backgroundColor: '#0a0f1e', padding: '120px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            color: '#ffd700', 
            fontFamily: 'Orbitron', 
            fontSize: '11px', 
            letterSpacing: '3px', 
            textTransform: 'uppercase', 
            marginBottom: '8px' 
          }}>
            CATALOGUE
          </div>
          <h1 style={{ 
            color: '#ffffff', 
            fontFamily: 'Orbitron', 
            fontSize: '36px', 
            fontWeight: 700,
            margin: 0
          }}>
            All Games
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontFamily: 'Inter', 
            fontSize: '14px', 
            marginTop: '8px',
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0
          }}>
            Top up credits and buy accounts for your favorite games.
          </p>
          
          {/* Stats Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 700 }}>1</span>
              <span style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Game Available</span>
            </div>
            
            <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} color="#22c55e" />
              <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '13px', fontWeight: 500 }}>Instant Delivery</span>
            </div>
            
            <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={14} color="#ffd700" />
              <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '13px', fontWeight: 500 }}>Secure Payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <section style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '24px' 
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
              size={18} 
              color="#334155" 
            />
            <input 
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1120',
                border: '1px solid rgba(255,215,0,0.1)',
                borderRadius: '10px',
                padding: '12px 16px 12px 44px',
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'TOP UP', 'ACCOUNTS'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  backgroundColor: filter === t ? '#ffd700' : 'transparent',
                  color: filter === t ? '#050810' : '#64748b',
                  border: filter === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '6px 18px',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  fontWeight: filter === t ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* GAMES GRID */}
        <div style={{ marginTop: '32px' }}>
          {/* MLBB GAME CARD */}
          {(filter === 'ALL' || filter === 'TOP UP') && (
            <div 
              onClick={() => router.push('/games/mobile-legends/topup')}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,215,0,0.15)',
                height: '240px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              className="group"
            >
              {/* Background Image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: "url('/assets/games/mlbb/bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                transition: 'transform 0.5s ease'
              }} className="group-hover:scale-105" />
              
              {/* Dark Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(5,8,16,0.92) 0%, rgba(5,8,16,0.7) 50%, rgba(5,8,16,0.2) 100%)'
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1, padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <img 
                  src="/assets/games/mlbb/logo.png" 
                  alt="MLBB" 
                  style={{ width: '48px', height: '48px', borderRadius: '10px', marginBottom: '12px' }} 
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: 700, margin: 0 }}>
                    Mobile Legends Bang Bang
                  </h2>
                  <span style={{ 
                    color: '#ffd700', 
                    fontFamily: 'Inter', 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    backgroundColor: 'rgba(255,215,0,0.1)', 
                    borderRadius: '4px', 
                    padding: '3px 8px' 
                  }}>
                    MOBA
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>
                    ACTIVE
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button style={{
                    backgroundColor: '#ffd700',
                    color: '#050810',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Zap size={14} />
                    Top Up
                  </button>

                  <div style={{ position: 'relative' }} className="group/btn">
                    <button 
                      disabled
                      style={{
                        backgroundColor: 'transparent',
                        color: '#64748b',
                        fontFamily: 'Inter',
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '9px 20px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'not-allowed',
                        opacity: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Package size={14} />
                      Accounts
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      backgroundColor: '#0d1120',
                      color: '#ffffff',
                      fontSize: '10px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s'
                    }} className="group-hover/btn:opacity-100">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMING SOON CARDS GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '16px',
            marginTop: '16px' 
          }}>
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                style={{
                  height: '160px',
                  backgroundColor: '#0d1120',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Gamepad2 size={28} color="#1e2535" />
                <div style={{ color: '#1e2535', fontFamily: 'Inter', fontSize: '13px', fontWeight: 600 }}>
                  Coming Soon
                </div>
                <div style={{ color: '#0f1520', fontFamily: 'Inter', fontSize: '11px' }}>
                  New title
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM NOTE */}
          <div style={{ 
            color: '#334155', 
            fontFamily: 'Inter', 
            fontSize: '13px', 
            textAlign: 'center', 
            marginTop: '32px', 
            marginBottom: '32px' 
          }}>
            More games are added regularly. Follow us for updates.
          </div>
        </div>
      </section>
      
      <MobileBottomNav />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
