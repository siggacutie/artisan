"use client";

import React, { useState, useEffect } from "react";
import { 
  PackageOpen
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiamondSVG } from "@/components/shared/Icons";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([]);

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
      .catch(() => setUser(null))
  }, [router])

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('/api/dashboard/orders')
      .then(r => r.json())
      .then(o => {
        setOrders(o.orders ?? []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-orbitron text-white tracking-tight uppercase">Order History</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0d1120] border border-white/5 h-[120px] rounded-2xl animate-pulse-fast" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-orbitron text-white tracking-tight uppercase">Order History</h3>
        <div className="bg-[#0d1120]/50 border border-white/5 rounded-2xl p-20 flex flex-col items-center text-center space-y-4">
          <PackageOpen size={40} color="#334155" />
          <p className="text-[#475569] text-sm font-medium uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>No orders yet</p>
          <Link href="/games">
            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold hover:text-black font-black uppercase tracking-widest px-8">
              Browse Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron text-white tracking-tight uppercase">Order History</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="group relative bg-[#0d1120] border border-[rgba(255,215,0,0.08)] rounded-[10px] p-4 md:p-6 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center border border-white/5">
                  <DiamondSVG className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[rgba(0,195,255,0.1)] text-[#00c3ff] text-[11px] font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'Inter' }}>
                      {order.type === 'TOPUP' ? 'Diamond Top-Up' : 'Order'}
                    </span>
                    <span className="text-[#64748b] text-[11px] font-mono">{order.id.substring(0, 8)}</span>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-white mt-1">{Math.ceil(order.totalPrice / 1.5)} coins</h4>
                  {order.playerUsername && (
                    <p className="text-[#94a3b8] text-[12px] mt-0.5">For: {order.playerUsername}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <Badge className={
                  order.orderStatus === 'COMPLETED' ? "bg-green-500/10 text-[#22c55e] border-none text-[10px] px-2 uppercase font-bold" :
                  order.orderStatus === 'PENDING' ? "bg-yellow-500/10 text-[#f59e0b] border-none text-[10px] px-2 uppercase font-bold" :
                  order.orderStatus === 'PROCESSING' ? "bg-blue-500/10 text-[#00c3ff] border-none text-[10px] px-2 uppercase font-bold" :
                  "bg-red-500/10 text-[#ef4444] border-none text-[10px] px-2 uppercase font-bold"
                }>
                  {order.orderStatus}
                </Badge>
                <p className="text-[#475569] text-[11px] mt-2" style={{ fontFamily: 'Inter' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
