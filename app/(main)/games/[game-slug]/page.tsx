"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Headphones, 
  Gem, 
  User, 
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function GameLandingPage({ params }: { params: Promise<{ "game-slug": string }> }) {
  const resolvedParams = React.use(params);
  const gameSlug = resolvedParams["game-slug"];
  const isMlbb = gameSlug === "mobile-legends";
  
  const gameData = {
    name: "Mobile Legends Bang Bang",
    logo: "https://www.smile.one/img/game/25.png", // MLBB Logo from Smile.one
    bg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    orders: "1,284",
    deliveryTime: "4 min",
    rating: "4.9",
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden">
          {/* Background with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={gameData.bg} 
              alt={gameData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#050810]/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:px-12 w-full grid md:grid-cols-12 gap-12 items-center">
            {/* Left side 55% */}
            <div className="md:col-span-7 space-y-8">
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                <ChevronRight size={10} />
                <Link href="/games" className="hover:text-gold transition-colors">Games</Link>
                <ChevronRight size={10} />
                <span className="text-gray-300">{gameData.name}</span>
              </nav>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gold/20 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                  <img src={gameData.logo} alt={gameData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight tracking-tighter uppercase italic">
                    {gameData.name}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-gold/20 rounded-full px-4 py-1.5">
                  <ShieldCheck size={12} className="text-gold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Razorpay Secured</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-full px-4 py-1.5">
                  <Headphones size={12} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">24/7 Support</span>
                </div>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div>
                  <div className="text-3xl font-black font-heading text-white">{gameData.orders}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Orders Delivered</div>
                </div>
                <div className="h-12 w-px bg-gold/20" />
                <div>
                  <div className="text-3xl font-black font-heading text-white">{gameData.deliveryTime}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Avg Delivery Time</div>
                </div>
                <div className="h-12 w-px bg-gold/20" />
                <div>
                  <div className="text-3xl font-black font-heading text-white">{gameData.rating}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Player Rating</div>
                </div>
              </div>
            </div>

            {/* Right side 45% (hidden on mobile) */}
            <div className="hidden md:flex md:col-span-5 flex-col gap-6">
              {/* Card 1 - TOP UP */}
              <div className="group relative p-8 rounded-[2rem] bg-[#0d1120] border border-gold/20 hover:border-gold/50 transition-all duration-500 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Gem size={80} className="text-gold" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                    <Gem size={24} />
                  </div>
                  <h3 className="text-2xl font-black font-heading text-white uppercase italic">Diamond Top Up</h3>
                  <p className="text-gray-400 text-sm font-medium">86 to 11,144 diamonds. Instant delivery to your ID.</p>
                  
                  <Link 
                    href={`/games/${gameSlug}/topup`}
                    className="flex items-center justify-center w-full h-14 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold/10"
                  >
                    Top Up Now
                  </Link>
                  <p className="text-[9px] font-black uppercase tracking-widest text-green-500 text-center">Wallet payment saves you 5% extra</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons for Mobile */}
        <div className="md:hidden flex flex-col gap-4 px-6 mb-12">
           <Link 
              href={`/games/${gameSlug}/topup`}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0d1120] border border-gold/20 rounded-2xl"
            >
              <Gem size={24} className="text-gold" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Top Up</span>
            </Link>
        </div>

        {/* Content Section */}
        <section className="bg-[#050810] py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-32">
            
            {/* How it Works */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-gold" />
                <h2 className="text-3xl font-black font-heading uppercase italic">How Top Up Works</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Enter Player ID and Zone ID", desc: "Found in your game profile. We verify it instantly." },
                  { title: "Choose a diamond package", desc: "Select from 10+ available packages starting at low prices." },
                  { title: "Delivered in under 5 minutes", desc: "Automated delivery once payment is confirmed via Razorpay." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-[#0d1120]/50 rounded-2xl border border-white/5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold font-black italic">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase">{step.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Strip */}
            <div className="relative -mx-6 md:-mx-12 overflow-hidden border-y border-gold/5 bg-[#0d1120] py-4">
              <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Gem size={10} className="text-gold" />
                    <span className="text-[11px] font-bold text-gray-300">
                      {["Noblesse", "Ahmad R", "Carlos M", "Priya K", "Zul F", "Kenji"][i-1]} 
                      <span className="text-gray-500 mx-1">
                        topped up {i * 150 + 86} diamonds
                      </span> 
                      <span className="text-[10px] text-gray-600">{i * 3} min ago</span>
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless scroll */}
                {[1,2,3,4,5,6].map((i) => (
                  <div key={`dup-${i}`} className="flex items-center gap-3">
                    <Gem size={10} className="text-gold" />
                    <span className="text-[11px] font-bold text-gray-300">
                      {["Noblesse", "Ahmad R", "Carlos M", "Priya K", "Zul F", "Kenji"][i-1]} 
                      <span className="text-gray-500 mx-1">
                        topped up {i * 150 + 86} diamonds
                      </span> 
                      <span className="text-[10px] text-gray-600">{i * 3} min ago</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages Preview */}
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1 bg-gold" />
                  <h2 className="text-3xl font-black font-heading uppercase italic">Diamond Packages</h2>
                </div>
                <Link href={`/games/${gameSlug}/topup`} className="text-[10px] font-black uppercase tracking-widest text-gold hover:underline">View All Packages</Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                {[86, 172, 257, 343, 514].map((amount, i) => (
                  <div key={i} className="flex-shrink-0 w-48 p-5 bg-[#0d1120] border border-gold/10 rounded-2xl snap-start group hover:border-gold/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-black font-heading">{amount}</span>
                        <Gem size={12} className="text-gold" />
                      </div>
                      <span className="text-xs font-black text-gold">{amount} coins</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">Save {Math.ceil(amount * 0.2 / 1.5)} coins</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </motion.main>

      <Footer />
      <MobileBottomNav />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-6 text-center">
    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
      ArtisanStore.xyz — Instant. Secure. Delivered.
    </p>
  </footer>
);
