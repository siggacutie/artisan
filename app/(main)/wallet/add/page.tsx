"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Globe, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";

export default function AddFundsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const presets = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000];

  const paymentMethods = [
    { 
      id: "upi", 
      name: "UPI", 
      desc: "GPay PhonePe Paytm", 
      icon: <Smartphone className="w-5 h-5" /> 
    },
    { 
      id: "card", 
      name: "Credit or Debit Card", 
      desc: "All major cards accepted", 
      icon: <CreditCard className="w-5 h-5" /> 
    },
    { 
      id: "netbanking", 
      name: "Net Banking", 
      desc: "All major Indian banks", 
      icon: <Building2 className="w-5 h-5" /> 
    },
    { 
      id: "paypal", 
      name: "PayPal", 
      desc: "International payments", 
      icon: <Globe className="w-5 h-5" /> 
    },
  ];

  const isButtonEnabled = selectedAmount !== null && selectedMethod !== null;

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter pb-32">
      <Navbar />
      
      <main className="pt-28 md:pt-36 px-4">
        <div className="max-w-[480px] mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link 
              href="/dashboard" 
              className="flex items-center text-gold text-xs font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-4xl font-bold font-orbitron text-white uppercase tracking-tight">Add Funds</h1>
            <p className="text-gray-400 text-sm">Funds added instantly via Razorpay.</p>
          </div>

          {/* Amount Grid */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Select Amount</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`h-20 rounded-lg border font-black transition-all w-full cursor-pointer p-4 flex flex-col items-center justify-center gap-1 ${
                    selectedAmount === amount 
                      ? "bg-[#ffd7001a] border-[#ffd700] text-[#ffd700]" 
                      : "bg-[#0d1120] border-[#ffd7001a] text-[#ffd700] hover:border-[#ffd70066] hover:bg-[#ffd7000d]"
                  }`}
                >
                  <span className="font-orbitron text-base">₹{amount}</span>
                  <span className="text-[#64748b] font-inter text-[12px] font-medium tracking-normal uppercase-none">
                    = {Math.floor(amount / 1.5)} coins
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
             <div className="text-white font-black text-xl mb-1">
               {selectedAmount ? `You are adding ₹${selectedAmount} to your wallet` : "Select an amount to continue"}
             </div>
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">No extra charges.</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Select Payment Method</label>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMethod === method.id 
                    ? "bg-gold/[0.05] border-gold shadow-[inset_0_0_20px_rgba(255,215,0,0.05)]" 
                    : "bg-[#0d1120] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    selectedMethod === method.id ? "bg-gold text-black" : "bg-black/40 text-gray-500"
                  }`}>
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-white uppercase tracking-tight">
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">{method.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-all ${
                  selectedMethod === method.id ? "text-gold translate-x-1" : "text-gray-800"
                }`} />
              </button>
            ))}
          </div>

          {/* Action */}
          <div className="pt-4 space-y-6">
            <Button 
              disabled={!isButtonEnabled}
              className={`w-full h-20 rounded-[1.5rem] text-black font-black text-xl uppercase italic tracking-tighter transition-all ${
                isButtonEnabled 
                  ? "bg-gold shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-gray-800 text-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >
              {!selectedAmount ? "Select an Amount" : `Pay ₹${selectedAmount} → Get ${Math.floor(selectedAmount / 1.5)} coins`}
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <style jsx>{`
        .bg-gold { background-color: #ffd700; }
        .text-gold { color: #ffd700; }
        .border-gold { border-color: #ffd700; }
      `}</style>
    </div>
  );
}
