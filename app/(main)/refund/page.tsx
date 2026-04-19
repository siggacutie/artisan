'use client'

import React, { useEffect } from 'react'
import { motion } from "framer-motion"

export default function RefundPage() {
  useEffect(() => {
    document.title = "Refund Policy | ArtisanStore.xyz";
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] py-24 px-6 md:px-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white uppercase tracking-tighter">
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: April 2025
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              1. Digital Goods Policy
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              All purchases on ArtisanStore.xyz are for digital goods (MLBB diamond top-ups) which are delivered instantly to your in-game account. Due to the instant and irreversible nature of digital delivery, all completed transactions are generally non-refundable once diamonds have been credited to your account.
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              2. Eligible Refund Cases
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              We will issue a full refund in the following cases:
              {"\n"}— Diamonds were not delivered to your account within 24 hours of payment confirmation
              {"\n"}— You were charged but no order was created in our system
              {"\n"}— Duplicate payment was made for the same order
              {"\n"}— Technical error on our platform caused an incorrect amount to be charged
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              3. Non-Eligible Cases
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              Refunds will NOT be issued for:
              {"\n"}— Incorrect Player ID or Zone ID provided by the customer
              {"\n"}— Change of mind after purchase
              {"\n"}— Account bans by Moonton after delivery
              {"\n"}— Delays caused by Moonton's servers
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              4. How to Request a Refund
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              To raise a refund request, email support@artisanstore.xyz within 24 hours of your purchase with:
              {"\n"}— Your registered email address
              {"\n"}— Order ID
              {"\n"}— Description of the issue
              {"\n"}— Screenshot of your in-game account showing diamonds not received (if applicable)
              {"\n\n"}We will respond within 24 hours and process approved refunds within 5-7 business days.
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              5. Cancellations
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              Orders cannot be cancelled once submitted as processing begins immediately. If you have made an error, contact us immediately at support@artisanstore.xyz and we will do our best to assist before delivery is completed.
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              6. Wallet Balance
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              Wallet top-ups are non-refundable once credited to your ArtisanStore wallet. Wallet balance has no cash value and cannot be withdrawn.
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              7. Chargebacks
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              We strongly request customers to contact us before initiating a chargeback with their bank. Unauthorized chargebacks may result in account suspension. We are happy to resolve all disputes directly.
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Section 8 */}
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              8. Contact
            </h2>
            <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
              Email: support@artisanstore.xyz
              {"\n"}Phone: +91 9387606432
              {"\n"}Address: Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;700&display=swap');
        .font-heading { font-family: 'Orbitron', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  )
}
