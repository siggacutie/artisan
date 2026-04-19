'use client'

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Pencil, 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronDown, 
  X,
  Gem,
  Info,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages')
      const data = await res.json()
      setPackages(data)
    } catch (err) {
      toast.error('Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingPackage?.id,
      gameId: "clvg6688x0000ux786688ux78", // Default MLBB ID (should be dynamic in real app)
      diamondAmount: formData.get('diamondAmount'),
      basePriceInr: formData.get('basePriceInr'),
      displayPrice: formData.get('displayPrice'),
      bonusDiamonds: formData.get('bonusDiamonds'),
      bonusLabel: formData.get('bonusLabel'),
      section: formData.get('section'),
      supplierProductId: formData.get('supplierProductId'),
      sortOrder: formData.get('sortOrder'),
      isVisible: true,
    };

    try {
      const res = await fetch('/api/admin/packages', {
        method: editingPackage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success(editingPackage ? 'Package updated' : 'Package created');
        setIsAddModalOpen(false);
        fetchPackages();
      } else {
        toast.error('Failed to save package');
      }
    } catch (err) {
      toast.error('Error saving package');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
            Package Manager
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Configure diamond packages and pricing for all games.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gold/10 px-4 py-2 rounded-xl border border-gold/20 flex items-center space-x-3 h-12">
            <span className="text-[10px] font-black text-gold uppercase tracking-widest">Selected Game: MLBB</span>
            <ChevronDown size={14} className="text-gold" />
          </div>
          <Button 
            onClick={() => { setEditingPackage(null); setIsAddModalOpen(true); }}
            className="bg-gold text-black font-black uppercase tracking-widest px-8 rounded-xl h-12 flex items-center space-x-2 shadow-lg shadow-gold/20"
          >
            <Plus size={18} />
            <span>Add Package</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d1120] border border-gold/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {[
                  { label: "Diamonds", align: "left" },
                  { label: "Base Price", align: "right" },
                  { label: "Display Price", align: "right" },
                  { label: "Bonus", align: "right" },
                  { label: "Label", align: "left" },
                  { label: "Supplier ID", align: "left" },
                  { label: "Visible", align: "left" },
                  { label: "Sort", align: "right" },
                  { label: "Actions", align: "right" },
                ].map((head) => (
                  <th key={head.label} className={cn(
                    "px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest",
                    head.align === "right" && "text-right"
                  )}>
                    {head.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-gold mx-auto" size={32} />
                  </td>
                </tr>
              ) : packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gold/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                        <Gem size={14} />
                      </div>
                      <span className="text-sm font-black text-white">{pkg.diamondAmount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 text-right">₹{pkg.basePriceInr}</td>
                  <td className="px-6 py-4 text-sm font-black text-gold text-right">₹{pkg.displayPrice}</td>
                  <td className="px-6 py-4 text-xs font-bold text-green-400 text-right">+{pkg.bonusDiamonds}</td>
                  <td className="px-6 py-4 text-left">
                    <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/20">
                      {pkg.label || (pkg.diamondAmount + " Diamonds")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500 text-left">{pkg.supplierProductId}</td>
                  <td className="px-6 py-4 text-left">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      pkg.isVisible ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-600"
                    )} />
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 text-right">{pkg.sortOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEdit(pkg)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/10 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0d1120] border border-gold/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
                  {editingPackage ? "Edit Package" : "Add New Package"}
                </h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="p-8 space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game</label>
                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center text-sm font-bold text-gray-300">
                      Mobile Legends
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Diamond Amount</label>
                    <Input name="diamondAmount" type="number" placeholder="e.g. 514" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.diamondAmount} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Base Price (INR)</label>
                    <Input name="basePriceInr" type="number" step="0.01" placeholder="Cost price" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.basePriceInr} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Display Price (INR)</label>
                    <Input name="displayPrice" type="number" step="0.01" placeholder="Selling price" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl border-gold/20" defaultValue={editingPackage?.displayPrice} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bonus Diamonds</label>
                    <Input name="bonusDiamonds" type="number" placeholder="e.g. 54" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.bonusDiamonds} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bonus Label</label>
                    <Input name="bonusLabel" type="text" placeholder="e.g. +54 Free" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.bonusLabel} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section</label>
                    <select 
                      name="section" 
                      className="w-full h-12 bg-white/5 border border-white/10 focus:border-gold/30 rounded-xl px-4 text-white text-sm outline-none"
                      defaultValue={editingPackage?.section || "standard"}
                    >
                      <option value="standard" className="bg-[#0d1120]">Standard</option>
                      <option value="double" className="bg-[#0d1120]">Double</option>
                      <option value="passes" className="bg-[#0d1120]">Passes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Supplier Product ID</label>
                    <Input name="supplierProductId" type="text" placeholder="API reference" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.supplierProductId} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sort Order</label>
                    <Input name="sortOrder" type="number" placeholder="1, 2, 3..." className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingPackage?.sortOrder} />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving} className="flex-grow h-14 bg-gradient-to-r from-gold to-[#f59e0b] text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gold/20">
                    {saving ? <Loader2 className="animate-spin" /> : "Save Package"}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    variant="outline" 
                    className="h-14 bg-white/5 border-white/10 text-gray-400 hover:text-white px-8 rounded-xl font-black uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
