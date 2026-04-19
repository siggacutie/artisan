"use client";

import React from "react";
import { motion } from "framer-motion";

const businessDetails = {
  name: "ArtisanStore.xyz",
  phone: "+91 9387606432",
  email: "support@artisanstore.xyz",
  lastUpdated: "April 2025"
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[#050810] py-24 px-6 md:px-12 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto space-y-12"
      >
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tighter">
            Delivery Policy
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: {businessDetails.lastUpdated}
          </p>
        </div>

        <div className="space-y-8 text-gray-300 font-medium leading-relaxed font-sans">
          <p>
            All products are delivered digitally to your in-game account. No physical goods are shipped.
          </p>
          
          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              Delivery Method
            </h2>
            <p>
              Diamonds are credited directly to your Mobile Legends Bang Bang (MLBB) account using the Player ID and Zone ID provided during the order process.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              Timeframe
            </h2>
            <p>
              In most cases, delivery is completed within 5 minutes of payment confirmation. In rare circumstances involving technical issues or supplier delays, it may take up to 24 hours.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              Requirements
            </h2>
            <p>
              A valid MLBB Player ID and Zone ID are required. We are not responsible for delivery failures or incorrect credits due to wrong IDs provided by the customer.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
              Delivery Failure
            </h2>
            <p>
              If you do not receive your diamonds within 24 hours, please contact our support team with your order ID.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Contact Email: {businessDetails.email}
            </p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Contact Phone: {businessDetails.phone}
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;700&display=swap');
        .font-heading { font-family: 'Orbitron', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
