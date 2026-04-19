'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Users, Package, Clock, 
  ArrowUpRight, ArrowDownRight, Gem,
  Zap, ShoppingCart, DollarSign, Loader2,
  RefreshCcw
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AnalyticsAdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-gray-400">Failed to load analytics data.</p>
        <Button onClick={fetchStats} variant="outline" className="border-white/10 text-gray-300">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, sub: 'Lifetime sales', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Orders', value: stats.totalOrders || 0, sub: `${stats.pendingOrders || 0} pending`, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Users', value: stats.totalUsers || 0, sub: `${stats.resellerCount || 0} resellers`, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, sub: 'Requires action', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">Business Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time performance overview of ArtisanStore.</p>
        </div>
        <Button onClick={fetchStats} variant="outline" className="border-white/10 text-gray-300">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-[#0d1120] border-white/5 p-6 hover:border-gold/20 transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Status Breakdown */}
        <Card className="lg:col-span-1 bg-[#0d1120] border-white/5 p-8">
          <h3 className="text-lg font-black font-heading text-white uppercase tracking-tighter mb-6">Order Status</h3>
          <div className="space-y-6">
            {Object.entries(stats.ordersByStatus || {}).map(([status, count]: [string, any]) => (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-400">{status}</span>
                  <span className="text-white">{count}</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      status === 'COMPLETED' ? 'bg-green-500' : 
                      status === 'PENDING' ? 'bg-amber-500' : 
                      status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500'
                    }`} 
                    style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-[#0d1120] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-black font-heading text-white uppercase tracking-tighter">Recent Orders</h3>
            <Button variant="ghost" className="text-xs font-black uppercase text-gold">View All Orders</Button>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentOrders?.map((order: any) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                    <Gem size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{order.player}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">{order.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black">{order.amount}</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full ${
                      order.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-gray-500 text-[9px] uppercase">{order.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

