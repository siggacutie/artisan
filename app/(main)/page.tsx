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
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="text-gold font-orbitron text-[10px] font-black tracking-[0.3em] uppercase">Reseller Platform</div>
        <h1 className="font-orbitron text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
          MLBB Diamonds at<br />Wholesale Rates
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Verified resellers get access to our lowest prices. Apply via WhatsApp to get started.
        </p>
        <div className="pt-4">
          <a href="https://wa.me/919387606432" target="_blank" rel="noopener noreferrer" className="bg-[#25d366] text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg hover:scale-105 transition-all">
            <MessageCircle size={20} />
            Apply for Access
          </a>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="border-l-4 border-gold pl-6">
          <h2 className="font-orbitron text-2xl font-black uppercase tracking-tighter">Reseller Pricing</h2>
          <p className="text-[#64748b] text-xs font-medium mt-1">Prices updated automatically. All amounts in INR.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'standard', label: 'Diamond Top-Up' },
            { id: 'double', label: 'Double Diamond' },
            { id: 'weekly', label: 'Weekly & Monthly' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-gold text-[#050810]' : 'bg-[#0d1120] text-[#64748b] hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingPackages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-[#0d1120] border border-white/5 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 text-[#475569] font-medium italic">
            Prices temporarily unavailable
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-[#0d1120] border border-white/5 rounded-2xl p-6 flex justify-between items-center hover:border-gold/20 transition-all">
                <div className="text-sm font-bold text-white uppercase tracking-tight">{pkg.name}</div>
                <div className="text-xl font-black font-orbitron text-gold">{Math.ceil(pkg.resellerPrice / 1.5)} coins</div>
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
