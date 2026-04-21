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

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter">
      <Navbar />
      
      {/* PAGE HEADER */}
      <section className="bg-[#0a0f1e] pt-32 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-gold font-orbitron text-[11px] tracking-[3px] uppercase mb-2">
            CATALOGUE
          </div>
          <h1 className="text-white font-orbitron text-3xl md:text-4xl font-bold m-0">
            All Games
          </h1>
          <p className="text-[#64748b] font-inter text-sm mt-2">
            Top up credits for your favorite games instantly.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-5 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-white font-orbitron text-lg font-bold">1</span>
              <span className="text-[#475569] font-inter text-[10px] md:text-[11px] uppercase tracking-wider">Game Available</span>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-white/5" />
            
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Zap size={14} className="text-[#22c55e]" />
              <span className="text-[#22c55e] font-inter text-xs md:text-sm font-medium">Instant Delivery</span>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-white/5" />
            
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Shield size={14} className="text-gold" />
              <span className="text-gold font-inter text-xs md:text-sm font-medium">Secure Payments</span>
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
              className="w-full bg-[#0d1120] border border-gold/10 rounded-xl py-3 pl-11 pr-4 text-white font-inter text-sm outline-none focus:border-gold/30 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['ALL', 'TOP UP'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-5 py-2 rounded-full font-inter text-xs md:text-sm font-bold transition-all border",
                  filter === t 
                    ? "bg-gold text-[#050810] border-transparent" 
                    : "bg-transparent text-[#64748b] border-white/5 hover:border-white/20"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* GAMES GRID */}
        <div className="mt-8">
          {/* MLBB GAME CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              onClick={() => router.push('/games/mobile-legends/topup')}
              className="relative rounded-2xl overflow-hidden border border-gold/15 h-[240px] cursor-pointer group"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('/assets/games/mlbb/bg.jpg')" }}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/95 via-[#050810]/80 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-center">
                <img 
                  src="/assets/games/mlbb/logo.png" 
                  alt="MLBB" 
                  className="w-12 h-12 rounded-xl mb-4" 
                />
                
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-white font-orbitron text-xl md:text-2xl font-bold m-0">
                    Mobile Legends
                  </h2>
                  <span className="text-gold font-inter text-[10px] font-bold bg-gold/10 rounded px-2 py-1">
                    MOBA
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span className="text-[#22c55e] font-inter text-[10px] font-bold tracking-widest">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-6">
                  <button className="bg-gold text-[#050810] font-inter text-xs md:text-sm font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:bg-gold/90">
                    <Zap size={14} />
                    Top Up
                  </button>
                </div>
              </div>
            </div>
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
