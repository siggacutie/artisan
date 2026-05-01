'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCcw, Loader2, AlertTriangle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    out_of_stock_enabled: false,
    restock_timer: ''
  })

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings({
        out_of_stock_enabled: data.out_of_stock_enabled === 'true',
        restock_timer: data.restock_timer || ''
      })
    } catch (err) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          out_of_stock_enabled: settings.out_of_stock_enabled,
          restock_timer: settings.restock_timer
        })
      })

      if (res.ok) {
        toast.success("Settings updated successfully")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update settings")
      }
    } catch (err) {
      toast.error("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto font-inter">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white uppercase italic tracking-tighter">Site Settings</h1>
          <p className="text-gray-400 mt-1 font-inter">Manage global site availability and features</p>
        </div>
        <Button onClick={fetchSettings} variant="outline" className="border-gold/20 text-gold hover:bg-gold/10">
          <RefreshCcw size={16} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="bg-[#0d1120] border-gold/10 overflow-hidden relative">
          {settings.out_of_stock_enabled && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gold animate-pulse" />
          )}
          <CardHeader>
            <CardTitle className="text-lg font-orbitron text-gold flex items-center gap-2 uppercase tracking-tighter">
              <AlertTriangle size={18} /> Maintenance & Inventory
            </CardTitle>
            <CardDescription className="text-gray-500 font-inter">
              Toggle &quot;Out of Stock&quot; mode to lock the site and show a restock timer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-[#050810] border border-white/5 rounded-xl">
              <div className="space-y-1">
                <Label htmlFor="out-of-stock" className="text-white font-bold uppercase tracking-widest text-xs">
                  Out of Stock Mode
                </Label>
                <p className="text-xs text-gray-500">
                  When enabled, all pages under (main) will be blocked by an overlay.
                </p>
              </div>
              <Switch 
                id="out-of-stock"
                checked={settings.out_of_stock_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, out_of_stock_enabled: checked })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold font-orbitron text-xs uppercase tracking-widest">
                <Clock size={14} />
                Restock Timer
              </div>
              <div className="grid gap-2">
                <Input 
                  type="datetime-local"
                  value={settings.restock_timer}
                  onChange={(e) => setSettings({ ...settings, restock_timer: e.target.value })}
                  className="bg-[#050810] border-white/5 text-white h-12"
                />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter px-1">
                  Leave empty to hide the timer. The overlay will still be visible if enabled.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full bg-gold text-black font-black uppercase tracking-widest hover:bg-gold-bright py-8 text-sm"
              disabled={saving}
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
              Save Site Settings
            </Button>
          </CardContent>
        </Card>

        {settings.out_of_stock_enabled && (
          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="text-gold shrink-0 mt-1" size={20} />
            <div className="space-y-1">
              <h4 className="text-gold font-orbitron font-bold uppercase tracking-tighter text-sm">Site Currently Locked</h4>
              <p className="text-gray-400 text-xs font-inter leading-relaxed">
                The &quot;Out of Stock&quot; overlay is active. Regular users cannot access the shop or dashboard until this is disabled. 
                Admin pages remain accessible to you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
