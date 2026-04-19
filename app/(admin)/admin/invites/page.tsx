'use client'

import { useEffect, useState } from 'react'
import { Loader2, Copy, Plus, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AdminInvitesPage() {
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [invites, setInvites] = useState<any[]>([])
  const [selectedMonths, setSelectedMonths] = useState(1)
  const [newLink, setNewLink] = useState('')
  const [newInviteData, setNewInviteData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const fetchInvites = async () => {
    try {
      const res = await fetch('/api/admin/invite/list')
      const data = await res.json()
      
      // Handle plain array OR { links: [...] } OR { invites: [...] }
      if (Array.isArray(data)) {
        setInvites(data)
      } else if (data.links && Array.isArray(data.links)) {
        setInvites(data.links)
      } else if (data.invites && Array.isArray(data.invites)) {
        setInvites(data.invites)
      } else {
        setInvites([])
      }
    } catch (error) {
      toast.error('Failed to load invite links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const handleGenerate = async () => {
    setCreating(true)
    setNewLink('')
    setNewInviteData(null)
    setError('')
    try {
      const res = await fetch('/api/admin/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipMonths: selectedMonths })
      })
      const data = await res.json()
      if (data.link) {
        setNewLink(data.link)
        setNewInviteData(data)
        fetchInvites()
        toast.success('Invite link generated!')
      } else {
        setError(data.error || 'Failed to create invite')
      }
    } catch (error) {
      setError('Failed to generate invite')
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = () => {
    if (!newLink) return
    navigator.clipboard.writeText(newLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
  }

  const durations = [
    { label: '1 Month', value: 1 },
    { label: '3 Months', value: 3 },
    { label: '6 Months', value: 6 },
    { label: '12 Months', value: 12 },
  ]

  return (
    <div className="min-h-screen bg-[#050810] text-white p-8 font-inter">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-l-4 border-[#ffd700] pl-6">
          <h1 className="text-3xl font-black font-orbitron uppercase tracking-tighter italic">Reseller Invites</h1>
          <p className="text-sm text-[#64748b] mt-1 font-medium">Generate and manage reseller invitation links.</p>
        </div>

        {/* Section 1: Generate Link Form */}
        <div className="bg-[#0d1120] border border-[rgba(255,215,0,0.1)] rounded-3xl p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-black font-orbitron uppercase tracking-tighter text-white">Generate Invite Link</h2>
          
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#64748b] uppercase tracking-widest">Membership Duration</p>
            <div className="flex flex-wrap gap-3">
              {durations.map((d) => (
                <div
                  key={d.value}
                  onClick={() => setSelectedMonths(d.value)}
                  className={`px-6 py-3 rounded-xl border cursor-pointer font-bold text-sm transition-all ${
                    selectedMonths === d.value 
                      ? 'border-[#ffd700] bg-[rgba(255,215,0,0.1)] text-[#ffd700]' 
                      : 'border-[rgba(255,215,0,0.1)] bg-[#0d1120] text-[#64748b] hover:border-[#ffd700]/30'
                  }`}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={creating}
            className="bg-[#ffd700] text-[#050810] font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-orbitron shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            {creating ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus size={18} />}
            Generate Link
          </button>

          {error && <p className="text-[#ef4444] text-xs font-bold uppercase tracking-tight">{error}</p>}

          {newLink && (
            <div className="pt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={newLink}
                  className="flex-1 bg-[#050810] border border-[rgba(255,215,0,0.1)] rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#ffd700]/50"
                />
                <button
                  onClick={handleCopy}
                  className="bg-[#0d1120] border border-[rgba(255,215,0,0.1)] rounded-xl px-4 flex items-center justify-center hover:bg-[rgba(255,215,0,0.05)] transition-all text-[#ffd700]"
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#ffd700] font-bold uppercase tracking-tight">
                  This link grants {newInviteData?.membershipMonths} month(s) of reseller access
                </p>
                <p className="text-[11px] text-[#64748b] font-medium">
                  Link expires at: {newInviteData?.expiresAt && format(new Date(newInviteData.expiresAt), 'dd MMM yyyy, HH:mm')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Recent Links Table */}
        <div className="space-y-6">
          <h2 className="text-xl font-black font-orbitron uppercase tracking-tighter text-white">Recent Links</h2>
          
          <div className="bg-[#0d1120] border border-[rgba(255,215,0,0.1)] rounded-[2.5rem] overflow-hidden shadow-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-[rgba(255,215,0,0.1)]">
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">Token</th>
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] text-center">Duration</th>
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] text-center">Created</th>
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] text-center">Expires</th>
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em]">Used By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,215,0,0.05)]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center">
                        <Loader2 className="animate-spin text-[#ffd700] mx-auto w-8 h-8" />
                      </td>
                    </tr>
                  ) : invites.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-[#64748b] italic text-sm font-medium">
                        No invite links generated yet
                      </td>
                    </tr>
                  ) : (
                    invites.map((invite) => {
                      const expired = new Date(invite.expiresAt) < new Date()
                      return (
                        <tr key={invite.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5 font-mono text-xs text-white">
                            {invite.token.substring(0, 8)}...
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-center text-white">
                            {invite.membershipMonths} {invite.membershipMonths === 1 ? 'month' : 'months'}
                          </td>
                          <td className="px-8 py-5 text-[11px] font-medium text-center text-[#64748b]">
                            {format(new Date(invite.createdAt), 'dd MMM yyyy')}
                          </td>
                          <td className="px-8 py-5 text-[11px] font-medium text-center text-[#64748b]">
                            {format(new Date(invite.expiresAt), 'dd MMM HH:mm')}
                          </td>
                          <td className="px-8 py-5 text-center">
                            {invite.isUsed ? (
                              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest">Used</span>
                            ) : expired ? (
                              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[9px] font-black uppercase tracking-widest">Expired</span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">Active</span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-xs font-medium text-white">
                            {invite.usedBy || '—'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
