'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, UserPlus, ShieldAlert, ShieldCheck, 
  MoreVertical, UserMinus, History, Ban, 
  Unlock, Trash2, LogOut, FileText, Copy, ExternalLink,
  Mail, Clock, Filter, Key, User as UserIcon, Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

function Toggle({ value, onChange, labelOn, labelOff }: {
  value: boolean;
  onChange: (v: boolean) => void;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '8px 12px',
      }}
      className="hover:bg-white/5 rounded-xl transition-colors"
    >
      <div style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        background: value ? '#22c55e' : '#ef4444',
        position: 'relative',
        transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute',
          top: '3px',
          left: value ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ color: '#fff', fontFamily: 'Inter', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {value ? labelOn : labelOff}
      </span>
    </div>
  );
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/reseller/auth/me')
      .then(async r => {
        if (r.ok) {
          const data = await r.json()
          setUser(data)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingAuth(false))
  }, [router])

  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  
  const [durationModalOpen, setDurationModalOpen] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(1)
  const [pendingResellerAction, setPendingResellerAction] = useState<boolean>(true)

  const [usernameModalOpen, setUsernameModalOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [newWalletBalance, setNewWalletBalance] = useState('')

  const [revokeModalOpen, setRevokeModalOpen] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      if (search) params.append('search', search)
      
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await res.json()
      
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users)
        setTotal(data.total)
      } else {
        setUsers([])
      }
    } catch (err) {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const handlePatch = async (userId: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        toast.success(`User updated successfully`)
        fetchUsers()
        setNoteModalOpen(false)
        setDurationModalOpen(false)
        setUsernameModalOpen(false)
        setPasswordModalOpen(false)
      } else {
        const err = await res.json()
        toast.error(err.error || "Update failed")
      }
    } catch (err) {
      toast.error("Error updating user")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this account? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Account deleted permanently")
        fetchUsers()
      } else {
        const err = await res.json()
        toast.error(err.error || "Delete failed")
      }
    } catch (err) {
      toast.error("Error deleting user")
    }
  }

  const openDurationModal = (user: any, isGranting: boolean) => {
    setSelectedUser(user)
    setPendingResellerAction(isGranting)
    if (isGranting) {
      setDurationModalOpen(true)
    } else {
      handlePatch(user.id, { isReseller: false })
    }
  }

  const confirmResellerGrant = () => {
    handlePatch(selectedUser.id, { 
      isReseller: true, 
      membershipMonths: selectedDuration 
    })
  }

  const handleRevokeMembership = async () => {
    if (!selectedUser) return
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokeMembership: true })
      })
      if (res.ok) {
        toast.success("Membership revoked successfully")
        fetchUsers()
        setRevokeModalOpen(false)
      } else {
        const err = await res.json()
        toast.error(err.error || "Revocation failed")
      }
    } catch (err) {
      toast.error("Error revoking membership")
    }
  }

  const openNoteModal = (user: any) => {
    setSelectedUser(user)
    setNoteText(user.adminNote || '')
    setNoteModalOpen(true)
  }

  const openUsernameModal = (user: any) => {
    setSelectedUser(user)
    setNewUsername(user.username || '')
    setUsernameModalOpen(true)
  }

  const openPasswordModal = (user: any) => {
    setSelectedUser(user)
    setNewPassword('')
    setPasswordModalOpen(true)
  }

  const getStatusBadge = (user: any) => {
    if (user.isBanned) return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 uppercase text-[9px] font-black">BANNED</Badge>
    if (user.isFrozen) return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[9px] font-black">FROZEN</Badge>
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 uppercase text-[9px] font-black">ACTIVE</Badge>
  }

  const durations = [
    { label: '1 Month', value: 1, price: '₹250' },
    { label: '3 Months', value: 3, price: '₹699' },
    { label: '6 Months', value: 6, price: '₹1,299' },
    { label: '12 Months', value: 12, price: '₹2,699' },
  ]

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-inter text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-orbitron font-bold uppercase italic tracking-tighter">User Management</h1>
          <p className="text-[#64748b] mt-1 text-sm font-medium">Manage resellers and access control</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#0d1120] border-white/5 rounded-[2rem]">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
            <Input 
              placeholder="Search by username, email or name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#050810] border-white/5 pl-12 h-14 rounded-2xl placeholder:text-[#334155] focus:border-[#ffd700]/30 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="bg-[#0d1120] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[#64748b] text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">User / Username</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Membership</th>
                <th className="px-8 py-6">Wallet</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-[#64748b] italic">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-[#ffd700] transition-colors">{user.username || user.name || 'Anonymous'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#64748b] text-xs font-medium">{user.email || 'No email'}</span>
                          {user.email && (
                            <Badge className={user.emailVerified 
                              ? "bg-green-500/10 text-green-500 border-green-500/20 text-[8px] px-1.5 py-0" 
                              : "bg-red-500/10 text-red-500 border-red-500/20 text-[8px] px-1.5 py-0"
                            }>
                              {user.emailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black tracking-widest px-3 py-1.5 rounded-lg border uppercase ${
                        user.role === 'SUPER_ADMIN' ? 'border-[#ffd700] text-[#ffd700] bg-[#ffd700]/5' : 
                        user.role === 'ADMIN' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-white/10 text-[#64748b] bg-white/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-8 py-6">
                      {user.membershipExpiresAt ? (
                        <span className={`text-xs font-bold ${new Date(user.membershipExpiresAt) > new Date() ? 'text-green-500' : 'text-red-500'}`}>
                          {new Date(user.membershipExpiresAt) > new Date() ? 'Expires' : 'Expired'} {format(new Date(user.membershipExpiresAt), 'dd MMM yyyy')}
                        </span>
                      ) : (
                        <span className="text-xs text-[#64748b]"> — </span>
                      )}
                    </td>
                    <td className="px-8 py-6 font-orbitron font-bold text-[#ffd700]">
                      ₹{user.walletBalance.toFixed(0)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-[#64748b] hover:text-white hover:bg-white/5">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0d1120] border-white/10 text-[#64748b] w-64 rounded-2xl p-2 shadow-3xl">
                          <DropdownMenuItem onClick={() => openNoteModal(user)} className="focus:bg-white/5 rounded-xl p-3 cursor-pointer">
                            <FileText size={16} className="mr-3" /> 
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Admin Note</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => openUsernameModal(user)} className="focus:bg-white/5 rounded-xl p-3 cursor-pointer">
                            <UserIcon size={16} className="mr-3" /> 
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Change Username</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => openPasswordModal(user)} className="focus:bg-white/5 rounded-xl p-3 cursor-pointer">
                            <Key size={16} className="mr-3" /> 
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Change Password</span>
                          </DropdownMenuItem>

                          <div className="p-1">
                            <Toggle
                              value={!user.emailDisabled}
                              onChange={async (enabled) => {
                                await handlePatch(user.id, { emailDisabled: !enabled });
                              }}
                              labelOn="Email 2FA: ON"
                              labelOff="Email 2FA: OFF"
                            />
                          </div>

                          <DropdownMenuSeparator className="bg-white/5 mx-2" />

                          {user.isReseller ? (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setRevokeModalOpen(true); }} className="focus:bg-red-500/10 text-red-500 rounded-xl p-3 cursor-pointer">
                                <ShieldCheck size={16} className="mr-3" /> 
                                <span className="text-xs font-bold uppercase tracking-widest">Revoke Membership</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDurationModal(user, false)} className="focus:bg-red-500/10 text-red-500 rounded-xl p-3 cursor-pointer">
                                <UserMinus size={16} className="mr-3" /> 
                                <span className="text-xs font-bold uppercase tracking-widest">Revoke Reseller</span>
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem onClick={() => openDurationModal(user, true)} className="focus:bg-[#ffd700]/10 text-[#ffd700] rounded-xl p-3 cursor-pointer">
                              <UserPlus size={16} className="mr-3" /> 
                              <span className="text-xs font-bold uppercase tracking-widest">Make Reseller</span>
                            </DropdownMenuItem>
                          )}

                          {user.isBanned ? (
                            <DropdownMenuItem onClick={() => handlePatch(user.id, { isBanned: false })} className="focus:bg-green-500/10 text-green-500 rounded-xl p-3 cursor-pointer">
                              <Unlock size={16} className="mr-3" /> 
                              <span className="text-xs font-bold uppercase tracking-widest">Unban User</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handlePatch(user.id, { isBanned: true })} className="focus:bg-red-500/10 text-red-500 rounded-xl p-3 cursor-pointer">
                              <Ban size={16} className="mr-3" /> 
                              <span className="text-xs font-bold uppercase tracking-widest">Ban User</span>
                            </DropdownMenuItem>
                          )}

                          {user.isFrozen ? (
                            <DropdownMenuItem onClick={() => handlePatch(user.id, { isFrozen: false })} className="focus:bg-blue-500/10 text-blue-400 rounded-xl p-3 cursor-pointer">
                              <Unlock size={16} className="mr-3" /> 
                              <span className="text-xs font-bold uppercase tracking-widest">Unfreeze Wallet</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handlePatch(user.id, { isFrozen: true })} className="focus:bg-blue-500/10 text-blue-400 rounded-xl p-3 cursor-pointer">
                              <ShieldAlert size={16} className="mr-3" /> 
                              <span className="text-xs font-bold uppercase tracking-widest">Freeze Wallet</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="bg-white/5 mx-2" />

                          <DropdownMenuItem onClick={() => handleDelete(user.id)} className="focus:bg-red-500/20 text-red-500 rounded-xl p-3 cursor-pointer">
                            <Trash2 size={16} className="mr-3" /> 
                            <span className="text-xs font-bold uppercase tracking-widest">Delete Account</span>
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
      </Card>

      {/* Note Modal */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/5 text-white max-w-lg rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-orbitron italic uppercase">Admin Note: {selectedUser?.username || selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Textarea 
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Enter admin notes here..."
              className="bg-[#050810] border-white/5 rounded-2xl h-48 focus:border-[#ffd700]/30 transition-all resize-none p-6 text-sm"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => handlePatch(selectedUser.id, { adminNote: noteText })}
              className="w-full bg-[#ffd700] text-[#050810] font-black uppercase tracking-widest h-14 rounded-xl shadow-glow-gold"
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Username Modal */}
      <Dialog open={usernameModalOpen} onOpenChange={setUsernameModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/5 text-white max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-orbitron italic uppercase">Change Username</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Input 
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="New username"
              className="bg-[#050810] border-white/5 rounded-xl h-12"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => handlePatch(selectedUser.id, { username: newUsername })}
              className="w-full bg-[#ffd700] text-[#050810] font-black uppercase tracking-widest h-12 rounded-xl"
            >
              Update Username
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/5 text-white max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-orbitron italic uppercase">Change Password</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Input 
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="bg-[#050810] border-white/5 rounded-xl h-12"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => handlePatch(selectedUser.id, { newPassword: newPassword })}
              className="w-full bg-[#ffd700] text-[#050810] font-black uppercase tracking-widest h-12 rounded-xl"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duration Selector Modal */}
      <Dialog open={durationModalOpen} onOpenChange={setDurationModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/5 text-white max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="font-orbitron italic uppercase text-xl">Set Membership Duration</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-8">
            {durations.map((d) => (
              <div
                key={d.value}
                onClick={() => setSelectedDuration(d.value)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDuration === d.value 
                    ? 'border-[#ffd700] bg-[#ffd700]/10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className={`text-xs font-black uppercase tracking-widest ${selectedDuration === d.value ? 'text-[#ffd700]' : 'text-white'}`}>
                  {d.label}
                </p>
                <p className="text-[10px] text-[#64748b] mt-1 font-bold">{d.price}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={confirmResellerGrant}
              className="w-full bg-[#ffd700] text-[#050810] font-black uppercase tracking-widest h-14 rounded-xl shadow-glow-gold"
            >
              Confirm & Grant Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke Membership Modal */}
      <Dialog open={revokeModalOpen} onOpenChange={setRevokeModalOpen}>
        <DialogContent className="bg-[#0d1120] border-white/5 text-white max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="font-orbitron italic uppercase text-red-500">Revoke Membership</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-[#64748b] font-medium leading-relaxed">
              This will immediately expire <strong className="text-white">{selectedUser?.username || selectedUser?.email}</strong>'s membership. 
              Their reseller access will be revoked instantly. They can renew by purchasing a new membership.
            </p>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="ghost"
              onClick={() => setRevokeModalOpen(false)}
              className="flex-1 bg-white/5 text-[#64748b] hover:text-white h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRevokeMembership}
              className="flex-1 bg-red-500 text-white font-black uppercase tracking-widest h-12 rounded-xl"
            >
              Revoke Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
