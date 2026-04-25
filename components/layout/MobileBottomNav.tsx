'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Zap, Wallet, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'

const tabs = [
  { label: 'Home', icon: Home, href: '/games' },
  { label: 'Top Up', icon: Zap, href: '/games/mobile-legends/topup' },
  { label: 'Wallet', icon: Wallet, href: '/wallet/add' },
  { label: 'Support', icon: MessageCircle, href: '/contact' },
  { label: 'Profile', icon: User, href: '/dashboard/profile' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0d1120',
      borderTop: '1px solid rgba(255,215,0,0.1)',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ label, icon: Icon, href }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0', textDecoration: 'none',
            color: active ? '#ffd700' : '#475569',
            transition: 'color 0.15s',
            minHeight: '56px',
          }}>
            <Icon size={20} />
            <span style={{ fontSize: '10px', fontFamily: 'Inter', marginTop: '3px' }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
