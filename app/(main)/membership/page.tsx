'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Shield, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'

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

const MEMBERSHIP_PRICES: Record<number, number> = {
  1: 250,
  3: 699,
  6: 1299,
  12: 2699,
}

export default function MembershipPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  
  const [renewLoading, setRenewLoading] = useState<number | null>(null)
  const [renewError, setRenewError] = useState('')
  const [renewSuccess, setRenewSuccess] = useState('')
  const [showAddFundsPrompt, setShowAddFundsPrompt] = useState(false)

  useEffect(() => {
    fetch('/api/reseller/auth/me')
      .then(async r => {
        if (r.ok) {
          const data = await r.json()
          setUser(data)
          fetchUserData()
        } else {
          setUser(null)
          router.push('/login')
        }
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [router])

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/dashboard/summary')
      const data = await res.json()
      setUserData(data)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setUserData(user)
    } finally {
      setLoading(false)
    }
  }

  const handleRenew = async (months: number) => {
    const cost = MEMBERSHIP_PRICES[months]
    setRenewLoading(months)
    setRenewError('')
    setRenewSuccess('')
    setShowAddFundsPrompt(false)
    
    try {
      const res = await fetch('/api/membership/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months }),
      })
      const data = await res.json()
      
      if (res.status === 402) {
        // Insufficient funds
        setRenewError(`Insufficient coins. You need ${cost} coins but have ${data.currentCoins}. Please add funds first.`)
        setShowAddFundsPrompt(true)
        return
      }
      
      if (!res.ok) {
        setRenewError(data.error || 'Failed to renew. Please try again.')
        return
      }
      
      // Success
      setRenewSuccess(`Membership renewed for ${months} month${months > 1 ? 's' : ''}! Redirecting...`)
      setTimeout(() => {
        window.location.href = '/games'
      }, 2000)
    } catch (err) {
      setRenewError('Something went wrong. Please try again.')
    } finally {
      setRenewLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    )
  }

  const currentUser = userData || user
  const now = new Date()
  const expiryDate = currentUser?.membershipExpiresAt ? new Date(currentUser.membershipExpiresAt) : null
  const isActive = !expiryDate || expiryDate > now
  const daysRemaining = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  const plans = [
    { months: 1, price: 250, savings: 0 },
    { months: 3, price: 699, savings: 51 },
    { months: 6, price: 1299, savings: 201 },
    { months: 12, price: 2699, savings: 301 },
  ]

  return (
    <div className="min-h-screen bg-[#050810] text-white p-6 md:p-12 font-inter" style={{ paddingTop: '100px' }}>
      <Navbar />
      
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Header */}
        <div>
          <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
            ACCESS STATUS
          </div>
          <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '32px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
            Membership
          </h1>
          <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '14px', marginTop: '8px' }}>
            Your reseller access status and renewal options.
          </p>
        </div>

        {/* Status Card and Warning Banners */}
        <div className="space-y-4">
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
              background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)'
            }} />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div style={{
                  width: '64px', height: '64px', borderRadius: '14px',
                  background: isActive ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                  border: isActive ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? '0 2px 12px rgba(34,197,94,0.1)' : '0 2px 12px rgba(239,68,68,0.1)',
                }}>
                  <Shield size={32} color={isActive ? "#22c55e" : "#ef4444"} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span style={{ 
                      color: isActive ? '#22c55e' : '#ef4444', 
                      fontFamily: 'Inter', 
                      fontSize: '10px', 
                      fontWeight: '800', 
                      textTransform: 'uppercase', 
                      letterSpacing: '2px',
                      backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      {isActive ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                    {!isActive && <span style={{ color: '#ef4444', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700', fontStyle: 'italic' }}>Renewal Required</span>}
                  </div>
                  <p style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700', margin: '12px 0 0 0' }}>
                    {expiryDate 
                      ? `${isActive ? 'Expires on' : 'Expired on'} ${format(expiryDate, 'dd MMM yyyy')}`
                      : 'Lifetime Access'
                    }
                  </p>
                  {expiryDate && isActive && (
                    <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px', marginTop: '4px' }}>
                      {daysRemaining} days remaining
                    </p>
                  )}
                  {!isActive && (
                    <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px', marginTop: '4px' }}>Your access has been suspended. Renew to continue.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Banners */}
          {isActive && daysRemaining !== null && daysRemaining <= 7 && (
            <div style={{
              background: '#0d1120',
              border: '1px solid rgba(245,158,11,0.15)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 12px 12px 0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(245,158,11,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={16} color="#f59e0b" />
              </div>
              <p style={{ color: '#f59e0b', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                Your membership expires in {daysRemaining} days. Renew now to avoid losing access.
              </p>
            </div>
          )}

          {!isActive && expiryDate && (
            <div style={{
              background: '#0d1120',
              border: '1px solid rgba(239,68,68,0.15)',
              borderLeft: '3px solid #ef4444',
              borderRadius: '0 12px 12px 0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={16} color="#ef4444" />
              </div>
              <p style={{ color: '#ef4444', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                Your membership has expired. Your account data and wallet balance will be permanently deleted in 3 days if not renewed.
              </p>
            </div>
          )}

          {renewError && !showAddFundsPrompt && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ef4444',
              fontFamily: 'Inter',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {renewError}
            </div>
          )}

          {showAddFundsPrompt && (
            <div style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ color: '#f59e0b', fontFamily: 'Orbitron', fontSize: '14px', marginBottom: '8px' }}>
                Insufficient Coins
              </div>
              <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '14px', marginBottom: '16px' }}>
                {renewError}
              </p>
              <div
                onClick={() => window.location.href = '/wallet/add'}
                style={{
                  display: 'inline-block',
                  background: '#ffd700',
                  color: '#000',
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  fontSize: '14px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Add Coins Now
              </div>
            </div>
          )}

          {renewSuccess && (
            <div style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#22c55e',
              fontFamily: 'Inter',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {renewSuccess}
            </div>
          )}
        </div>

        {/* Renewal Pricing Section */}
        <div className="space-y-8">
          <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Renew Your Access</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.months}
                variants={cardVariants}
                style={{
                  background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                  border: '1px solid rgba(255,215,0,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.08)';
                }}
              >
                <p style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  {plan.months} {plan.months === 1 ? 'Month' : 'Months'}
                </p>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    {Math.ceil(plan.price)}
                  </div>
                  <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', fontWeight: '700' }}>
                    COINS
                  </div>
                </div>
                
                {plan.savings > 0 && (
                  <p style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
                    Save {Math.ceil(plan.savings)} coins
                  </p>
                )}
                {!plan.savings && <div style={{ height: '39px' }} />}
                
                <div 
                  onClick={() => handleRenew(plan.months)} 
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    height: '48px',
                    background: renewLoading === plan.months ? 'rgba(255,215,0,0.3)' : '#ffd700',
                    color: '#000',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    fontSize: '14px',
                    borderRadius: '8px',
                    cursor: renewLoading === plan.months ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (renewLoading !== plan.months) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,215,0,0.2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (renewLoading !== plan.months) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {renewLoading === plan.months ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : `Renew for ${MEMBERSHIP_PRICES[plan.months]} coins`}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer Note */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
          <p style={{ color: '#475569', fontFamily: 'Inter', fontSize: '12px', lineHeight: '1.6', maxWidth: '600px' }}>
            To renew your membership, use the options above. 
            Access is automatically restored upon payment confirmation. 
            Renewals stack onto your existing membership duration if you are already active.
          </p>
        </div>
      </motion.div>
      <style jsx>{`
        .bg-gold { background-color: #ffd700; }
        .text-gold { color: #ffd700; }
      `}</style>
    </div>
  )
}
