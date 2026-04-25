'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, Shield, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, Variants } from 'framer-motion'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  useEffect(() => {
    fetch('/api/packages', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPackages(data)
        else setPackages([])
      })
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoadingPackages(false))

    if (user) {
      setBalance(user.walletBalance ?? 0)
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
      boxSizing: 'border-box'
    }}>
      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pb-24"
      >
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '32px' : '48px',
          alignItems: 'flex-start'
        }}>
          
          {/* Left Column: Form and Selection */}
          <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Header */}
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
                <NextLink href="/" className="hover:text-[#ffd700] transition-colors">Home</NextLink>
                <ChevronRight size={10} />
                <span>Games</span>
                <ChevronRight size={10} />
                <span className="text-white">Mobile Legends</span>
              </nav>
              <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontStyle: 'italic' }}>Mobile Legends</h1>
            </div>

            {/* Step 1: Player Details */}
            <div style={{
              background: '#0d1120',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '24px',
              padding: isMobile ? '24px' : '32px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)'
              }} />
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '32px', gap: '16px' }}>
                <div className="space-y-1">
                  <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>1. Player Details</h2>
                  <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Enter your User ID and Zone ID</p>
                </div>
                {verifiedUsername && (
                   <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-green-500" />
                     <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">{verifiedUsername}</span>
                   </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>User ID</label>
                  <Input 
                    placeholder="e.g. 12345678" 
                    value={userId}
                    onChange={e => { setUserId(e.target.value); setVerifiedUsername(null); }}
                    className="h-14 bg-[#050810] border-white/5 rounded-2xl text-lg font-bold focus:border-[#ffd700]/30 transition-all"
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>Zone ID</label>
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
                style={{
                  marginTop: '24px',
                  width: '100%',
                  height: '56px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
              >
                {verifying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {verifying ? 'Verifying...' : 'Verify Player'}
              </Button>

              {verifyError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-red-500 text-xs font-bold uppercase tracking-tight">{verifyError}</span>
                </div>
              )}
            </div>

            {/* Step 2: Package Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px' }}>
                <div className="space-y-1">
                  <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>2. Select Package</h2>
                  <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Choose the diamonds amount</p>
                </div>
                <div style={{
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  padding: '8px 16px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance: {Math.floor(balance)} coins</span>
                </div>
              </div>

              {sections.map(section => (
                <div key={section.id} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-[#ffd700] rounded-full" />
                    <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>{section.title}</h3>
                  </div>
                  <motion.div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                      gap: '16px'
                    }}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {loadingPackages ? (
                      Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-[#0d1120] rounded-2xl animate-pulse" />)
                    ) : (
                      packages.filter(p => p.section === section.id).map(pkg => (
                        <motion.div
                          key={pkg.id}
                          variants={cardVariants}
                          onClick={() => setSelectedPackage(pkg)}
                          style={{
                            background: selectedPackage?.id === pkg.id ? '#ffd700' : 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                            border: selectedPackage?.id === pkg.id ? '1px solid #ffd700' : '1px solid rgba(255,215,0,0.08)',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: selectedPackage?.id === pkg.id ? '0 8px 24px rgba(255,215,0,0.15)' : '0 2px 16px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '112px'
                          }}
                        >
                          <span style={{ 
                            color: selectedPackage?.id === pkg.id ? '#050810' : '#ffffff', 
                            fontFamily: 'Inter', 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px' 
                          }}>{pkg.name}</span>
                          <span style={{ 
                            color: selectedPackage?.id === pkg.id ? '#050810' : '#ffd700', 
                            fontFamily: 'Orbitron', 
                            fontSize: '20px', 
                            fontWeight: '700' 
                          }}>{Math.ceil(pkg.resellerPrice)} coins</span>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout */}
          <div style={{ flex: isMobile ? 'none' : '0 0 400px', width: '100%' }}>
            <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: '#0d1120',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '24px',
                padding: isMobile ? '24px' : '32px',
                boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)'
                }} />
                <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '24px' }}>Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Selected Game */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                    border: '1px solid rgba(255,215,0,0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(0,195,255,0.15), rgba(0,195,255,0.05))',
                      border: '1px solid rgba(0,195,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                       <Image src="/assets/games/mlbb/logo.png" alt="MLBB" width={44} height={44} />
                    </div>
                    <div className="flex flex-col">
                      <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Selected Game</span>
                      <span style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase' }}>Mobile Legends</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-2">
                    <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivering To</p>
                    {verifiedUsername ? (
                      <div className="flex flex-col">
                        <span style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: isMobile ? '20px' : '24px', fontWeight: '700', letterSpacing: '-0.5px', fontStyle: 'italic' }}>{verifiedUsername}</span>
                        <span style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>ID: {userId} ({zoneId})</span>
                      </div>
                    ) : (
                      <p style={{ color: '#475569', fontFamily: 'Inter', fontSize: '13px', fontStyle: 'italic' }}>Player not verified</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Selected Package</span>
                      <span style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>{selectedPackage?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Total Price</span>
                        <span style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: isMobile ? '24px' : '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>{Math.ceil((selectedPackage?.resellerPrice || 0))} coins</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={handleBuy}
                    disabled={!verifiedUsername || !selectedPackage || purchasing}
                    style={{
                      width: '100%',
                      height: '64px',
                      borderRadius: '16px',
                      fontFamily: 'Orbitron',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      backgroundColor: (!verifiedUsername || !selectedPackage) ? '#1e2535' : (balance < selectedPackage.resellerPrice ? '#ef4444' : '#ffd700'),
                      color: (balance < selectedPackage?.resellerPrice) ? '#ffffff' : '#050810',
                      border: 'none',
                    }}
                  >
                    {purchasing 
                      ? 'Processing...' 
                      : balance < (selectedPackage?.resellerPrice || 0) 
                        ? 'Insufficient coins' 
                        : selectedPackage 
                          ? `Buy Now` 
                          : 'Buy Now'
                    }
                  </Button>

                  {!verifiedUsername && (
                    <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', textAlign: 'center', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>
                      Verify details first
                    </p>
                  )}
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-3">
                <Shield size={16} color="#22c55e" />
                <span style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
