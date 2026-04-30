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
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.07 } }
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
}

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
    <div className="space-y-8">
      <h1 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Order History
      </h1>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            variants={cardVariants}
            style={{
              background: 'linear-gradient(135deg, #0d1120 0%, #0a0f1e 100%)',
              border: '1px solid rgba(255,215,0,0.08)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0,195,255,0.15), rgba(0,195,255,0.05))',
                  border: '1px solid rgba(0,195,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,195,255,0.1)',
                }}>
                  <PackageOpen size={24} color="#00c3ff" />
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#00c3ff', fontFamily: 'Inter', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {(() => {
                        let name = '';
                        if (!order.notes) {
                          name = order.type === 'TOPUP' ? 'Diamond Top-Up' : 'Order';
                        } else if (order.notes.includes('|')) {
                          name = order.notes.split('|')[0].trim();
                        } else {
                          name = order.notes;
                        }

                        // Fix for old orders with partial or incorrect labels
                        if (name === '0 Diamonds' || name === 'Diamond Top-Up') {
                          if (order.totalPrice >= 140 && order.totalPrice <= 160) name = 'Weekly Diamond Pass';
                          else if (order.totalPrice >= 70 && order.totalPrice <= 85) name = 'Elite Weekly Package';
                          else if (order.totalPrice >= 350 && order.totalPrice <= 420) name = 'Epic Monthly Package';
                        } else if (name.startsWith('+') && name.includes('Diamonds')) {
                          // Fix for labels that only show the bonus
                          const bonusMatch = name.match(/\d+/);
                          if (bonusMatch) {
                            const bonus = parseInt(bonusMatch[0]);
                            const mapping: Record<number, number> = {
                              8: 78, 16: 156, 23: 234, 81: 625, 335: 1860, 589: 3099, 883: 4649,
                              5: 50, 15: 150, 25: 250, 65: 500
                            };
                            if (mapping[bonus]) name = `${mapping[bonus]} ${name}`;
                          }
                        }

                        // Clean up product name formatting
                        return name
                          .replace(/Diamonds/gi, '💎')
                          .replace(/Weekly Diamond Pass/gi, 'Weekly Pass 🎫')
                          .replace(/Elite Weekly Package/gi, 'Elite Pass 🛡️')
                          .replace(/Epic Monthly Package/gi, 'Epic Pass 👑')
                          .replace(/\s+\+\s+/g, '+')
                          .trim();
                      })()}
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(order.id);
                        alert('Order ID copied to clipboard');
                      }}
                      style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                      title="Click to copy full Order ID"
                    >
                      #{order.id.substring(0, 8)}
                    </button>
                  </div>
                  <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>
                    {Math.ceil(order.totalPrice)} <span style={{ fontSize: '11px', opacity: 0.8 }}>COINS</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between md:items-end gap-2">
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  backgroundColor: 
                    order.orderStatus === 'COMPLETED' ? 'rgba(34,197,94,0.1)' :
                    order.orderStatus === 'PENDING' ? 'rgba(245,158,11,0.1)' :
                    order.orderStatus === 'PROCESSING' ? 'rgba(0,195,255,0.1)' :
                    'rgba(239,68,68,0.1)',
                  color: 
                    order.orderStatus === 'COMPLETED' ? '#22c55e' :
                    order.orderStatus === 'PENDING' ? '#f59e0b' :
                    order.orderStatus === 'PROCESSING' ? '#00c3ff' :
                    '#ef4444',
                  border: '1px solid currentColor',
                  opacity: 0.8
                }}>
                  {order.orderStatus}
                </div>
                <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', textAlign: 'right' }}>
                  {order.orderStatus === 'COMPLETED' && order.completedAt ? (
                    <>
                      <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>Delivered At</div>
                      {new Date(order.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : (
                    new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
