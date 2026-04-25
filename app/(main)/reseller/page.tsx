'use client'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const containerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.05 } }
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
}

export default function ResellerPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => {
        if (data.packages) setPackages(data.packages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#050810] text-white pt-24 pb-20 px-6 overflow-hidden">
      <Navbar />
      
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-7xl mx-auto"
      >
        {/* HERO */}
        <div className="text-center space-y-4 mb-16 relative">
          <div style={{
            position: 'absolute', inset: -40,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            pointerEvents: 'none',
          }} />
          <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '32px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Reseller Pricing
          </h1>
          <p style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Get exclusive rates and start your own gaming top-up business today.
          </p>
          <div className="flex justify-center mt-8">
            <div style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.2)',
              padding: '10px 24px',
              borderRadius: '99px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Market Rates</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                background: '#0d1120',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '28px',
                height: '140px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s infinite',
                }} />
                <div style={{ height: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '12px', width: '60%' }} />
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={cardVariants}
                style={{
                  background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                  border: '1px solid rgba(255,215,0,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '140px'
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
                <div>
                  <h3 style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {pkg.name || pkg.label}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <div style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }} />
                    <span style={{ color: '#22c55e', fontFamily: 'Inter', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>INSTANT</span>
                  </div>
                </div>
                
                <div>
                  <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    {Math.ceil(pkg.resellerPrice)}
                  </div>
                  <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>
                    COINS
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
