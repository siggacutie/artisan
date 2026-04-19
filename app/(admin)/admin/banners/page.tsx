'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit2, Trash2, MoveUp, MoveDown, 
  Eye, Image as ImageIcon, Link as LinkIcon, 
  Type, Loader2, Save
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      setBanners(data)
    } catch (err) {
      toast.error('Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const isNew = !editingBanner.id
    const method = isNew ? 'POST' : 'PATCH'
    const url = isNew ? '/api/admin/banners' : `/api/admin/banners/${editingBanner.id}`
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBanner)
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success(isNew ? 'Banner created' : 'Banner updated')
        fetchBanners()
        setShowForm(false)
        setEditingBanner(null)
      } else {
        toast.error(data.error ?? 'Save failed')
      }
    } catch (err) {
      toast.error('Failed to save banner')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Banner deleted')
        setBanners(banners.filter(b => b.id !== id))
      } else {
        toast.error('Delete failed')
      }
    } catch (err) {
      toast.error('Failed to delete banner')
    }
  }

  const startEdit = (banner: any) => {
    setEditingBanner(banner)
    setShowForm(true)
  }

  const startNew = () => {
    setEditingBanner({
      title: 'New Promotional Offer',
      subtitle: 'Limited time only',
      ctaText: 'Buy Now',
      ctaLink: '/games/mobile-legends/topup',
      gradientStart: '#1e3a8a',
      gradientEnd: '#1e40af',
      isActive: true,
      sortOrder: banners.length
    })
    setShowForm(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">Banner Manager</h1>
          <p className="text-gray-400 mt-1">Configure promotional banners for the homepage carousel.</p>
        </div>
        {!showForm && (
          <Button onClick={startNew} className="bg-gold text-black font-black uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" />
            Add New Banner
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-[#0d1120] border-gold/20 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
          
          <form onSubmit={handleSaveBanner} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Banner Title</label>
                  <Input 
                    required
                    value={editingBanner.title}
                    onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subtitle Text</label>
                  <Input 
                    required
                    value={editingBanner.subtitle}
                    onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CTA Button Text</label>
                    <Input 
                      required
                      value={editingBanner.ctaText}
                      onChange={e => setEditingBanner({...editingBanner, ctaText: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CTA Link</label>
                    <Input 
                      required
                      value={editingBanner.ctaLink}
                      onChange={e => setEditingBanner({...editingBanner, ctaLink: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gradient Start (Hex)</label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded border border-white/10" style={{ backgroundColor: editingBanner.gradientStart }} />
                      <Input 
                        required
                        pattern="^#[0-9a-fA-F]{6}$"
                        value={editingBanner.gradientStart}
                        onChange={e => setEditingBanner({...editingBanner, gradientStart: e.target.value})}
                        className="bg-black/40 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gradient End (Hex)</label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded border border-white/10" style={{ backgroundColor: editingBanner.gradientEnd }} />
                      <Input 
                        required
                        pattern="^#[0-9a-fA-F]{6}$"
                        value={editingBanner.gradientEnd}
                        onChange={e => setEditingBanner({...editingBanner, gradientEnd: e.target.value})}
                        className="bg-black/40 border-white/10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sort Order</label>
                    <Input 
                      type="number"
                      required
                      value={editingBanner.sortOrder}
                      onChange={e => setEditingBanner({...editingBanner, sortOrder: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
                    <div className="flex items-center h-10 gap-4">
                       <button 
                         type="button"
                         onClick={() => setEditingBanner({...editingBanner, isActive: !editingBanner.isActive})}
                         className={`w-12 h-6 rounded-full transition-all relative ${editingBanner.isActive ? "bg-green-500" : "bg-zinc-800"}`}
                       >
                         <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${editingBanner.isActive ? "translate-x-6" : "translate-x-0"}`} />
                       </button>
                       <span className="text-xs font-bold text-gray-400">{editingBanner.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Preview</p>
                  <div 
                    className="h-12 px-6 rounded-lg flex flex-col justify-center min-w-[200px]"
                    style={{ background: `linear-gradient(135deg, ${editingBanner.gradientStart}, ${editingBanner.gradientEnd})` }}
                  >
                    <p className="text-white text-[10px] font-black uppercase leading-none">{editingBanner.title}</p>
                    <p className="text-white/70 text-[8px] mt-0.5">{editingBanner.subtitle}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">Cancel</Button>
                 <Button type="submit" disabled={saving} className="bg-gold text-black font-black uppercase tracking-widest text-xs px-8">
                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                   Save Banner
                 </Button>
               </div>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <Card className="lg:col-span-2 p-20 flex flex-col items-center justify-center bg-[#0d1120] border-white/5">
             <ImageIcon className="w-12 h-12 text-gray-700 mb-4" />
             <p className="text-gray-500 font-bold uppercase tracking-widest">No banners configured yet.</p>
          </Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="bg-[#0d1120] border-white/5 overflow-hidden group">
              <div 
                className="h-32 p-8 flex flex-col justify-center relative"
                style={{ background: `linear-gradient(135deg, ${banner.gradientStart}, ${banner.gradientEnd})` }}
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <Button onClick={() => startEdit(banner)} size="icon" className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/10">
                     <Edit2 className="w-3.5 h-3.5" />
                   </Button>
                   <Button onClick={() => handleDeleteBanner(banner.id)} size="icon" className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 border-red-500/20">
                     <Trash2 className="w-3.5 h-3.5" />
                   </Button>
                </div>
                <h3 className="text-xl font-black font-heading text-white uppercase tracking-tighter leading-none">{banner.title}</h3>
                <p className="text-white/70 text-sm mt-1">{banner.subtitle}</p>
              </div>
              <div className="px-8 py-4 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MoveUp size={12} />
                      <MoveDown size={12} />
                      <span>Order: {banner.sortOrder}</span>
                   </div>
                   <Badge className={banner.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-zinc-800 text-gray-500 border-white/5"}>
                     {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
                   </Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                   <LinkIcon size={10} />
                   {banner.ctaLink}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
