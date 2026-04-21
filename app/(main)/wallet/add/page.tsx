"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AddFundsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const presets = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000];

  const handlePayment = async () => {
    if (!selectedAmount) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: selectedAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "ArtisanStore.xyz",
        description: "Wallet Top-Up",
        order_id: data.orderId,
        handler: async (response: any) => {
          setVerifying(true);
          try {
            const verifyRes = await fetch("/api/wallet/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Verification failed");
            }

            setSuccess(true);
            toast.success(`₹${selectedAmount} added to your wallet!`);
            setTimeout(() => {
              router.push("/dashboard/wallet");
            }, 2000);
          } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
          } finally {
            setVerifying(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#ffd700" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-[#22c55e]/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
        </div>
        <h1 className="text-3xl font-orbitron text-white mb-2">Payment Successful</h1>
        <p className="text-gray-400">₹{selectedAmount} added to your wallet! Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white font-inter pb-32">
      <Navbar />
      
      <main className="pt-28 md:pt-36 px-4">
        <div className="max-w-[480px] mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link 
              href="/dashboard/wallet" 
              className="flex items-center text-[#ffd700] text-xs font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wallet
            </Link>
            
            <h1 className="text-4xl font-bold font-orbitron text-white uppercase tracking-tight">Add Funds</h1>
            <p className="text-gray-400 text-sm">Top up your wallet instantly to enjoy exclusive discounts.</p>
          </div>

          {/* Amount Grid */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">Select Amount</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  disabled={loading || verifying}
                  className={`h-24 rounded-lg border font-black transition-all w-full cursor-pointer p-4 flex flex-col items-center justify-center gap-1 ${
                    selectedAmount === amount 
                      ? "bg-[#ffd700]/[0.08] border-[#ffd700] text-[#ffd700]" 
                      : "bg-[#0d1120] border-[#ffd700]/10 text-white hover:border-[#ffd700]/40"
                  }`}
                >
                  <span className="font-orbitron text-xl text-[#ffd700]">₹{amount}</span>
                  <span className="text-[#64748b] font-inter text-xs font-medium">
                    = {Math.floor(amount / 1.5)} coins
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 p-4 rounded-lg flex items-center gap-3 text-[#ef4444] text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Action */}
          <div className="pt-4 space-y-6">
            <Button 
              onClick={handlePayment}
              disabled={!selectedAmount || loading || verifying}
              className={`w-full h-16 rounded-xl font-black text-lg uppercase tracking-tight transition-all ${
                selectedAmount && !loading && !verifying
                  ? "bg-[#ffd700] text-black hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-[#0d1120] text-gray-600 border border-white/5 cursor-not-allowed"
              }`}
            >
              {verifying ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Payment...
                </div>
              ) : loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Order...
                </div>
              ) : (
                `Add ₹${selectedAmount || 0} to Wallet`
              )}
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
