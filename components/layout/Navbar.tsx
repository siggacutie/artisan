"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, X, ChevronDown, 
  LayoutDashboard, Package, Settings, LogOut, 
  User, MessageSquare, Gamepad2, Home
} from "lucide-react"
import { cn } from "@/lib/utils"

import { ResellerDropdownContent } from "@/components/reseller/ResellerDropdownContent"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reseller/auth/me', { cache: 'no-store' })
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
            <span className="text-[10px] text-gray-600 ml-1">.xyz</span>
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

  // MODE 2 - Authenticated (or any other non-homepage page)
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-md border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-orbitron text-lg font-black text-white tracking-tighter">ARTISAN</span>
          <span className="font-orbitron text-lg font-normal text-gold tracking-tight">store</span>
        </Link>

        {/* Links - Center (Desktop) */}
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors", pathname === '/' ? "text-gold" : "text-zinc-500 hover:text-white")}>
            Home
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">
              Games <ChevronDown size={10} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0d1120] border border-white/10 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
              <Link href="/games/mobile-legends/topup" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Gamepad2 size={14} />
                Mobile Legends
              </Link>
            </div>
          </div>
          <div className="relative group">
            <Link href="/reseller" className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors", pathname === '/reseller' ? "text-gold" : "text-zinc-500 group-hover:text-white")}>
              Reseller
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0d1120] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50 overflow-hidden">
              <ResellerDropdownContent />
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">
              Support <ChevronDown size={10} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] bg-[#0d1120] border border-[rgba(255,215,0,0.1)] rounded-[8px] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50">
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

        {/* Right Section - Wallet + Auth */}
        <div className="flex items-center space-x-4">
          {user && (
            <Link 
              href="/wallet/add"
              className="hidden sm:flex items-center space-x-3 bg-[#0d1120] border border-gold/10 hover:border-gold/30 transition-all rounded-2xl px-4 py-2"
            >
              <span className="text-[11px] font-black text-white tracking-tighter">
                {Math.floor(user.walletBalance / 1.5)} coins
              </span>
            </Link>
          )}

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-3 p-1.5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold/20 transition-all">
                <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-orbitron font-black text-xs uppercase">
                  {user.username?.[0] ?? <User size={16} />}
                </div>
                <ChevronDown size={12} className="text-gray-500 mr-1" />
              </button>

              <div className="absolute top-full right-0 mt-2 w-56 bg-[#0d1120] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                <Link href="/dashboard/wallet" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                   Wallet
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
          ) : (
            <Link href="/login">
              <button className="bg-gold text-black font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-xl shadow-lg transition-all active:scale-95">
                Login
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050810] border-t border-white/5 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 hover:text-gold uppercase tracking-widest">Home</Link>
              <Link href="/games/mobile-legends/topup" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 hover:text-gold uppercase tracking-widest">Games</Link>
              <Link href="/reseller" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 hover:text-gold uppercase tracking-widest">Reseller</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 hover:text-gold uppercase tracking-widest">Support</Link>
              
              {user ? (
                <>
                  <div className="h-px bg-white/5 my-4" />
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 uppercase tracking-widest">Dashboard</Link>
                  <Link href="/dashboard/orders" onClick={() => setIsOpen(false)} className="block text-xs font-black text-zinc-400 uppercase tracking-widest">Orders</Link>
                  <button onClick={handleSignOut} className="block text-xs font-black text-red-500 uppercase tracking-widest">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="block text-xs font-black text-gold uppercase tracking-widest">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
