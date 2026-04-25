"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const businessDetails = {
  name: "ArtisanStore.xyz",
  address: "Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India",
  phone: "+91 9387606432",
  email: "support@artisanstore.xyz",
  lastUpdated: "April 2025"
};

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | ArtisanStore.xyz";
  }, []);

  const sections = [
    {
      title: "1. Introduction",
      content: `${businessDetails.name} respects your privacy. This policy explains what data we collect and how.`
    },
    {
      title: "2. Data We Collect",
      content: "- Name and email address (on registration)\n- MLBB Player ID and Zone ID (for top-up orders)\n- IP address and device information\n- Payment transaction reference (not card details)\n- Order history"
    },
    {
      title: "3. How We Use Your Data",
      content: "- To process and deliver orders\n- To send order confirmation emails\n- To prevent fraud and abuse\n- To improve our services"
    },
    {
      title: "4. Data Sharing",
      content: "We share minimal data with:\n- Secure Payment Gateway (payment processing)\n- Smile.one (diamond delivery supplier)\nWe do not sell your data to any third party."
    },
    {
      title: "5. Data Storage",
      content: "Data is stored securely on Supabase servers. Passwords are hashed and never stored in plain text. We retain order data for up to 2 years for compliance."
    },
    {
      title: "6. Your Rights",
      content: "You may request deletion of your account and data by emailing support@artisanstore.xyz. We will process requests within 30 days."
    },
    {
      title: "7. Cookies",
      content: "We use essential cookies for authentication only. No advertising or tracking cookies are used."
    },
    {
      title: "8. Contact",
      content: `For privacy queries contact:\nsupport@artisanstore.xyz\n${businessDetails.phone}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#050810] py-24 px-6 md:px-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white uppercase tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: {businessDetails.lastUpdated}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-black font-heading text-gold uppercase tracking-tight">
                {section.title}
              </h2>
              <div className="text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
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
