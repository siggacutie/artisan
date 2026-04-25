'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Loader2 } from 'lucide-react'

interface PackageItem {
  id: string
  name: string
  section: string
  resellerPrice: number
  diamondAmount: number
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [activeTab, setActiveTab] = useState<'standard' | 'double' | 'weekly'>('standard')

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
    if (user) {
      router.replace('/games')
    }
  }, [user, router])

  useEffect(() => {
    if (!user && !loading) {
      fetch('/api/packages?landing=true', { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setPackages(data)
          else setPackages([])
        })
        .catch(() => setPackages([]))
        .finally(() => setLoadingPackages(false))
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    )
  }

  if (!!user) return null

  const filteredPackages = packages.filter(p => p.section === activeTab)

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter">
      {/* Navbar */}
      <nav className="p-6 border-b border-white/5 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-black font-orbitron">
          ARTISAN<span className="text-gold">store</span><span className="text-[10px] text-[#64748b] ml-1">.xyz</span>
        </div>
        <Link href="/login" className="border border-gold/20 text-gold font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-gold/5 transition-all">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Noise Texture Overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '10px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Reseller Platform
          </div>
          <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: '1.1' }} className="text-4xl md:text-6xl">
            MLBB Diamonds at<br />Wholesale Rates
          </h1>
          <p style={{ color: '#94a3b8', fontFamily: 'Inter', maxWidth: '600px', margin: '24px auto 0', lineHeight: '1.6' }} className="text-base md:text-lg">
            Verified resellers get access to our lowest prices. Apply via WhatsApp to get started.
          </p>
          <div className="pt-10">
            <a 
              href="https://wa.me/919387606432" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                backgroundColor: '#25d366',
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                padding: '16px 40px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 32px rgba(37, 211, 102, 0.2)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <MessageCircle size={20} />
              Apply for Access
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto space-y-16">
        <div style={{ borderLeft: '4px solid #ffd700', paddingLeft: '24px' }}>
          <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Reseller Pricing</h2>
          <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Prices updated automatically. All amounts in INR.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'standard', label: 'Diamond Top-Up' },
            { id: 'double', label: 'Double Diamond' },
            { id: 'weekly', label: 'Weekly & Monthly' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#ffd700' : '#0d1120',
                color: activeTab === tab.id ? '#050810' : '#64748b',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingPackages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{
                background: '#0d1120',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                height: '96px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s infinite',
                }} />
              </div>
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 text-[#475569] font-medium italic">
            Prices temporarily unavailable
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                style={{
                  background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                  border: '1px solid rgba(255,215,0,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>{pkg.name}</div>
                <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '900' }}>₹{pkg.resellerPrice}</div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-12 text-center space-y-6">
          <p className="text-white font-medium">Want these prices? Join as a reseller.</p>
          <a href="https://wa.me/919387606432" target="_blank" rel="noopener noreferrer" className="bg-[#25d366] text-white font-black text-sm uppercase tracking-widest px-10 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg hover:scale-105 transition-all">
            Apply on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-[#64748b] text-sm">
          Already have an account? <Link href="/login" className="text-gold font-bold hover:underline">Sign in here</Link>
        </p>
        <div className="flex gap-6 justify-center flex-wrap mt-4">
          <Link href="/terms" className="font-inter text-[13px] text-[#475569] no-underline hover:text-[#64748b]">Terms of Service</Link>
          <span className="text-[#334155]"> · </span>
          <Link href="/privacy" className="font-inter text-[13px] text-[#475569] no-underline hover:text-[#64748b]">Privacy Policy</Link>
          <span className="text-[#334155]"> · </span>
          <Link href="/refund" className="font-inter text-[13px] text-[#475569] no-underline hover:text-[#64748b]">Refund Policy</Link>
          <span className="text-[#334155]"> · </span>
          <Link href="/contact" className="font-inter text-[13px] text-[#475569] no-underline hover:text-[#64748b]">Contact</Link>
        </div>
      </footer>
      <style jsx>{`
        .bg-gold { background-color: #ffd700; }
        .text-gold { color: #ffd700; }
      `}</style>
    </div>
  )
}
