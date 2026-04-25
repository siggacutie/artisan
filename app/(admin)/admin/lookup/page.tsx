"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Package, 
  User, 
  CreditCard, 
  Loader2, 
  Copy, 
  ExternalLink,
  Ban,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LookupPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearchingOrder, setIsSearchingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const [userQuery, setUserQuery] = useState("");
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userResult, setUserResult] = useState<any>(null);

  const [txId, setTxId] = useState("");
  const [isSearchingTx, setIsSearchingTx] = useState(false);
  const [txResult, setTxResult] = useState<any>(null);

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearchingOrder(true);
    setOrderResult(null);
    setTimeout(() => {
      setIsSearchingOrder(false);
      setOrderResult({
        id: orderId.toUpperCase(),
        status: "Completed",
        player: "Alex MLBB",
        playerId: "12345678",
        zoneId: "1234",
        username: "AlexTheKing",
        game: "Mobile Legends",
        package: "514 Diamonds",
        amount: "500 INR",
        method: "Artisan Wallet",
        paymentStatus: "Paid",
        supplierId: "SML-987654",
        timestamp: "Apr 05, 2026 • 14:22",
        completedAt: "Apr 05, 2026 • 14:24"
      });
    }, 500);
  };

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery) return;
    setIsSearchingUser(true);
    setUserResult(null);
    setTimeout(() => {
      setIsSearchingUser(false);
      setUserResult({
        name: "Alex Johnson",
        email: userQuery.includes("@") ? userQuery : "alex@example.com",
        joined: "Jan 12, 2026",
        role: "User",
        status: "Active",
        wallet: "1,250 INR",
        totalSpent: "8,400 INR",
        totalOrders: 14,
        lastActive: "2 hours ago",
        recentOrders: [
          { id: "ART001", type: "Top Up", amount: "500 INR", status: "Completed", date: "Apr 05" },
          { id: "ART012", type: "Top Up", amount: "100 INR", status: "Completed", date: "Apr 01" },
          { id: "ART025", type: "Account", amount: "2500 INR", status: "Completed", date: "Mar 22" },
        ]
      });
    }, 500);
  };

  const handleTxSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId) return;
    setIsSearchingTx(true);
    setTxResult(null);
    setTimeout(() => {
      setIsSearchingTx(false);
      setTxResult({
        id: txId.toUpperCase(),
        type: "CREDIT",
        amount: "1000 INR",
        method: "UPI (Secure Gateway)",
        refId: "pay_RX98234723",
        status: "Success",
        description: "Wallet Top Up",
        user: "Alex Johnson",
        email: "alex@example.com",
        timestamp: "Apr 04, 2026 • 09:15"
      });
    }, 500);
  };

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
          Search and Lookup
        </h1>
        <p className="text-gray-400 font-medium text-sm mt-1">
          Find any order, user, or transaction instantly.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 max-w-4xl">
        
        {/* Section 1: Order Lookup */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <Package size={18} />
            </div>
            <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
              Order Lookup
            </h2>
          </div>

          <form onSubmit={handleOrderSearch} className="flex gap-3">
            <div className="relative flex-grow">
              <Input 
                placeholder="Enter Order ID (e.g. ART001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-12 bg-[#0d1120] border-gold/5 focus:border-gold/30 rounded-xl pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              {isSearchingOrder && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" size={18} />}
            </div>
            <Button 
              type="submit"
              disabled={isSearchingOrder}
              className="h-12 bg-gold text-black font-black uppercase tracking-widest px-8 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.15)]"
            >
              Search
            </Button>
          </form>

          <AnimatePresence>
            {orderResult && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#0d1120] border border-gold/10 rounded-2xl overflow-hidden p-6 space-y-8"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-black font-heading text-gold tracking-tight">{orderResult.id}</span>
                    <span className="bg-green-400/10 text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-400/20">
                      {orderResult.status}
                    </span>
                  </div>
                  <button className="text-gray-500 hover:text-gold transition-colors flex items-center space-x-2 text-xs font-bold uppercase tracking-widest">
                    <Copy size={14} />
                    <span>Copy ID</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: "Player Name", value: orderResult.player },
                    { label: "Player ID", value: orderResult.playerId },
                    { label: "Zone ID", value: orderResult.zoneId },
                    { label: "Verified Username", value: orderResult.username, color: "text-green-400" },
                    { label: "Game", value: orderResult.game },
                    { label: "Package", value: orderResult.package },
                    { label: "Amount Paid", value: orderResult.amount, color: "text-gold" },
                    { label: "Method", value: orderResult.method },
                    { label: "Payment Status", value: orderResult.paymentStatus, color: "text-green-400" },
                    { label: "Supplier ID", value: orderResult.supplierId },
                    { label: "Placed At", value: orderResult.timestamp },
                    { label: "Completed At", value: orderResult.completedAt },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{field.label}</p>
                      <p className={cn("text-sm font-bold", field.color || "text-white")}>{field.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                  <Button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest px-6 rounded-xl">
                    Issue Refund
                  </Button>
                  <Button variant="outline" className="bg-transparent border-gold/20 text-gold hover:bg-gold/5 text-xs font-black uppercase tracking-widest px-6 rounded-xl">
                    View User
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Section 2: User Lookup */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <User size={18} />
            </div>
            <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
              User Lookup
            </h2>
          </div>

          <form onSubmit={handleUserSearch} className="flex gap-3">
            <div className="relative flex-grow">
              <Input 
                placeholder="Enter User ID or Email address"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="h-12 bg-[#0d1120] border-gold/5 focus:border-gold/30 rounded-xl pl-12"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              {isSearchingUser && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" size={18} />}
            </div>
            <Button 
              type="submit"
              disabled={isSearchingUser}
              className="h-12 bg-gold text-black font-black uppercase tracking-widest px-8 rounded-xl"
            >
              Search
            </Button>
          </form>

          <AnimatePresence>
            {userResult && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-[#0d1120] border border-gold/10 rounded-2xl overflow-hidden"
              >
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold text-3xl font-black font-heading uppercase">
                      AJ
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black font-heading text-white tracking-tight uppercase">{userResult.name}</h3>
                      <p className="text-sm text-gray-400 font-medium">{userResult.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-gold/10 text-gold text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-gold/20">
                        {userResult.role}
                      </span>
                      <span className="bg-green-400/10 text-green-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-green-400/20">
                        {userResult.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Wallet Balance", value: userResult.wallet, color: "text-gold" },
                        { label: "Total Spent", value: userResult.totalSpent },
                        { label: "Total Orders", value: userResult.totalOrders },
                        { label: "Joined", value: userResult.joined },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className={cn("text-base font-black font-heading tracking-tight", stat.color || "text-white")}>{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Recent Orders</h4>
                      <div className="space-y-2">
                        {userResult.recentOrders.map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                            <div className="flex items-center space-x-4">
                              <span className="text-xs font-bold text-white group-hover:text-gold transition-colors">{order.id}</span>
                              <span className="text-xs text-gray-400">{order.type}</span>
                              <span className="text-xs font-bold text-white">{order.amount}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                order.status === "Completed" ? "text-green-400" : "text-gray-500"
                              )}>{order.status}</span>
                              <span className="text-[10px] text-gray-500 font-bold">{order.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 text-xs font-black uppercase tracking-widest px-6 rounded-xl flex items-center space-x-2">
                        <Wallet size={14} />
                        <span>Credit Wallet</span>
                      </Button>
                      <Button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest px-6 rounded-xl flex items-center space-x-2">
                        <Ban size={14} />
                        <span>Ban User</span>
                      </Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl">
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Section 3: Transaction Lookup */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <CreditCard size={18} />
            </div>
            <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
              Transaction Lookup
            </h2>
          </div>

          <form onSubmit={handleTxSearch} className="flex gap-3">
            <div className="relative flex-grow">
              <Input 
                placeholder="Enter Transaction ID or Reference ID"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="h-12 bg-[#0d1120] border-gold/5 focus:border-gold/30 rounded-xl pl-12"
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              {isSearchingTx && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" size={18} />}
            </div>
            <Button 
              type="submit"
              disabled={isSearchingTx}
              className="h-12 bg-gold text-black font-black uppercase tracking-widest px-8 rounded-xl"
            >
              Search
            </Button>
          </form>

          <AnimatePresence>
            {txResult && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-[#0d1120] border border-gold/10 rounded-2xl p-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="space-y-6 flex-grow">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-mono font-bold text-gold">{txResult.id}</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        txResult.type === "CREDIT" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"
                      )}>
                        {txResult.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      {[
                        { label: "Amount", value: txResult.amount, color: "text-white text-xl font-black font-heading" },
                        { label: "Method", value: txResult.method },
                        { label: "Reference ID", value: txResult.refId, color: "text-blue-400" },
                        { label: "Status", value: txResult.status, color: "text-green-400" },
                        { label: "Description", value: txResult.description },
                        { label: "User", value: txResult.user },
                        { label: "Email", value: txResult.email },
                        { label: "Timestamp", value: txResult.timestamp },
                      ].map((field) => (
                        <div key={field.label} className="space-y-1">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{field.label}</p>
                          <p className={cn("text-sm font-bold", field.color || "text-gray-300")}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button variant="outline" className="bg-gold/5 border-gold/20 text-gold hover:bg-gold/10 text-xs font-black uppercase tracking-widest px-8 rounded-xl flex items-center space-x-2">
                      <span>View Full Profile</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
