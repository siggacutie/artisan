'use client'

import { useEffect, useState } from 'react'

interface PackageItem {
  id: string
  name: string
  section: string
  resellerPrice: number
  diamondAmount: number
}

export function ResellerDropdownContent() {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPackages(data.filter((p: PackageItem) => p.section === 'standard'))
        else setPackages([])
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
        Loading prices...
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
        Prices unavailable
      </div>
    )
  }

  return (
    <div style={{ padding: '8px 0', minWidth: '220px' }}>
      <div style={{ padding: '8px 16px 4px', fontSize: '11px', color: '#64748b', fontFamily: 'Inter', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Diamond Packages
      </div>
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid rgba(255,215,0,0.05)',
          }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#ffffff' }}>
            {pkg.name}
          </span>
          <span style={{ fontFamily: 'Orbitron', fontSize: '13px', color: '#ffd700', fontWeight: 700 }}>
            {Math.ceil(pkg.resellerPrice / 1.5)} coins
          </span>
        </div>
      ))}
      <div style={{ padding: '8px 16px 4px', marginTop: '4px' }}>
        <a
          href="/reseller"
          style={{
            fontFamily: 'Inter',
            fontSize: '12px',
            color: '#64748b',
            textDecoration: 'none',
            display: 'block',
            textAlign: 'center',
          }}
        >
          View full pricing →
        </a>
      </div>
    </div>
  )
}
