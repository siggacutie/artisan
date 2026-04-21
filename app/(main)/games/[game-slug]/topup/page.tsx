'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, Shield, CheckCircle2, AlertCircle, Loader2, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/layout/Navbar'
import { toast } from 'sonner'

export default function TopUpPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifiedUsername, setVerifiedUsername] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [balance, setBalance] = useState<number>(0)
  const [purchasing, setPurchasing] = useState(false)
  const [packages, setPackages] = useState<any[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)

  useEffect(() => {
    fetch('/api/reseller/auth/me')
      .then(async r => {
        if (r.ok) {
          const data = await r.json()
          setUser(data)
        } else {
          setUser(null)
          // For topup page, we might want to allow viewing but not buying
          // router.push('/login')
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    // Fetch packages
    fetch('/api/packages', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPackages(data)
        else setPackages([])
      })
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoadingPackages(false))

    // Fetch balance
    if (user) {
      fetch('/api/dashboard/summary')
        .then(r => r.json())
        .then(s => setBalance(s.walletBalance ?? 0))
        .catch(err => console.error('Error fetching balance:', err))
    }
  }, [user])

  const handleVerify = async () => {
    if (!userId || !zoneId) return
    setVerifying(true)
    setVerifiedUsername(null)
    setVerifyError(null)
    try {
      const res = await fetch('/api/verify-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, zoneId }),
      })
      const data = await res.json()
      if (data.success) {
        setVerifiedUsername(data.username)
        toast.success(`Player verified: ${data.username}`)
      } else {
        setVerifyError(data.error || 'Invalid Player ID or Zone ID')
      }
    } catch {
      setVerifyError('Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleBuy = async () => {
    if (!verifiedUsername || !selectedPackage || purchasing) return

    if (balance < selectedPackage.resellerPrice) {
      toast.error("Insufficient coin balance. Add coins to your wallet.")
      return
    }

    setPurchasing(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          playerId: userId,
          zoneId: zoneId,
          paymentMethod: 'wallet'
        }),
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success("Order placed successfully!")
        router.push(`/dashboard/orders?success=true&orderId=${data.orderId}`)
      } else {
        toast.error(data.error || "Order creation failed")
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setPurchasing(false)
    }
  }

  const sections = [
    { id: 'standard', title: 'Diamond Top-Up' },
    { id: 'double', title: 'Double Diamonds' },
    { id: 'weekly', title: 'Weekly & Monthly' },
  ]

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form and Selection */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Header */}
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
                <NextLink href="/" className="hover:text-[#ffd700] transition-colors">Home</NextLink>
                <ChevronRight size={10} />
                <span>Games</span>
                <ChevronRight size={10} />
                <span className="text-white">Mobile Legends</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black font-orbitron uppercase tracking-tighter italic">Mobile Legends</h1>
            </div>

            {/* Step 1: Player Details */}
            <Card className="bg-[#0d1120] border-white/5 rounded-[2.5rem] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-black font-orbitron uppercase tracking-tighter">1. Player Details</h2>
                  <p className="text-[#64748b] text-xs font-medium">Enter your User ID and Zone ID</p>
                </div>
                {verifiedUsername && (
                   <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-green-500" />
                     <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">{verifiedUsername}</span>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest ml-1">User ID</label>
                  <Input 
                    placeholder="e.g. 12345678" 
                    value={userId}
                    onChange={e => { setUserId(e.target.value); setVerifiedUsername(null); }}
                    className="h-14 bg-[#050810] border-white/5 rounded-2xl text-lg font-bold focus:border-[#ffd700]/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest ml-1">Zone ID</label>
                  <Input 
                    placeholder="e.g. 1234" 
                    value={zoneId}
                    onChange={e => { setZoneId(e.target.value); setVerifiedUsername(null); }}
                    className="h-14 bg-[#050810] border-white/5 rounded-2xl text-lg font-bold focus:border-[#ffd700]/30 transition-all"
                  />
                </div>
              </div>

              <Button 
                onClick={handleVerify}
                disabled={!userId || !zoneId || verifying}
                className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
              >
                {verifying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {verifying ? 'Verifying...' : 'Verify Player'}
              </Button>

              {verifyError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-red-500 text-xs font-bold uppercase tracking-tight">{verifyError}</span>
                </div>
              )}
            </Card>

            {/* Step 2: Package Selection */}
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-black font-orbitron uppercase tracking-tighter">2. Select Package</h2>
                  <p className="text-[#64748b] text-xs font-medium">Choose the amount of diamonds you want to top up</p>
                </div>
                <div className="bg-[#ffd700]/10 border border-[#ffd700]/20 px-4 py-2 rounded-full flex items-center gap-2">
                   <span className="text-[#ffd700] text-[10px] font-black uppercase tracking-widest">Balance: {Math.floor(balance / 1.5)} coins</span>
                </div>
              </div>

              {sections.map(section => (
                <div key={section.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-[#ffd700] rounded-full" />
                    <h3 className="text-sm font-black font-orbitron uppercase tracking-widest">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loadingPackages ? (
                      Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-[#0d1120] rounded-2xl animate-pulse" />)
                    ) : (
                      packages.filter(p => p.section === section.id).map(pkg => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-3 md:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-24 md:h-28 ${
                            selectedPackage?.id === pkg.id 
                              ? 'border-[#ffd700] bg-[#ffd700]/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                              : 'border-white/5 bg-[#0d1120] hover:border-white/20'
                          }`}
                        >
                          <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-tight line-clamp-1">{pkg.name}</span>
                          <span className="text-lg md:text-xl font-black font-orbitron text-[#ffd700]">{Math.ceil(pkg.resellerPrice / 1.5)} coins</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-6">
              <Card className="bg-[#0d1120] border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8 shadow-2xl">
                <h2 className="text-lg md:text-xl font-black font-orbitron uppercase tracking-tighter">Order Summary</h2>

                <div className="space-y-4 md:space-y-6">
                  {/* Selected Game */}
                  <div className="flex items-center gap-4 bg-[#050810] p-3 md:p-4 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                       <Image src="/assets/games/mlbb/logo.png" alt="MLBB" width={40} height={40} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-black text-[#64748b] uppercase tracking-widest">Selected Game</span>
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Mobile Legends</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-1.5 md:space-y-2">
                    <p className="text-[9px] md:text-[10px] font-black text-[#64748b] uppercase tracking-widest">Delivering To</p>
                    {verifiedUsername ? (
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg font-black font-orbitron text-white uppercase tracking-tighter italic">{verifiedUsername}</span>
                        <span className="text-[10px] md:text-xs text-[#64748b] font-medium">ID: {userId} ({zoneId})</span>
                      </div>
                    ) : (
                      <p className="text-xs text-[#334155] font-bold italic uppercase tracking-tight">Player not verified</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] md:text-xs font-bold text-[#64748b] uppercase tracking-widest">Selected Package</span>
                      <span className="text-xs md:text-sm font-bold text-white">{selectedPackage?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-black text-[#64748b] uppercase tracking-widest">Total Price</span>
                        <span className="text-3xl md:text-4xl font-black font-orbitron text-white tracking-tighter">{Math.ceil((selectedPackage?.resellerPrice || 0) / 1.5)} coins</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-widest mb-0.5 md:mb-1">Payment Method</span>
                         <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">Artisan Wallet</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={handleBuy}
                    disabled={!verifiedUsername || !selectedPackage || purchasing}
                    className={`w-full h-14 md:h-16 rounded-2xl font-black text-base md:text-lg uppercase tracking-[0.2em] shadow-2xl transition-all font-orbitron
                      ${!verifiedUsername || !selectedPackage 
                        ? 'bg-[#1e2535] text-[#475569] cursor-not-allowed' 
                        : balance < selectedPackage.resellerPrice
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-[#ffd700] text-[#050810] hover:scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                      }`}
                  >
                    {purchasing 
                      ? 'Processing...' 
                      : balance < (selectedPackage?.resellerPrice || 0) 
                        ? 'Insufficient coin balance' 
                        : selectedPackage 
                          ? `Buy Now — ${Math.ceil(selectedPackage.resellerPrice / 1.5)} coins` 
                          : 'Buy Now'
                    }
                  </Button>

                  {!verifiedUsername && (
                    <p className="text-[9px] text-[#64748b] text-center uppercase tracking-widest font-black">
                      Verify Player details before purchasing
                    </p>
                  )}
                </div>
              </Card>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-3 text-[#64748b]">
                <Shield size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Wallet Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .bg-gold { background-color: #ffd700; }
        .text-gold { color: #ffd700; }
      `}</style>
    </div>
  )
}
