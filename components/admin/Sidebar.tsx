'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Users, Package, 
  Tag, Image as ImageIcon, Settings, 
  TrendingUp, LogOut, ChevronRight,
  Gem, CreditCard, Search, Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Settings },
  { label: 'User Manager', href: '/admin/users', icon: Users },
  { label: 'Order History', href: '/admin/orders', icon: Package },
  { label: 'Diamond Packages', href: '/admin/packages', icon: Gem },
  { label: 'Pricing Config', href: '/admin/pricing', icon: TrendingUp },
  { label: 'Banner Manager', href: '/admin/banners', icon: ImageIcon },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Payment Queue', href: '/admin/payments', icon: CreditCard },
  { label: 'Player Lookup', href: '/admin/lookup', icon: Search },
  { label: 'Invites', href: '/admin/invites', icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.admin) setAdmin(data.admin)
      })
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-[#0d1120] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-orbitron font-black text-lg text-white tracking-tighter uppercase group-hover:text-gold transition-colors">
            ARTISAN<span className="text-gold font-normal">ADMIN</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-gold text-black shadow-[0_0_20px_rgba(255,215,0,0.15)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn("transition-colors", isActive ? "text-black" : "text-gray-500 group-hover:text-gold")} />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-black" />}
            </Link>
          )
        })}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-black">
            {admin?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white uppercase truncate">{admin?.email?.split('@')[0] ?? 'Admin'}</span>
            <span className="text-[10px] text-gray-500 truncate">{admin?.email}</span>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={18} className="group-hover:text-red-500" />
          <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.2);
        }
      `}</style>
    </aside>
  )
}
