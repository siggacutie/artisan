"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Search, 
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DUMMY_PENDING = [
  { id: "PAY001", user: "Alex Johnson", email: "alex@example.com", amount: "500 INR", method: "Manual UPI", utr: "123456789012", date: "Apr 05, 14:30" },
  { id: "PAY002", user: "Sarah Gamer", email: "sarah.g@gmail.com", amount: "1000 INR", method: "Manual UPI", utr: "987654321098", date: "Apr 05, 14:15" },
  { id: "PAY003", user: "Rahul Singh", email: "rahul99@outlook.com", amount: "250 INR", method: "Manual UPI", utr: "554433221100", date: "Apr 05, 13:50" },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
            Payment Approval Queue
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Review and approve manual UPI submissions from customers.</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center space-x-2 h-12">
          <AlertCircle size={16} className="text-orange-500" />
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">3 Action Required</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-8">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-gold" : "text-gray-500 hover:text-white"
            )}
          >
            {tab === "Pending" ? `Pending (3)` : tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Pending" ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {DUMMY_PENDING.map((pay) => (
              <div key={pay.id} className="bg-[#0d1120] border border-orange-500/10 rounded-2xl p-6 space-y-6 hover:border-orange-500/30 transition-all group relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{pay.user}</h3>
                    <p className="text-[10px] font-medium text-gray-500">{pay.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black font-heading text-white tracking-tighter">{pay.amount}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{pay.method}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">UTR / Reference</span>
                    <button className="text-[9px] font-black text-gold uppercase tracking-widest flex items-center space-x-1 hover:underline">
                      <Copy size={10} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm font-mono font-bold text-gold tracking-widest">{pay.utr}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 italic">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>Submitted {pay.date}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-grow bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl shadow-lg shadow-green-500/10 flex items-center space-x-2">
                    <CheckCircle2 size={14} />
                    <span>Approve</span>
                  </Button>
                  <Button 
                    onClick={() => setIsRejectModalOpen(true)}
                    variant="outline" 
                    className="bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl flex items-center space-x-2"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0d1120] border border-gold/5 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    {[
                      { label: "User", align: "left" },
                      { label: "Amount", align: "right" },
                      { label: "UTR", align: "left" },
                      { label: activeTab === "Approved" ? "Approved At" : "Rejected At", align: "left" },
                      { label: "Actions", align: "right" },
                    ].map((head) => (
                      <th key={head.label} className={cn(
                        "px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest",
                        head.align === "right" && "text-right"
                      )}>{head.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 text-left">
                          <p className="text-xs font-bold text-gray-200">User {i}</p>
                          <p className="text-[9px] text-gray-500">user{i}@example.com</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-white text-right">{i * 100} INR</td>
                      <td className="px-6 py-4 text-xs font-mono text-gold tracking-widest text-left">UTR98234723{i}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 italic text-left">Apr 04, 12:00</td>
                      <td className="px-6 py-4 text-right">
                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all ml-auto">
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRejectModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#0d1120] border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-red-500/[0.02]">
                <h2 className="text-xl font-black font-heading text-red-500 uppercase tracking-tighter">Reject Payment</h2>
                <button onClick={() => setIsRejectModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start space-x-3">
                  <AlertCircle className="text-red-500 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-red-500/70 italic leading-relaxed">
                    Rejecting this payment will notify the user. Please provide a clear reason (e.g., UTR not found, invalid amount).
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reason for Rejection</label>
                  <textarea placeholder="e.g. UTR provided does not match any transaction in our records." className="w-full h-32 bg-white/5 border border-white/10 focus:border-red-500/30 rounded-xl p-4 text-sm text-white outline-none resize-none" />
                </div>
                <div className="flex gap-4">
                  <Button className="flex-grow h-12 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl">Confirm Reject</Button>
                  <Button onClick={() => setIsRejectModalOpen(false)} variant="outline" className="h-12 bg-white/5 border-white/10 text-gray-400 px-6 rounded-xl font-black uppercase tracking-widest">Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
