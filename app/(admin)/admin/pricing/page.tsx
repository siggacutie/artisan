'use client'
import { useState, useEffect } from 'react'
import { Save, RefreshCcw, TrendingUp, Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PACKAGE_DEFINITIONS } from '@/lib/pricing'

export default function AdminPricingPage() {
  const [smilecoinConfig, setSmilecoinConfig] = useState({
    smilecoinsAmount: 10000,
    inrPaid: 19000,
    markupPercent: 1.1
  })
  const [landingDiscount, setLandingDiscount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingLanding, setSavingLanding] = useState(false)
  const [admin, setAdmin] = useState<any>(null)

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/auth/me')
      const data = await res.json()
      if (data.admin) setAdmin(data.admin)

      const pRes = await fetch('/api/pricing/current')
      const pData = await pRes.json()
      if (pData.scRate) {
        setSmilecoinConfig({
          smilecoinsAmount: pData.smilecoinsAmount || 10000,
          inrPaid: pData.inrPaid || (pData.scRate * (pData.smilecoinsAmount || 10000)),
          markupPercent: pData.markup || pData.userMarkup || 1.1
        })
      }

      // Fetch landing page discount
      const lpRes = await fetch('/api/admin/pricing')
      const lpData = await lpRes.json()
      if (lpData && typeof lpData.landingPageDiscountPercent === 'number') {
        setLandingDiscount(lpData.landingPageDiscountPercent)
      }
    } catch (err) {
      toast.error("Failed to load configuration")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/pricing/smilecoin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smilecoinConfig)
      })
      if (res.ok) {
        toast.success("Pricing configuration saved")
        fetchConfig()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save configuration")
      }
    } catch (err) {
      toast.error("Error saving configuration")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLanding = async () => {
    setSavingLanding(true)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landingPageDiscountPercent: landingDiscount })
      })
      if (res.ok) {
        toast.success("Display setting saved")
        fetchConfig()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save display setting")
      }
    } catch (err) {
      toast.error("Error saving display setting")
    } finally {
      setSavingLanding(false)
    }
  }

  const scRate = smilecoinConfig.inrPaid / smilecoinConfig.smilecoinsAmount

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto font-inter">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white uppercase italic">Pricing Configuration</h1>
          <p className="text-gray-400 mt-1">Manage SmileCoin rates and reseller markups</p>
        </div>
        <Button onClick={fetchConfig} variant="outline" className="border-gold/20 text-gold hover:bg-gold/10">
          <RefreshCcw size={16} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        <Card className="bg-[#0d1120] border-gold/10">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron text-gold flex items-center gap-2 uppercase tracking-tighter">
              <TrendingUp size={18} /> SmileCoin Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">SmileCoins Purchased</label>
                <Input 
                  type="number" 
                  value={smilecoinConfig.smilecoinsAmount} 
                  onChange={e => setSmilecoinConfig({...smilecoinConfig, smilecoinsAmount: parseFloat(e.target.value)})}
                  className="bg-[#050810] border-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Amount Paid (INR)</label>
                <Input 
                  type="number" 
                  value={smilecoinConfig.inrPaid} 
                  onChange={e => setSmilecoinConfig({...smilecoinConfig, inrPaid: parseFloat(e.target.value)})}
                  className="bg-[#050810] border-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Markup %</label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={smilecoinConfig.markupPercent} 
                  onChange={e => setSmilecoinConfig({...smilecoinConfig, markupPercent: parseFloat(e.target.value)})}
                  className="bg-[#050810] border-white/5 text-white"
                />
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/10 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-gold/60" />
                <span className="text-sm text-gray-400">Effective Rate:</span>
              </div>
              <span className="text-xl font-orbitron font-bold text-gold">₹{scRate.toFixed(4)} <span className="text-xs text-gray-500">/ SC</span></span>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full bg-gold text-black font-bold hover:bg-gold-bright py-6"
              disabled={saving}
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* New Landing Page Display Prices Section */}
        <Card className="bg-[#0d1120] border-gold/10">
          <CardHeader>
            <CardTitle className="text-[18px] font-orbitron text-white uppercase tracking-tighter">
              Landing Page Display Prices
            </CardTitle>
            <p className="text-[13px] font-inter text-[#64748b] mt-1">
              Reduce displayed prices on the public homepage to attract visitors. This does not affect actual reseller prices, navbar prices, or topup page prices.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-inter text-[#64748b]">Display Price Reduction %</label>
              <Input 
                type="number" 
                min={0}
                max={50}
                step={0.1}
                placeholder="0"
                value={landingDiscount} 
                onChange={e => setLandingDiscount(parseFloat(e.target.value) || 0)}
                className="bg-[#0d1120] border-gold/10 text-white w-[120px] h-[40px] px-[14px] py-[10px] rounded-[8px] font-inter focus:ring-gold/20"
              />
              <p className="text-[12px] font-inter text-[#475569]">
                Example: entering 5 will show ₹190 instead of ₹200 on the homepage.
              </p>
            </div>

            <Button 
              onClick={handleSaveLanding} 
              className="bg-[#ffd700] text-[#050810] font-orbitron font-bold rounded-[8px] px-[20px] py-[10px] hover:bg-[#ffd700]/90 h-auto"
              disabled={savingLanding}
            >
              {savingLanding ? <Loader2 size={16} className="animate-spin mr-2" /> : "Save Display Setting"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Price Preview */}
      <Card className="bg-[#0d1120] border-gold/10">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron text-gold uppercase tracking-tighter">Live Price Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1f35] text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Package</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">SC Cost</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Calculated Price (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PACKAGE_DEFINITIONS.map((pkg: any) => (
                  <tr key={pkg.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-gray-300">{pkg.label}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{pkg.smilecoins} SC</td>
                    <td className="px-6 py-4 font-orbitron font-bold text-right text-white text-lg">
                      ₹{Math.ceil(pkg.smilecoins * scRate * (1 + smilecoinConfig.markupPercent / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
