'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from "@/components/admin/Sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      setAuthorized(true)
      return
    }

    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.admin) {
          setAuthorized(true)
        } else {
          router.replace('/admin/login')
        }
      })
      .catch(() => router.replace('/admin/login'))
      .finally(() => setChecking(false))
  }, [pathname, router])

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Inter', color: '#475569', fontSize: '14px' }}>Verifying access...</div>
      </div>
    )
  }

  if (!authorized && pathname !== '/admin/login') return null

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#050810]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-6 pb-12">
        {children}
      </main>
    </div>
  )
}
