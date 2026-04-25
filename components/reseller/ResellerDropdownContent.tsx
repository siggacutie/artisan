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
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            gap: '16px',
            borderBottom: '1px solid rgba(255,215,0,0.05)',
          }}
        >
          <span style={{
            color: '#e2e8f0',
            fontFamily: 'Inter',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minWidth: '160px', // fixed width for package name column
          }}>
            {pkg.name}
          </span>
          <span style={{
            color: '#ffd700',
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            textAlign: 'right',
            flexShrink: 0,
          }}>
            {Math.ceil(pkg.resellerPrice)} coins
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
