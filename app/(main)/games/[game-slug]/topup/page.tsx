'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, Shield, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        if (data.packages) setPackages(data.packages)
        else if (Array.isArray(data)) setPackages(data)
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

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: '#050810',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: '15px',
    outline: 'none',
    display: 'block',
  }

  const cardStyle = {
    background: '#0d1120',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: isMobile ? '16px' : '24px',
    marginBottom: '16px',
    boxSizing: 'border-box' as const,
    width: '100%',
    overflowX: 'hidden' as const,
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: isMobile ? '72px 16px 80px' : '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          
          {/* Header */}
          <div className="space-y-4 w-full">
            <nav className="flex items-center space-x-2 text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
              <NextLink href="/" className="hover:text-[#ffd700] transition-colors">Home</NextLink>
              <ChevronRight size={10} />
              <span>Games</span>
              <ChevronRight size={10} />
              <span className="text-white uppercase">Mobile Legends</span>
            </nav>
            <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontStyle: 'italic' }}>Mobile Legends</h1>
          </div>

          {/* Step 1: Player Details */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px', gap: '16px' }}>
              <div className="space-y-1">
                <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>1. Player Details</h2>
                <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Enter your User ID and Zone ID</p>
              </div>
              {verifiedUsername && (
                 <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2 self-start">
                   <CheckCircle2 size={14} className="text-green-500" />
                   <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">{verifiedUsername}</span>
                 </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>User ID</label>
                <input 
                  placeholder="e.g. 12345678" 
                  value={userId}
                  onChange={e => { setUserId(e.target.value); setVerifiedUsername(null); }}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>Zone ID</label>
                <input 
                  placeholder="e.g. 1234" 
                  value={zoneId}
                  onChange={e => { setZoneId(e.target.value); setVerifiedUsername(null); }}
                  style={inputStyle}
                />
              </div>
            </div>

            <button 
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {verifying ? <Loader2 className="animate-spin w-4 h-4" /> : null}
              {verifying ? 'Verifying...' : 'Verify Player'}
            </button>

            {verifyError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-red-500 text-xs font-bold uppercase tracking-tight">{verifyError}</span>
              </div>
            )}
          </div>

          {/* Step 2: Package Selection */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px', gap: '16px' }}>
              <div className="space-y-1">
                <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>2. Select Package</h2>
                <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Choose the diamonds amount</p>
              </div>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '20px',
                padding: '6px 14px',
                marginBottom: '16px',
                alignSelf: 'flex-start'
              }}>
                <span style={{ color: '#ffd700', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>
                  BALANCE: {Math.floor(balance)} COINS
                </span>
              </div>
            </div>

            {sections.map(section => (
              <div key={section.id} className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-[#ffd700] rounded-full" />
                  <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>{section.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {loadingPackages ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-[#050810] rounded-xl animate-pulse" />)
                  ) : (
                    packages.filter(p => p.section === section.id).map(pkg => {
                      const selected = selectedPackage?.id === pkg.id
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            background: selected ? 'rgba(255,215,0,0.08)' : '#050810',
                            border: `1px solid ${selected ? '#ffd700' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            width: '100%',
                            gap: '8px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {pkg.name}
                            </div>
                          </div>
                          <div style={{ flexShrink: 0, color: '#ffd700', fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>
                            {Math.ceil(pkg.resellerPrice)} coins
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Step 3: Summary & Buy */}
          <div style={cardStyle}>
            <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '24px' }}>3. Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Selected Game */}
              <div style={{
                background: '#050810',
                border: '1px solid rgba(255,215,0,0.08)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  background: 'rgba(0,195,255,0.1)',
                  border: '1px solid rgba(0,195,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                   <Image src="/assets/games/mlbb/logo.png" alt="MLBB" width={40} height={40} />
                </div>
                <div className="flex flex-col">
                  <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Mobile Legends</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px' }}>Total Price</span>
                  <span style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700' }}>{Math.ceil((selectedPackage?.resellerPrice || 0))} coins</span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                onClick={handleBuy}
                disabled={!verifiedUsername || !selectedPackage || purchasing}
                style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '12px',
                  fontFamily: 'Orbitron',
                  fontSize: '16px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  backgroundColor: (!verifiedUsername || !selectedPackage) ? '#1e2535' : (balance < (selectedPackage?.resellerPrice || 0) ? '#ef4444' : '#ffd700'),
                  color: (balance < (selectedPackage?.resellerPrice || 0)) ? '#ffffff' : '#050810',
                  border: 'none',
                }}
              >
                {purchasing 
                  ? 'Processing...' 
                  : balance < (selectedPackage?.resellerPrice || 0) 
                    ? 'Insufficient coins' 
                    : 'Buy Now'
                }
              </Button>

              {!verifiedUsername && (
                <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', textAlign: 'center', textTransform: 'uppercase', fontWeight: '700' }}>
                  Verify details first
                </p>
              )}
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center gap-3 opacity-50 pb-8">
            <Shield size={14} color="#22c55e" />
            <span style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Checkout</span>
          </div>

        </div>
      </motion.main>
    </div>
  )
}
