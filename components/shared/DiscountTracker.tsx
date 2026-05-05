"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface DiscountTrackerProps {
  ordersCount: number
}

export default function DiscountTracker({ ordersCount }: DiscountTrackerProps) {
  const remaining = Math.max(0, 3 - ordersCount)
  
  if (remaining === 0) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0d1120',
        border: '1px solid rgba(255,215,0,0.15)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', flexShrink: 0,
        background: 'rgba(255,215,0,0.1)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Zap size={18} color="#ffd700" />
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '2px' }}>
          LOYALTY DISCOUNT ACTIVE
        </div>
        <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px' }}>
          Your special wholesale rates are applied.
        </div>
      </div>
      {/* Badge */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(255,215,0,0.1)',
        border: '1px solid rgba(255,215,0,0.3)',
        borderRadius: '8px',
        padding: '6px 10px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>
          {remaining}
        </div>
        <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.5px', marginTop: '2px' }}>
          ORDERS LEFT
        </div>
      </div>
    </motion.div>
  )
}
