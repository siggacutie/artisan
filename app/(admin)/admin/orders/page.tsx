'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, MoreVertical, Package, 
  CheckCircle2, XCircle, RefreshCcw, 
  ChevronLeft, ChevronRight, Loader2,
  ExternalLink, User as UserIcon, Gem
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
  }, [page, search, status])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let url = `/api/admin/orders?search=${search}&page=${page}`
      if (status) url += `&status=${status}`
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data.orders ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.pages ?? 1)
    } catch (err) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrder = async (orderId: string, body: any) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Order updated successfully')
        setOrders(orders.map(o => o.id === orderId ? { ...o, ...data } : o))
      } else {
        toast.error(data.error ?? 'Update failed')
      }
    } catch (err) {
      toast.error('Failed to update order')
    }
  }

  const handleRefund = async () => {
    if (!selectedOrder) return
    setRefundModalOpen(false)
    await handleUpdateOrder(selectedOrder.id, { orderStatus: 'REFUNDED' })
    setSelectedOrder(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">PENDING</Badge>
      case 'PROCESSING': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">PROCESSING</Badge>
      case 'COMPLETED': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">COMPLETED</Badge>
      case 'FAILED': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">FAILED</Badge>
      case 'REFUNDED': return <Badge className="bg-zinc-800 text-gray-400 border-white/5">REFUNDED</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">Order Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage customer top-up orders.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Search ID, user or player..." 
              className="pl-10 w-[300px] bg-black/40 border-white/10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
             <button 
               onClick={() => { setStatus(null); setPage(1); }}
               className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!status ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
             >
               All
             </button>
             <button 
               onClick={() => { setStatus('PENDING'); setPage(1); }}
               className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
             >
               Pending
             </button>
             <button 
               onClick={() => { setStatus('COMPLETED'); setPage(1); }}
               className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'text-gray-500 hover:text-gray-300'}`}
             >
               Done
             </button>
          </div>
        </div>
      </div>

      <Card className="bg-[#0d1120] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Order ID & Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">User / Player</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Package</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-xs uppercase tracking-tighter">#{order.id.slice(-8)}</p>
                      <p className="text-gray-500 text-[10px] mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 mb-1">
                          <UserIcon size={12} className="text-gray-500" />
                          <p className="text-gray-300 text-xs font-medium">{order.user.email}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-gold/20 text-gold py-0 h-4">ID {order.playerInputs?.playerId}</Badge>
                          <p className="text-white text-xs font-black uppercase tracking-tighter">{order.mlbbUsername}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <Gem size={12} className="text-blue-400" />
                          <p className="text-white text-sm font-bold">{order.notes || 'Package'}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-black text-lg">₹{order.totalPrice}</p>
                      <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                         {order.paymentStatus}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white hover:bg-white/5">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0d1120] border-white/10 text-gray-300 w-56">
                          <DropdownMenuItem 
                             onClick={() => handleUpdateOrder(order.id, { orderStatus: 'COMPLETED', paymentStatus: 'PAID' })}
                             className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-green-500"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                             onClick={() => handleUpdateOrder(order.id, { orderStatus: 'FAILED' })}
                             className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-red-500"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Mark as Failed
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-white/5" />

                          <DropdownMenuItem 
                            onClick={() => { setSelectedOrder(order); setRefundModalOpen(true); }}
                            className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-amber-500"
                          >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Refund to Wallet
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Total {total} orders found
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="border-white/10 bg-transparent text-gray-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-black text-white px-2">
              {page} / {totalPages}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="border-white/10 bg-transparent text-gray-400 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Refund Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl uppercase tracking-tighter">Refund Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to refund this order? This will credit <span className="text-gold font-bold">₹{selectedOrder?.totalPrice}</span> to the user's wallet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setRefundModalOpen(false)} className="text-gray-400">Cancel</Button>
            <Button 
              onClick={handleRefund}
              className="bg-red-500 text-white font-black uppercase tracking-widest text-xs"
            >
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
