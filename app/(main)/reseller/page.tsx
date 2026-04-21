'use client'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen bg-[#050810] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-l-4 border-gold pl-6">
          <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-tighter italic">Reseller Pricing</h1>
          <p className="text-zinc-500 text-sm mt-1 font-inter font-medium">Live wholesale rates for Mobile Legends Bang Bang.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-[#0d1120] border border-white/5 rounded-3xl p-6 hover:border-gold/30 transition-all group shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <img src="/assets/games/mlbb/coin.png" alt="Diamonds" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reseller Rate</p>
                    <p className="text-2xl font-black text-gold font-orbitron italic">{Math.ceil(pkg.resellerPrice / 1.5)} coins</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-white font-black text-lg tracking-tight">{pkg.label}</h3>
                  {pkg.bonusDiamonds > 0 && !pkg.label.includes('+') && (
                    <p className="text-gold text-xs font-bold">+{pkg.bonusDiamonds} Bonus Included</p>
                  )}
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Instant Delivery</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
