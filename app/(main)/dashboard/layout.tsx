"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  Package, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Shield,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
          router.push('/login')
        }
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleSignOut = async () => {
    await fetch('/api/reseller/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const sidebarTabs = [
    { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Orders', href: '/dashboard/orders', icon: Package },
    { label: 'Profile', href: '/dashboard/profile', icon: Settings },
    { label: 'Membership', href: '/membership', icon: Shield },
  ];

  if (loading) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      backgroundColor: '#050810',
    }}>
      {/* Mobile tab bar */}
      {isMobile && (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,215,0,0.08)',
          scrollbarWidth: 'none',
          backgroundColor: '#0d1120',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          {sidebarTabs.map(tab => (
            <Link key={tab.href} href={tab.href} style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: pathname === tab.href ? 'rgba(255,215,0,0.1)' : 'transparent',
              border: `1px solid ${pathname === tab.href ? '#ffd700' : 'rgba(255,255,255,0.06)'}`,
              color: pathname === tab.href ? '#ffd700' : '#64748b',
              fontFamily: 'Inter', fontSize: '13px',
              whiteSpace: 'nowrap', textDecoration: 'none',
              flexShrink: 0,
            }}>
              {tab.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          width: '240px',
          background: '#0d1120',
          borderRight: '1px solid rgba(255,215,0,0.1)',
          padding: '32px 20px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 'bold' }}>Dashboard</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarTabs.map(tab => (
              <Link key={tab.href} href={tab.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: pathname === tab.href ? '#ffd700' : '#94a3b8',
                background: pathname === tab.href ? 'rgba(255,215,0,0.05)' : 'transparent',
                fontFamily: 'Inter',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}>
                <tab.icon size={18} />
                {tab.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontSize: '14px',
              }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Content */}
      <main style={{
        flexGrow: 1,
        padding: isMobile ? '16px' : '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {children}
      </main>
    </div>
  );
}
