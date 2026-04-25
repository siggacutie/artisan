"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  History,
  ChevronRight,
  Coins
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Variants } from "framer-motion";

export default function WalletPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()
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
      .catch(() => setUser(null))
  }, [router])

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(false);
    fetch('/api/dashboard/summary', { credentials: 'include', cache: 'no-store' })
      .then(async r => {
        if (!r.ok) throw new Error('Failed to fetch');
        const data = await r.json();
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard summary:', err);
        setError(true);
        setLoading(false);
      });
  }, [user]);

  if (error) {
    return (
      <div className="bg-[#0d1120] border border-red-500/20 p-8 rounded-2xl text-center">
        <p className="text-red-500 font-bold">Could not load wallet</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-gold text-xs font-bold uppercase tracking-widest underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const inrBalance = summary?.walletBalance ?? 0;
  const coinBalance = Math.floor(inrBalance);
  const totalSpentInr = summary?.totalSpent ?? 0;
  const totalSpentCoins = Math.floor(totalSpentInr);

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Balance Card */}
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)',
          zIndex: 20
        }} />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                border: '1px solid rgba(255,215,0,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255,215,0,0.1)',
              }}>
                <Coins size={20} color="#ffd700" />
              </div>
              <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Artisan Wallet
              </span>
            </div>

            <div>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-16 w-48 bg-white/5 animate-pulse rounded-xl" />
                  <div className="h-4 w-32 bg-white/5 animate-pulse rounded" />
                </div>
              ) : (
                <div className="flex flex-col">
                  <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontWeight: '700', letterSpacing: '-1px', margin: 0 }} className="text-5xl md:text-6xl">
                    {coinBalance} <span style={{ opacity: 0.7 }} className="text-xl md:text-2xl">COINS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#64748b] text-[10px] mt-2 font-bold uppercase tracking-widest">
                    <History className="w-3 h-3" />
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Link href="/wallet/add" style={{ textDecoration: 'none' }}>
              <Button 
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: '#ffd700',
                  color: '#050810',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderRadius: '16px',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255,215,0,0.2)'
                }}
                className="md:w-[200px]"
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Add Funds
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-8">
          <div>
            <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              {totalSpentCoins}
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', fontWeight: '700' }}>
              Coins Spent
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/5" />

          <div>
            <div style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              {summary?.orderCount ?? 0}
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', fontWeight: '700' }}>
              Total Orders
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,215,0,0.15)',
        borderLeft: '3px solid #ffd700',
        borderRadius: '0 12px 12px 0',
        padding: '20px 24px',
        boxShadow: '0 4px 24px rgba(255,215,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center space-x-4">
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,215,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Coins size={18} color="#ffd700" />
          </div>
          <div>
            <p style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', margin: 0 }}>
              1 Coin = 1 INR
            </p>
            <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '12px', margin: '2px 0 0 0' }}>Use coins for instant checkout on all games.</p>
          </div>
        </div>
        <Link href="/wallet/add" style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          Add More <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
