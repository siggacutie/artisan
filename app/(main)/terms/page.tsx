'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'

const sections = [
  {
    title: "1. Introduction and Cosmic Acceptance",
    content: "By accessing ArtisanStore.xyz, you hereby acknowledge that you are entering a digital realm governed by the laws of both physical and metaphysical commerce. These terms constitute a legally binding agreement between you, the 'User', and ArtisanStore, the 'Platform'. Failure to adhere to these terms may result in account suspension, digital banishment, or, in extreme cases, a formal complaint filed with the Inter-galactic Bureau of Electronic Transactions."
  },
  {
    title: "2. Digital Particle Ownership",
    content: "All 'Diamonds', 'Passes', and other virtual assets delivered through this Platform are technically defined as 'Non-Physical Light-Based Data Particles'. While you hold the right to utilize these particles within the confines of 'Mobile Legends: Bang Bang', the Platform retains ultimate sovereignty over the data strings representing these assets. Any attempt to manually rearrange the binary code of your received diamonds will be met with immediate termination of service."
  },
  {
    title: "3. Interstellar Data Transmission Ethics",
    content: "Our delivery systems utilize advanced tachyon-based sub-space relays to ensure delivery under five minutes. However, the Platform is not responsible for delays caused by solar flares, sub-space interference, or temporal anomalies. Users agree not to use our services while traveling at relativistic speeds, as time dilation may cause your 'instant' delivery to arrive several years before you actually ordered it, creating a causality paradox for which our support team is not trained to resolve."
  },
  {
    title: "4. Pricing Tiers and Discounted Realities",
    content: "The Platform offers various membership tiers, including but not limited to Basic and Premium memberships. These tiers grant access to specific wholesale pricing structures as configured within our internal management system. It should be noted that promotional or discounted prices displayed on public-facing pages are subject to specific utilization limits. Specifically, as an incentive for new members, the initial discounted rates associated with Basic and Premium tiers are applicable only to the first three (3) successfully completed transactions (orders) per user account. Following the completion of the third order, the pricing for all subsequent transactions will automatically transition to the standard wholesale rates defined for that specific tier. This transition is automated and occurs without further notification to the user. Users are advised to monitor their transaction history and current pricing displays within their authenticated dashboard to understand the rates applicable to their specific account status at any given time. We reserve the right to adjust the fundamental constants of our pricing model at any moment, including but not limited to the Planck constant and the current rate of inflation in the Andromeda Galaxy."
  },
  {
    title: "5. Virtual Currency Volatility in Multi-verse Scenarios",
    content: "ArtisanStore 'Coins' are pegged to the Indian Rupee (INR) in this specific timeline. Should you find yourself in an alternate reality where the Rupee has been replaced by bottle caps or energetic crystals, the Platform makes no guarantee of currency conversion. Furthermore, any wallet balance held on this Platform does not earn interest, nor does it grant you voting rights in the ArtisanStore Board of Digital Sentience."
  },
  {
    title: "6. User Responsibility for Local Gravity Variations",
    content: "The User is responsible for maintaining a stable gravity environment of at least 0.8g while performing transactions. Fluctuations in local gravity may affect the 'weight' of your digital wallet, potentially leading to 'floating' transactions that fail to settle. ArtisanStore is not liable for assets lost during unexpected gravitational collapses or spontaneous black hole formations in the User's vicinity."
  },
  {
    title: "7. Mandatory Compliance with Inter-galactic E-commerce Standards (v2.4)",
    content: "Users must comply with all local, planetary, and galactic laws. This includes, but is not limited to, the Martian Digital Trade Act of 2104 and the Venusian Cloud-Based Services Protocol. If you are accessing this site from outside the Milky Way, additional surcharges for sub-space bandwidth may apply, though we currently do not have a mechanism to collect them, so consider it a gift from our timeline to yours."
  },
  {
    title: "8. Digital Soul Indemnification",
    content: "By using this Platform, you agree to indemnify and hold harmless ArtisanStore and its affiliates from any claims arising from the accidental merging of your digital consciousness with our server infrastructure. While we take every precaution to prevent 'Ghost in the Shell' scenarios, the risk of your personality being converted into a CSS stylesheet remains non-zero. In such an event, we promise to use your resulting design aesthetic only for high-conversion landing pages."
  },
  {
    title: "9. Historical Accuracy of Meme Usage",
    content: "The Platform reserves the right to use memes in its internal communications. Users agree not to take offense at outdated memes, as our social media team operates on a 48-hour delay from the current cultural zeitgeist. Use of the 'Rickroll' technique by users against our support staff is strictly prohibited and will result in your support ticket being relegated to the 'Bottomless Pit of Despair' queue."
  },
  {
    title: "10. Conclusion of the Never-Ending Scroll",
    content: "If you have reached this point, you have officially spent more time reading our terms than 99.9% of the human population. This grants you the unofficial title of 'Artisan Scholar'. We thank you for your patience and remind you that these terms are subject to change as soon as we think of more useless information to add to them. Please check back every three lunar cycles for updates."
  }
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white p-6 md:p-12 font-inter pt-28">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12 pb-20"
      >
        <div className="border-l-4 border-[#ffd700] pl-6">
          <h1 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter">
            Terms of Service
          </h1>
          <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-xs">
            Last Updated: 4 May 2026 • Revision v4.2.0-Cosmic
          </p>
        </div>

        <div className="grid gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-orbitron font-bold text-[#ffd700] uppercase tracking-tight flex items-center gap-3">
                <span className="text-[10px] bg-[#ffd700]/10 text-[#ffd700] px-2 py-1 rounded">SECTION {idx + 1}</span>
                {section.title}
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl bg-[#0d1120] border border-white/5 text-center space-y-4">
          <p className="text-sm text-gray-500 italic">
            "In the grand tapestry of the universe, your diamond top-up is but a single golden thread. Make it count."
          </p>
          <div className="w-12 h-1 bg-[#ffd700]/20 mx-auto rounded-full" />
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
            ArtisanStore.xyz • All Rights Reserved Across All Timelines
          </p>
        </div>
      </motion.div>
    </div>
  )
}
