"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  User,
  Shield,
  Search,
  ChevronDown,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DUMMY_ACCOUNTS = [
  { id: "ACC001", game: "MLBB", rank: "Mythical Glory", server: "Asia", heroes: 112, skins: 245, price: 8500, status: "Available", added: "Apr 01, 2026" },
  { id: "ACC002", game: "MLBB", rank: "Mythic III", server: "Europe", heroes: 98, skins: 156, price: 4200, status: "Sold", added: "Mar 28, 2026" },
  { id: "ACC003", game: "MLBB", rank: "Legend I", server: "Asia", heroes: 85, skins: 92, price: 2800, status: "Available", added: "Mar 25, 2026" },
  { id: "ACC004", game: "MLBB", rank: "Epic II", server: "NA", heroes: 72, skins: 45, price: 1500, status: "Available", added: "Mar 20, 2026" },
  { id: "ACC005", game: "MLBB", rank: "Mythic V", server: "Asia", heroes: 105, skins: 188, price: 5500, status: "Available", added: "Mar 15, 2026" },
];

export default function AccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
          Account Inventory
        </h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gold text-black font-black uppercase tracking-widest px-6 rounded-xl h-12 flex items-center space-x-2 shadow-lg shadow-gold/20"
        >
          <Plus size={18} />
          <span>Add Account</span>
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="bg-[#0d1120] border-2 border-[#ffd700] rounded-2xl p-6 flex items-center space-x-4 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
        <div className="w-12 h-12 rounded-full bg-[#ffd700]/10 flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-6 h-6 text-[#ffd700]" />
        </div>
        <div className="flex-grow">
          <h3 className="text-[#ffd700] font-bold font-orbitron text-lg uppercase tracking-wider leading-none">Account selling is currently disabled</h3>
          <p className="text-gray-400 text-sm mt-2 font-medium">Management of account listings is restricted until further notice. Compliance requirements require all account reselling activities to be paused.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Listed", value: "124", icon: User, color: "text-blue-400" },
          { label: "Available", value: "86", icon: Shield, color: "text-green-400" },
          { label: "Sold", value: "38", icon: X, color: "text-gray-400" },
          { label: "Revenue", value: "1,42,000", unit: "INR", icon: Shield, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d1120] border border-gold/5 rounded-2xl p-5">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline space-x-1">
              <span className={cn("text-xl font-black font-heading tracking-tight", stat.color)}>{stat.value}</span>
              {stat.unit && <span className="text-[10px] text-gray-500 font-bold">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0d1120] border border-gold/5 p-4 rounded-2xl flex flex-wrap gap-4">
        <div className="relative flex-grow min-w-[200px]">
          <Input placeholder="Search ID..." className="h-11 bg-white/[0.02] border-white/5 focus:border-gold/30 rounded-xl pl-10" />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        </div>
        {["Game", "Rank", "Server", "Status"].map((f) => (
          <button key={f} className="h-11 px-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center space-x-3 text-xs font-bold text-gray-400 hover:border-gold/20 transition-all min-w-[120px]">
            <span className="flex-grow text-left">{f}</span>
            <ChevronDown size={14} />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0d1120] border border-gold/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["ID", "Rank", "Server", "Heroes", "Skins", "Price", "Status", "Added", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DUMMY_ACCOUNTS.map((acc) => (
                <tr key={acc.id} className="hover:bg-gold/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-white group-hover:text-gold transition-colors">{acc.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-200">{acc.rank}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{acc.server}</td>
                  <td className="px-6 py-4 text-xs font-bold text-blue-400">{acc.heroes}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gold">{acc.skins}</td>
                  <td className="px-6 py-4 text-sm font-black text-white">₹{acc.price}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      acc.status === "Available" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-gray-400/10 text-gray-400 border-gray-400/20"
                    )}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">{acc.added}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/10 transition-all">
                        <Pencil size={14} />
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

      {/* Add Modal */}
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
              className="relative w-full max-w-3xl bg-[#0d1120] border border-gold/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">Add New Account Listing</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game</label>
                      <div className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center text-sm font-bold text-gray-300">MLBB</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Rank</label>
                      <Input placeholder="e.g. Mythical Glory" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Server</label>
                      <button className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-sm font-bold text-gray-400">
                        <span>Asia</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (INR)</label>
                      <Input type="number" placeholder="8500" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hero Count</label>
                      <Input type="number" placeholder="112" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Skin Count</label>
                      <Input type="number" placeholder="245" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Screenshots</label>
                    <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-gold/20 transition-all group cursor-pointer bg-white/[0.01]">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-gold transition-colors">
                        <Camera size={32} />
                      </div>
                      <p className="text-sm font-bold text-gray-500">Drop screenshots here or click to upload</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-gold">
                      <Shield size={16} />
                      <h3 className="text-xs font-black uppercase tracking-widest">Account Credentials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Login Email</label>
                        <Input placeholder="alex@moonton.com" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Login Password</label>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl pr-12" />
                          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-400/70 bg-orange-400/5 p-3 rounded-lg border border-orange-400/10">
                      <AlertCircle size={14} />
                      <p className="text-[10px] font-bold italic tracking-tight">Credentials will be AES-256 encrypted at rest and delivered only after payment.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 pb-4">
                    <Button className="flex-grow h-14 bg-gradient-to-r from-gold to-[#f59e0b] text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gold/20">
                      Save Account Listing
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(false)} variant="outline" className="h-14 bg-white/5 border-white/10 text-gray-400 hover:text-white px-8 rounded-xl font-black uppercase tracking-widest">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
