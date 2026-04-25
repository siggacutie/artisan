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

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms of Service | ArtisanStore.xyz";
  }, []);

  const sections = [
    {
      title: "1. About Us",
      content: `${businessDetails.name} is an online platform for purchasing Mobile Legends Bang Bang diamond top-ups. We act as a reseller for in-game currency.\n\nBusiness Address: ${businessDetails.address}\nPhone: ${businessDetails.phone}\nEmail: ${businessDetails.email}`
    },
    {
      title: "2. Eligibility",
      content: "Must be 18+ or have parental consent. Must have a valid MLBB account. By using the site you agree to these terms."
    },
    {
      title: "3. Services",
      content: "We offer MLBB diamond top-up services only. Top-ups are delivered to your in-game account. We are not affiliated with Moonton. We only facilitate top-ups through authorized suppliers and do not modify or access user accounts."
    },
    {
      title: "4. Payments",
      content: "All payments are processed securely via our payment gateway. We accept UPI, credit/debit cards, and net banking. Prices are in INR. Currency conversion shown for international users is indicative only. Wallet balance can be loaded and used for purchases. All payments are processed through encrypted channels."
    },
    {
      title: "5. Delivery Policy",
      content: "Diamond top-ups are delivered digitally to your MLBB account within 5 minutes of payment confirmation. In rare cases delivery may take up to 24 hours. Delivery requires a valid Player ID and Zone ID. We are not responsible for incorrect IDs provided."
    },
    {
      title: "6. Refund and Cancellation Policy",
      content: "Due to the digital and instant nature of top-up delivery, all completed transactions are generally non-refundable. However we review all disputes on a case-by-case basis. Refunds may be issued at our discretion for failed delivery where diamonds were not received, duplicate charges, or technical errors on our platform. To raise a dispute contact support@artisanstore.xyz within 24 hours of purchase with your order ID. Cancellations are not possible once an order is submitted and processing has begun. Approved refunds will be processed within 5-7 business days."
    },
    {
      title: "7. Prohibited Activities",
      content: "Users are requested to contact us before initiating a chargeback so we can resolve the issue. Users must not provide false player IDs. Users must not use the platform for fraudulent activity. Violation results in account suspension."
    },
    {
      title: "8. Privacy",
      content: "We collect email, IP address, and order information. We do not sell personal data. Payment data is handled by our secure payment provider and never stored on our servers. See Privacy Policy for full details."
    },
    {
      title: "9. Liability Limitation",
      content: "We are not liable for losses arising from incorrect player IDs, game account bans by Moonton, or third-party service outages. Maximum liability is limited to the order amount."
    },
    {
      title: "10. Governing Law",
      content: `These terms are governed by Indian law. Disputes are subject to jurisdiction of courts in Guwahati, Assam, India.`
    },
    {
      title: "11. Contact",
      content: `${businessDetails.name}\n${businessDetails.address}\nPhone: ${businessDetails.phone}\nEmail: ${businessDetails.email}\nSupport queries are typically responded to within 24 hours.`
    },
    {
      title: "Disclaimer",
      content: "We are an independent reseller and not affiliated with game publishers."
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
            Terms of Service
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
