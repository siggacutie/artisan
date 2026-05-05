"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OldUserDiscountPopupProps {
  user: {
    id: string
    createdAt: string
    hasSeenOldUserPopup: boolean
  }
}

export default function OldUserDiscountPopup({ user }: OldUserDiscountPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Launch date of the new system: 2026-05-05
    const launchDate = new Date('2026-05-05T00:00:00Z')
    const userCreatedAt = new Date(user.createdAt)

    if (userCreatedAt < launchDate && !user.hasSeenOldUserPopup) {
      setIsOpen(true)
    }
  }, [user])

  const handleAcknowledge = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reseller/tos-acknowledge', {
        method: 'POST',
      })
      if (res.ok) {
        setIsOpen(false)
      }
    } catch (err) {
      console.error('Failed to acknowledge ToS', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050810]/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-[480px] bg-[#0d1120] border border-[#ffd700]/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <Gift className="text-gold w-10 h-10" />
              </div>

              <h2 className="font-orbitron text-2xl font-bold text-white mb-4 tracking-tight">
                EXCLUSIVE LOYALTY PRICING
              </h2>

              <p className="font-inter text-gray-400 leading-relaxed mb-8">
                As a valued long-standing member, we've enabled <span className="text-gold font-bold">Loyalty Tier Discounts</span> for your account! Enjoy our lowest wholesale rates for your upcoming orders.
              </p>

              <div className="w-full bg-[#050810] border border-white/5 rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3 mb-4">
                  <ShieldCheck className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Compliance Notice</div>
                    <div className="text-gray-500 text-xs leading-normal">
                      To activate your loyalty benefits and dismiss this notification, you must acknowledge that you have read and agreed to our updated Terms of Service.
                    </div>
                  </div>
                </div>

                <Link 
                  href="/terms" 
                  target="_blank"
                  className="flex items-center gap-2 text-gold hover:text-gold/80 text-xs font-bold transition-colors no-underline uppercase tracking-widest"
                >
                  <ExternalLink size={14} />
                  Read Terms of Service
                </Link>
              </div>

              <button
                onClick={handleAcknowledge}
                disabled={loading}
                className="w-full h-14 bg-gold text-[#050810] font-inter font-black text-sm uppercase tracking-[2px] rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "I have read the ToS & Accept"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
