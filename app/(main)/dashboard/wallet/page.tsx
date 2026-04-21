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
  const coinBalance = Math.floor(inrBalance / 1.5);
  const totalSpentInr = summary?.totalSpent ?? 0;
  const totalSpentCoins = Math.floor(totalSpentInr / 1.5);

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Balance Card */}
      <div className="relative overflow-hidden bg-[#0d1120] border border-gold/20 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] group w-full max-w-full box-sizing-border-box">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Artisan Wallet</span>
            </div>
            <div>
              {loading ? (
                <div className="bg-[#050810] border border-white/5 rounded-lg h-[80px] w-[200px] animate-pulse-fast mb-2" />
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 relative">
                       <img src="/assets/games/mlbb/coin.png" alt="Coin" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black font-orbitron text-[#ffd700] tracking-tighter">
                      {coinBalance} <span className="text-2xl md:text-4xl">coins</span>
                    </h2>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-[10px]">
              <History className="w-3 h-3" />
              <span>Last updated: Just now</span>
            </div>
          </div>

          <div className="w-full md:w-auto space-y-3">
            <Link href="/wallet/add" className="w-full">
              <Button className="w-full md:w-[200px] h-14 bg-[#ffd700] text-[#050810] font-black uppercase tracking-widest transition-all hover:bg-[#ffd700]/90 border-none shadow-none">
                Add Funds
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-full flex items-center space-x-2">
            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Spent:</span>
            {loading ? (
              <div className="w-12 h-4 bg-white/5 animate-pulse rounded" />
            ) : (
              <span className="text-white text-xs font-bold">{totalSpentCoins} coins</span>
            )}
          </div>
          <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-full flex items-center space-x-2">
            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Orders:</span>
            {loading ? (
              <div className="w-8 h-4 bg-white/5 animate-pulse rounded" />
            ) : (
              <span className="text-white text-xs font-bold">{summary?.orderCount ?? 0}</span>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#0d1120] border-l-[3px] border-gold p-5 rounded-r-xl flex items-center justify-between group">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-relaxed">
              1 Coin = 1.5 INR.
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Use coins for instant checkout on all games.</p>
          </div>
        </div>
        <Link href="/wallet/add" className="hidden sm:flex items-center text-gold text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
          Add More Coins <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
