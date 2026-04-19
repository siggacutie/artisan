'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Shield, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react'

export default function MembershipPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

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
      // Fallback to user data if API fails
      setUserData(user)
    } finally {
      setLoading(false)
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
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black font-orbitron uppercase tracking-tighter">Membership</h1>
          <p className="text-sm text-[#64748b] mt-1 font-medium">Your reseller access status</p>
        </div>

        {/* Status Card and Warning Banners */}
        <div className="space-y-4">
          <div className="bg-[#0d1120] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                <Shield size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isActive ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                  {!isActive && <span className="text-red-500 text-xs font-bold italic">Renewal Required</span>}
                </div>
                <p className="text-white font-bold mt-2">
                  {expiryDate 
                    ? `${isActive ? 'Expires on' : 'Expired on'} ${format(expiryDate, 'dd MMM yyyy')}`
                    : 'Lifetime Access (No expiry set)'
                  }
                </p>
                {expiryDate && isActive && (
                  <p className="text-xs text-[#64748b] mt-1">
                    {daysRemaining} days remaining
                  </p>
                )}
                {!isActive && (
                  <p className="text-xs text-[#64748b] mt-1">Your access has been suspended. Renew to continue.</p>
                )}
              </div>
            </div>
          </div>

          {/* Warning Banners */}
          {isActive && daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 3 && (
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] rounded-lg p-3 px-4 font-inter text-sm">
              Your membership expires in {daysRemaining} days. Renew now to avoid losing access.
            </div>
          )}

          {isActive && daysRemaining !== null && daysRemaining <= 3 && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] rounded-lg p-3 px-4 font-inter text-sm">
              URGENT: Your membership expires in {daysRemaining} days. All account data including wallet balance will be permanently deleted if not renewed.
            </div>
          )}

          {!isActive && expiryDate && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] rounded-lg p-3 px-4 font-inter text-sm">
              Your membership has expired. Your account data and wallet balance will be permanently deleted in 3 days if not renewed.
            </div>
          )}
        </div>

        {/* Renewal Pricing Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-black font-orbitron uppercase tracking-tighter">Renew Your Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.months} className="bg-[#0d1120] border border-white/5 rounded-2xl p-6 flex flex-col">
                <p className="text-xs font-black font-orbitron text-white uppercase tracking-widest mb-2">
                  {plan.months} {plan.months === 1 ? 'Month' : 'Months'}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-black font-orbitron text-gold tracking-tight">₹{plan.price}</span>
                </div>
                {plan.savings > 0 && (
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-6">
                    Save ₹{plan.savings}
                  </p>
                )}
                {!plan.savings && <div className="mb-6 h-[15px]" />}
                
                <button 
                  className="mt-auto w-full bg-gold text-[#050810] font-black text-xs uppercase tracking-widest py-3 rounded-lg hover:scale-[1.02] transition-all cursor-pointer"
                  onClick={() => {}}
                >
                  Renew Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-white/5">
          <p className="text-[11px] text-[#64748b] leading-relaxed max-w-2xl font-medium">
            To renew your membership, contact your administrator or use the Renew Now button above. 
            Access is automatically restored upon payment confirmation. 
            Renewals stack onto your existing membership duration if you are already active.
          </p>
        </div>
      </div>
      <style jsx>{`
        .bg-gold { background-color: #ffd700; }
        .text-gold { color: #ffd700; }
      `}</style>
    </div>
  )
}
