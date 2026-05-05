'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Shield, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const MEMBERSHIP_PLANS: Record<string, Record<number, number>> = {
  BASIC: {
    1: 149,
    3: 399,
    6: 749,
    12: 1299,
  },
  PREMIUM: {
    1: 200,
    3: 549,
    6: 999,
    12: 1799,
  }
}

export default function MembershipPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [selectedTier, setSelectedTier] = useState<'BASIC' | 'PREMIUM'>('BASIC')
  
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
          if (data.tier) setSelectedTier(data.tier as any)
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
    const cost = MEMBERSHIP_PLANS[selectedTier][months]
    setRenewLoading(months)
    setRenewError('')
    setRenewSuccess('')
    setShowAddFundsPrompt(false)
    
    try {
      const res = await fetch('/api/membership/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months, tier: selectedTier }),
      })
      const data = await res.json()
      
      if (res.status === 402) {
        setRenewError(`Insufficient coins. You need ${cost} coins but have ${data.currentCoins}.`)
        setShowAddFundsPrompt(true)
        return
      }
      
      if (!res.ok) {
        setRenewError(data.error || 'Failed to renew. Please try again.')
        return
      }
      
      setRenewSuccess(`Membership upgraded to ${selectedTier} and renewed for ${months} month${months > 1 ? 's' : ''}!`)
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

  const plans = Object.entries(MEMBERSHIP_PLANS[selectedTier]).map(([months, price]) => ({
    months: parseInt(months),
    price,
    savings: MEMBERSHIP_PLANS[selectedTier][1] * parseInt(months) - price
  }))

  return (
    <div className="min-h-screen bg-[#050810] text-white p-6 md:p-12 font-inter pt-28">
      <Navbar />
      
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-gold font-orbitron text-[10px] font-black tracking-[4px] uppercase mb-2">Reseller Access</div>
            <h1 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter">Membership</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your subscription and upgrade your tier.</p>
          </div>
          
          <div className="flex bg-[#0d1120] p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setSelectedTier('BASIC')}
              className={`px-8 py-3 rounded-xl font-orbitron text-xs font-black transition-all ${selectedTier === 'BASIC' ? 'bg-[#ffd700] text-[#050810] shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              BASIC
            </button>
            <button 
              onClick={() => setSelectedTier('PREMIUM')}
              className={`px-8 py-3 rounded-xl font-orbitron text-xs font-black transition-all ${selectedTier === 'PREMIUM' ? 'bg-[#00c3ff] text-[#050810] shadow-[0_0_20px_rgba(0,195,255,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              PREMIUM
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0d1120] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield size={120} className={isActive ? "text-green-500" : "text-red-500"} />
             </div>
             
             <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isActive ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  <Shield size={32} />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] font-black px-2 py-1 rounded ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {isActive ? 'ACTIVE ACCESS' : 'EXPIRED'}
                      </span>
                      <span className="text-[10px] font-black px-2 py-1 rounded bg-white/5 text-gray-400">
                        {currentUser?.tier || 'BASIC'} TIER
                      </span>
                   </div>
                   <h2 className="text-2xl font-orbitron font-black text-white">
                      {expiryDate ? format(expiryDate, 'dd MMMM yyyy') : 'No active plan'}
                   </h2>
                   <p className="text-sm text-gray-500 font-medium">
                      {isActive ? `${daysRemaining} days remaining until expiration` : 'Your access has expired. Renew to continue.'}
                   </p>
                </div>
             </div>
          </div>

          <div className="bg-[#0d1120] border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center gap-4">
             <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Balance</div>
             <div className="text-4xl font-orbitron font-black text-gold">
                {Math.floor(currentUser?.walletBalance || 0)} <span className="text-xs text-gray-500">COINS</span>
             </div>
             <button 
                onClick={() => router.push('/wallet/add')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-orbitron text-[10px] font-black transition-all"
              >
                ADD FUNDS
             </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-orbitron font-black uppercase italic tracking-tight">Select Duration</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                 <Zap size={14} className="text-gold" /> Best Value Guaranteed
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div 
                  key={plan.months}
                  className={`bg-[#0d1120] border rounded-3xl p-6 transition-all group ${selectedTier === 'BASIC' ? 'hover:border-[#ffd700]/30' : 'hover:border-[#00c3ff]/30'} border-white/5`}
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="text-2xl font-orbitron font-black text-white">
                         {plan.months} <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">{plan.months === 1 ? 'Month' : 'Months'}</span>
                      </div>
                      {plan.savings > 0 && (
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-green-500/10 text-green-500">
                          SAVE ₹{plan.savings}
                        </span>
                      )}
                   </div>

                   <div className="mb-8">
                      <div className="text-3xl font-orbitron font-black text-gold">₹{plan.price}</div>
                      <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Total Cost</div>
                   </div>

                   <button 
                      onClick={() => handleRenew(plan.months)}
                      disabled={renewLoading === plan.months}
                      className={`w-full py-4 rounded-2xl font-orbitron text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        selectedTier === 'BASIC' 
                          ? 'bg-[#ffd700] text-[#050810] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                          : 'bg-[#00c3ff] text-[#050810] hover:shadow-[0_0_20px_rgba(0,195,255,0.3)]'
                      } disabled:opacity-50`}
                   >
                      {renewLoading === plan.months ? <Loader2 className="animate-spin w-4 h-4" /> : 'RENEW NOW'}
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#0d1120] border border-white/5 rounded-3xl overflow-hidden">
           <div className="p-8 border-b border-white/5">
              <h3 className="font-orbitron font-black text-lg uppercase italic tracking-tight">Tier Benefits</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-white/5">
                    <tr>
                       <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Benefit</th>
                       <th className="px-8 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Basic</th>
                       <th className="px-8 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Premium</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <tr>
                       <td className="px-8 py-6 text-sm font-medium text-gray-300">Reseller Access</td>
                       <td className="px-8 py-6 text-center"><CheckCircle2 size={20} className="text-green-500 mx-auto" /></td>
                       <td className="px-8 py-6 text-center"><CheckCircle2 size={20} className="text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                       <td className="px-8 py-6 text-sm font-medium text-gray-300">Discounted Pricing</td>
                       <td className="px-8 py-6 text-center text-xs font-black text-[#ffd700]">STANDARD</td>
                       <td className="px-8 py-6 text-center text-xs font-black text-[#00c3ff]">ENHANCED</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-6 text-sm font-medium text-gray-300">Priority Support</td>
                       <td className="px-8 py-6 text-center text-xs font-black text-gray-600">—</td>
                       <td className="px-8 py-6 text-center"><CheckCircle2 size={20} className="text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                       <td className="px-8 py-6 text-sm font-medium text-gray-300">Instant Delivery</td>
                       <td className="px-8 py-6 text-center"><CheckCircle2 size={20} className="text-green-500 mx-auto" /></td>
                       <td className="px-8 py-6 text-center"><CheckCircle2 size={20} className="text-green-500 mx-auto" /></td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* Notifications */}
        <div className="fixed bottom-8 right-8 z-[100] space-y-4 max-w-sm w-full pointer-events-none">
           {renewError && (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-red-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
              >
                 <AlertTriangle size={24} className="shrink-0" />
                 <p className="text-xs font-bold">{renewError}</p>
                 <button onClick={() => setRenewError('')} className="ml-auto text-white/50 hover:text-white">✕</button>
              </motion.div>
           )}
           {renewSuccess && (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
              >
                 <CheckCircle2 size={24} className="shrink-0" />
                 <p className="text-xs font-bold">{renewSuccess}</p>
              </motion.div>
           )}
        </div>
      </motion.div>
    </div>
  )
}
