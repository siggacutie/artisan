"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Tag, 
  Trash2, 
  X,
  Zap,
  Calendar,
  ChevronDown,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DUMMY_COUPONS = [
  { id: 1, code: "WELCOME10", discount: 10, used: 142, max: 500, minOrder: 500, expires: "Dec 31, 2026", game: "All Games", status: "Active" },
  { id: 2, code: "MLBBPROMO", discount: 5, used: 85, max: 100, minOrder: 1000, expires: "Jun 30, 2026", game: "Mobile Legends", status: "Active" },
  { id: 3, code: "SUMMER25", discount: 25, used: 200, max: 200, minOrder: 2500, expires: "Aug 31, 2026", game: "All Games", status: "Expired" },
  { id: 4, code: "WEEKEND5", discount: 5, used: 12, max: 1000, minOrder: 100, expires: "Apr 07, 2026", game: "All Games", status: "Active" },
];

export default function CouponsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [couponPercent, setCouponPercent] = useState("");

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
          Coupon Manager
        </h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gold text-black font-black uppercase tracking-widest px-6 rounded-xl h-12 flex items-center space-x-2 shadow-lg shadow-gold/20"
        >
          <Plus size={18} />
          <span>Create Coupon</span>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Coupons", value: "24", icon: Tag, color: "text-blue-400" },
          { label: "Active", value: "18", icon: CheckCircle2, color: "text-green-400" },
          { label: "Total Redemptions", value: "1,242", icon: Zap, color: "text-gold" },
          { label: "Revenue Impact", value: "₹42,000", icon: Percent, color: "text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0d1120] border border-gold/5 p-5 rounded-2xl flex items-center space-x-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", s.color)}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
              <p className={cn("text-base font-black font-heading tracking-tight", s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0d1120] border border-gold/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["Code", "Discount", "Used / Max", "Min Order", "Expires", "Game", "Status", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DUMMY_COUPONS.map((cpn) => (
                <tr key={cpn.id} className="hover:bg-gold/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-black text-gold tracking-widest bg-gold/5 px-2 py-1 rounded border border-gold/10">{cpn.code}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-white">{cpn.discount}% OFF</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                        <span>{cpn.used} / {cpn.max}</span>
                        <span>{Math.round((cpn.used/cpn.max) * 100)}%</span>
                      </div>
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(cpn.used/cpn.max) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">₹{cpn.minOrder}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">{cpn.expires}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-300">{cpn.game}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      cpn.status === "Active" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"
                    )}>
                      {cpn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <XCircle size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-[#0d1120] border border-gold/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">Create New Coupon</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Coupon Code</label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g. SAVE20" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl uppercase font-mono font-bold tracking-widest" />
                      <Button variant="outline" className="h-12 bg-white/5 border-white/10 text-gold px-4 rounded-xl">
                        <RefreshCcw size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount Percent (%)</label>
                    <Input 
                      type="number" 
                      placeholder="20" 
                      className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" 
                      value={couponPercent}
                      onChange={(e) => setCouponPercent(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Uses</label>
                    <Input type="number" placeholder="500" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Min Order Value (INR)</label>
                    <Input type="number" placeholder="1000" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Expiry Date</label>
                    <div className="relative">
                      <Input type="date" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl pl-10" />
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Applicable Game</label>
                    <button className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-sm font-bold text-gray-400">
                      <span>All Games</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Preview Badge */}
                <div className="p-6 bg-gold/5 border border-gold/10 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gold uppercase tracking-widest">Live Preview</p>
                    <p className="text-xs text-gray-400 font-medium italic">How users will see the deal</p>
                  </div>
                  <div className="bg-gold text-black px-4 py-2 rounded-lg font-black font-heading uppercase text-sm shadow-lg shadow-gold/20 animate-pulse">
                    SAVE {couponPercent || "X"}%
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-grow h-14 bg-gradient-to-r from-gold to-[#f59e0b] text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gold/20">
                    Create Coupon
                  </Button>
                  <Button onClick={() => setIsCreateModalOpen(false)} variant="outline" className="h-14 bg-white/5 border-white/10 text-gray-400 hover:text-white px-8 rounded-xl font-black uppercase tracking-widest">
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
