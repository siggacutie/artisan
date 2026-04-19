"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Gamepad,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
  Settings,
  Users,
  Package,
  Globe,
  Key,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DUMMY_GAMES = [
  { id: 1, name: "Mobile Legends Bang Bang", slug: "mobile-legends", orders: 1284, users: 842, active: true, supplier: "Smile.one" },
  { id: 2, name: "Free Fire Max", slug: "free-fire", orders: 0, users: 0, active: false, supplier: "Smile.one" },
  { id: 3, name: "PUBG Mobile", slug: "pubg-mobile", orders: 0, users: 0, active: false, supplier: "Unipin" },
];

export default function GamesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);

  const openEdit = (game: any) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
          Game Manager
        </h1>
        <Button 
          onClick={() => { setEditingGame(null); setIsModalOpen(true); }}
          className="bg-gold text-black font-black uppercase tracking-widest px-6 rounded-xl h-12 flex items-center space-x-2 shadow-lg shadow-gold/20"
        >
          <Plus size={18} />
          <span>Add Game</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DUMMY_GAMES.map((game) => (
          <div key={game.id} className={cn(
            "bg-[#0d1120] border rounded-3xl p-6 space-y-6 transition-all group relative overflow-hidden",
            game.active ? "border-gold/10 hover:border-gold/30" : "border-white/5 opacity-60"
          )}>
            <div className="flex justify-between items-start relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-gold transition-colors">
                <Gamepad size={32} />
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                game.active ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-gray-400/10 text-gray-400 border-gray-400/20"
              )}>
                {game.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="text-lg font-black font-heading text-white uppercase tracking-tight group-hover:text-gold transition-colors">{game.name}</h3>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">slug: {game.slug}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="flex items-center space-x-2 text-gray-500 mb-1">
                  <Package size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Orders</span>
                </div>
                <p className="text-sm font-black font-heading text-white">{game.orders}</p>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="flex items-center space-x-2 text-gray-500 mb-1">
                  <Users size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Users</span>
                </div>
                <p className="text-sm font-black font-heading text-white">{game.users}</p>
              </div>
            </div>

            <div className="flex gap-2 relative z-10">
              <Button onClick={() => openEdit(game)} className="flex-grow bg-white/5 hover:bg-gold/10 text-gray-400 hover:text-gold border border-white/10 hover:border-gold/20 text-[10px] font-black uppercase tracking-widest h-10 rounded-xl transition-all">
                <Pencil size={14} className="mr-2" /> Edit
              </Button>
              <Button variant="ghost" className="px-3 h-10 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white">
                <Settings size={16} />
              </Button>
            </div>

            {/* Background Glow */}
            <div className={cn(
              "absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-3xl transition-opacity",
              game.active ? "bg-gold/10 opacity-100" : "bg-gray-500/5 opacity-0"
            )} />
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-[#0d1120] border border-gold/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">{editingGame ? "Edit Game Settings" : "Add New Game"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-gold">
                        <Gamepad size={16} />
                        <h3 className="text-xs font-black uppercase tracking-widest">General Information</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Game Name</label>
                          <Input placeholder="e.g. Mobile Legends Bang Bang" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingGame?.name} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Slug (URL)</label>
                          <Input placeholder="mobile-legends" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl font-mono" defaultValue={editingGame?.slug} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                          <textarea placeholder="Game description for the landing page..." className="w-full h-32 bg-white/5 border border-white/10 focus:border-gold/30 rounded-xl p-4 text-sm text-white outline-none resize-none" />
                        </div>
                      </div>
                    </div>

                    {/* Supplier Config */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-gold">
                        <Database size={16} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Supplier Configuration</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Supplier Name</label>
                          <Input placeholder="e.g. Smile.one" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl" defaultValue={editingGame?.supplier} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Base API URL</label>
                          <div className="relative">
                            <Input placeholder="https://api.supplier.com/..." className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl pl-10 font-mono text-xs" />
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">API Key / Secret</label>
                          <div className="relative">
                            <Input type="password" placeholder="••••••••••••••••" className="h-12 bg-white/5 border-white/10 focus:border-gold/30 rounded-xl pl-10 font-mono" />
                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields JSON */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gold">
                        <Settings size={16} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Input Fields Config (JSON)</h3>
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">Used for player verification</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                      <textarea 
                        className="w-full h-40 bg-black/20 border border-white/5 rounded-xl p-4 text-xs font-mono text-gold outline-none focus:border-gold/20"
                        defaultValue={JSON.stringify([
                          { "name": "Player ID", "key": "userId", "type": "number", "placeholder": "Enter Player ID" },
                          { "name": "Zone ID", "key": "zoneId", "type": "number", "placeholder": "Enter Zone ID" }
                        ], null, 2)}
                      />
                      <p className="text-[10px] text-gray-500 italic">
                        Define what player information to collect. This controls the fields shown on the top-up page.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 pb-4">
                    <Button className="flex-grow h-14 bg-gradient-to-r from-gold to-[#f59e0b] text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gold/20">
                      Save Game Settings
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)} variant="outline" className="h-14 bg-white/5 border-white/10 text-gray-400 hover:text-white px-8 rounded-xl font-black uppercase tracking-widest">
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
