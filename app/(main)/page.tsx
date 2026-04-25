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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
      boxSizing: 'border-box'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '48px 16px' : '80px 24px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
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
          <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: '1.1', fontSize: isMobile ? '28px' : '48px' }}>
            MLBB Diamonds at<br />Wholesale Rates
          </h1>
          <p style={{ color: '#94a3b8', fontFamily: 'Inter', maxWidth: '600px', margin: '24px auto 0', lineHeight: '1.6', fontSize: isMobile ? '14px' : '16px' }}>
            Verified resellers get access to our lowest prices. Apply via WhatsApp to get started.
          </p>
          <div style={{ paddingTop: '40px' }}>
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
                boxShadow: '0 8px 32px rgba(37, 211, 102, 0.2)'
              }}
            >
              <MessageCircle size={20} />
              Apply for Access
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section style={{ padding: isMobile ? '48px 16px' : '80px 24px' }}>
        <div style={{ borderLeft: '4px solid #ffd700', paddingLeft: '24px', marginBottom: '48px' }}>
          <h2 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '20px' : '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Reseller Pricing</h2>
          <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>INR Prices updated automatically.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'standard', label: 'Diamond' },
            { id: 'double', label: 'Double' },
            { id: 'weekly', label: 'Weekly' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: activeTab === tab.id ? '#ffd700' : '#0d1120',
                color: activeTab === tab.id ? '#050810' : '#64748b',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingPackages ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ background: '#0d1120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', height: '96px' }} />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 text-[#475569] font-medium italic">
            Prices temporarily unavailable
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                style={{
                  background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
                  border: '1px solid rgba(255,215,0,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>{pkg.name}</div>
                <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '900' }}>₹{pkg.resellerPrice}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <p style={{ color: '#ffffff', fontWeight: '500' }}>Want these prices? Join as a reseller.</p>
          <a href="https://wa.me/919387606432" target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#25d366',
            color: '#ffffff',
            fontFamily: 'Inter',
            fontSize: '13px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.2)'
          }}>
            Apply on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Already have an account? <Link href="/login" style={{ color: '#ffd700', fontWeight: '700', textDecoration: 'none' }}>Sign in here</Link>
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <Link href="/terms" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>Terms</Link>
          <Link href="/privacy" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/refund" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>Refund</Link>
          <Link href="/contact" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </div>
  )
}
