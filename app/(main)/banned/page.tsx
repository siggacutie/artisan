'use client'

import { MessageCircle } from 'lucide-react'

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white flex items-center justify-center p-6 font-inter">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black font-orbitron uppercase tracking-tighter">
            Account Suspended
          </h1>
          <p className="text-[#64748b] text-sm md:text-base font-medium">
            Your account has been suspended. Please contact support via WhatsApp to resolve this issue.
          </p>
        </div>

        <a 
          href="https://wa.me/919387606432" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25d366] text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg"
        >
          <MessageCircle size={20} />
          Contact on WhatsApp
        </a>
      </div>
    </div>
  )
}
