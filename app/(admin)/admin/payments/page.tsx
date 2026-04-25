'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter, ChevronLeft, ChevronRight, User, Hash, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'

type PaymentLink = {
  id: string
  userId: string
  amount: number
  upiRef: string
  status: string
  utrNumber: string | null
  expiresAt: string
  createdAt: string
  completedAt: string | null
  utrSubmittedAt: string | null
  user: {
    username: string | null
    id: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)

  useEffect(() => {
    fetchPayments()
  }, [statusFilter, page])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/payments?status=${statusFilter}&page=${page}`)
      const data = await res.json()
      if (res.ok) {
        setPayments(data.payments)
        setTotal(data.total)
      } else {
        toast.error(data.error || 'Failed to fetch payments')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'confirm' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return

    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Payment ${action}ed successfully`)
        fetchPayments()
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>PENDING</span>
      case 'UTR_SUBMITTED':
        return <span style={{ background: 'rgba(0,195,255,0.1)', color: '#00c3ff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>UTR SUBMITTED</span>
      case 'COMPLETED':
        return <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>COMPLETED</span>
      case 'EXPIRED':
        return <span style={{ background: 'rgba(71,85,105,0.1)', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>EXPIRED</span>
      default:
        return <span>{status}</span>
    }
  }

  return (
    <div style={{ padding: '24px', color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: 'Orbitron', color: '#ffd700', margin: 0 }}>Payment Links</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Review and approve UPI payments</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ background: '#0d1120', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', outline: 'none' }}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UTR_SUBMITTED">UTR Submitted</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button onClick={fetchPayments} style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ background: '#0d1120', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px' }}>User</th>
              <th style={{ padding: '16px' }}>Amount</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>UTR / UPI Ref</th>
              <th style={{ padding: '16px' }}>Created</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No payments found.</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,215,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd700' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{p.user.username || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>{p.userId}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: '#ffd700', fontWeight: '700', fontSize: '16px' }}>₹{p.amount}</div>
                </td>
                <td style={{ padding: '16px' }}>{getStatusBadge(p.status)}</td>
                <td style={{ padding: '16px' }}>
                  {p.utrNumber ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '13px' }}>{p.utrNumber}</span>
                      <span style={{ color: '#475569', fontSize: '11px' }}>{p.upiRef}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#475569', fontSize: '13px' }}>{p.upiRef}</span>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(p.createdAt).toLocaleString()}</div>
                  {p.utrSubmittedAt && (
                    <div style={{ color: '#00c3ff', fontSize: '10px', marginTop: '2px' }}>UTR: {new Date(p.utrSubmittedAt).toLocaleTimeString()}</div>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  {p.status === 'UTR_SUBMITTED' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleAction(p.id, 'confirm')}
                        style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleAction(p.id, 'reject')}
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#334155', fontSize: '12px' }}>No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {total > limit && (
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#475569', fontSize: '13px' }}>Showing {(page-1)*limit + 1} to {Math.min(page*limit, total)} of {total}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ background: '#050810', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', color: page === 1 ? '#334155' : '#94a3b8', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                style={{ background: '#050810', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', color: page * limit >= total ? '#334155' : '#94a3b8', cursor: page * limit >= total ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RefreshCw({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
  )
}
