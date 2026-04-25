"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  ChevronDown, 
  LayoutDashboard, Package, Settings, LogOut, 
  User, Gamepad2
} from "lucide-react"
import { cn } from "@/lib/utils"

import { ResellerDropdownContent } from "@/components/reseller/ResellerDropdownContent"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/reseller/auth/me', { cache: 'no-store' })
      .then(async r => {
        if (r.status === 401) {
          const PROTECTED_ROUTES = ['/games', '/reseller', '/dashboard', '/wallet', '/membership'];
          const isProtected = PROTECTED_ROUTES.some(route => window.location.pathname.startsWith(route));
          if (isProtected) {
            window.location.href = '/login';
          }
          return;
        }
        if (r.ok) {
          const data = await r.json()
          setUser(data)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await fetch('/api/reseller/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
      setUser(null)
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) return null

  const publicRoutes = ['/', '/terms', '/privacy', '/refund', '/contact']
  const isPublicPage = publicRoutes.includes(pathname) && !user
  const forcePublicMode = ['/terms', '/privacy', '/refund', '/contact'].includes(pathname)

  // MODE 1 - Public (Unauthenticated or Legal pages)
  if (forcePublicMode || isPublicPage) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-orbitron text-lg font-black text-white tracking-tighter">ARTISAN</span>
            <span className="font-orbitron text-lg font-normal text-gold tracking-tight">store</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="bg-transparent border border-gold/20 hover:border-gold/50 text-gold font-inter font-bold text-xs px-6 py-2.5 rounded-lg transition-all">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // MODE 2 - Authenticated
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#0d1120',
      borderBottom: '1px solid rgba(255,215,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '56px',
    }}>
      {/* Logo */}
      <Link href="/games" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <span style={{ color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '700', fontSize: '18px', letterSpacing: '2px' }}>ARTISAN</span>
        <span style={{ color: '#ffd700', fontFamily: 'Orbitron', fontWeight: '400', fontSize: '18px' }}>store</span>
        <span style={{ color: '#475569', fontFamily: 'Inter', fontSize: '10px' }}>.xyz</span>
      </Link>

      {/* Wallet chip only on mobile */}
      {isMobile && user && (
        <a href="/wallet/add" style={{
          background: 'rgba(255,215,0,0.08)',
          border: '1px solid rgba(255,215,0,0.2)',
          borderRadius: '20px',
          padding: '6px 14px',
          color: '#ffd700',
          fontFamily: 'Orbitron',
          fontSize: '13px',
          fontWeight: '700',
          textDecoration: 'none',
        }}>
          {Math.floor((user.walletBalance ?? 0))} coins
        </a>
      )}

      {/* Desktop nav links and User dropdown — hidden on mobile */}
      {!isMobile && (
        <>
          <div className="flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/" style={{
              position: 'relative',
              color: pathname === '/' ? '#ffd700' : '#94a3b8',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: pathname === '/' ? '600' : '400',
              padding: '8px 4px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              textDecoration: 'none',
            }}>
              Home
              {pathname === '/' && (
                <div style={{
                  position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                  borderRadius: '1px',
                }} />
              )}
            </Link>
            <div className="relative group">
              <button style={{
                position: 'relative',
                color: pathname.startsWith('/games') ? '#ffd700' : '#94a3b8',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: pathname.startsWith('/games') ? '600' : '400',
                padding: '8px 4px',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Games <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0d1120] border border-white/10 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-[-8px] scale-[0.97] group-hover:scale-100 transition-all duration-150 shadow-2xl">
                <Link href="/games/mobile-legends/topup" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Gamepad2 size={14} />
                  Mobile Legends
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link href="/reseller" style={{
                position: 'relative',
                color: pathname === '/reseller' ? '#ffd700' : '#94a3b8',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: pathname === '/reseller' ? '600' : '400',
                padding: '8px 4px',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}>
                Reseller
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0d1120] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-[-8px] scale-[0.97] group-hover:scale-100 transition-all duration-150 shadow-2xl z-50 overflow-hidden">
                <ResellerDropdownContent />
              </div>
            </div>
            <div className="relative group">
              <button style={{
                position: 'relative',
                color: (pathname === '/contact' || pathname === '/terms' || pathname === '/privacy' || pathname === '/refund') ? '#ffd700' : '#94a3b8',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: (pathname === '/contact' || pathname === '/terms' || pathname === '/privacy' || pathname === '/refund') ? '600' : '400',
                padding: '8px 4px',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Support <ChevronDown size={10} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] bg-[#0d1120] border border-[rgba(255,215,0,0.1)] rounded-[8px] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-[-8px] scale-[0.97] group-hover:scale-100 transition-all duration-150 shadow-2xl z-50">
                <Link href="/contact" className="font-inter text-[14px] text-white px-[16px] py-[10px] block no-underline hover:bg-[rgba(255,215,0,0.05)] transition-all">
                  Contact Us
                </Link>
                <Link href="/terms" className="font-inter text-[14px] text-white px-[16px] py-[10px] block no-underline hover:bg-[rgba(255,215,0,0.05)] transition-all">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="font-inter text-[14px] text-white px-[16px] py-[10px] block no-underline hover:bg-[rgba(255,215,0,0.05)] transition-all">
                  Privacy Policy
                </Link>
                <Link href="/refund" className="font-inter text-[14px] text-white px-[16px] py-[10px] block no-underline hover:bg-[rgba(255,215,0,0.05)] transition-all">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                href="/wallet/add"
                className="flex items-center space-x-3 bg-[#0d1120] border border-gold/10 hover:border-gold/30 transition-all rounded-2xl px-4 py-2"
              >
                <span className="text-[11px] font-black text-white tracking-tighter">
                  {Math.floor(user.walletBalance)} coins
                </span>
              </Link>
            )}

            {user && (
              <div className="relative" ref={userDropdownRef}>
                <div onClick={() => setShowUserDropdown(!showUserDropdown)}>
                  <button 
                    className="flex items-center gap-3 p-1.5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold/20 transition-all"
                    type="button"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-orbitron font-black text-xs uppercase">
                      {user.username?.[0] ?? <User size={16} />}
                    </div>
                    <ChevronDown size={12} className="text-gray-500 mr-1" />
                  </button>
                </div>

                <div className={cn(
                  "absolute top-full right-0 mt-2 w-56 bg-[#0d1120] border border-white/10 rounded-2xl p-2 shadow-2xl transition-all duration-200 z-50",
                  showUserDropdown ? "opacity-100 visible" : "opacity-0 invisible"
                )}>
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{user.username}</p>
                    <p className="text-[9px] text-gray-500 truncate">{user.email || 'No email'}</p>
                  </div>
                  
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Package size={14} />
                    My Orders
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings size={14} />
                    Profile
                  </Link>
                  
                  <div className="h-px bg-white/5 my-2" />
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  )
}
