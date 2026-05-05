"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const businessDetails = {
  name: "ArtisanStore.xyz",
  address: "Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India",
  phone: "+91 9387606432",
  email: "support@artisanstore.xyz",
  lastUpdated: "May 2026"
};

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | ArtisanStore.xyz";
  }, []);

  const sections = [
    {
      title: "1. INTRODUCTION AND SCOPE",
      content: `This Privacy Policy governs the manner in which ${businessDetails.name} collects, uses, maintains and discloses information collected from users (each, a "User") of the ${businessDetails.name} website ("Site"). This privacy policy applies to the Site and all products and services offered by ${businessDetails.name}. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. By using our Site, you consent to the data practices described in this statement.`
    },
    {
      title: "2. PERSONAL IDENTIFICATION INFORMATION",
      content: "We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, and mailing address. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities. Specifically, for gaming top-ups, we collect Player ID and Zone ID as provided by the user."
    },
    {
      title: "3. NON-PERSONAL IDENTIFICATION INFORMATION",
      content: "We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information. This data is primarily used for analytical purposes to improve the user experience and ensure the technical stability of the platform."
    },
    {
      title: "4. WEB BROWSER COOKIES",
      content: "Our Site may use \"cookies\" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly. We use cookies primarily for authentication purposes to maintain your session while logged into your account."
    },
    {
      title: "5. HOW WE USE COLLECTED INFORMATION",
      content: `${businessDetails.name} may collect and use Users personal information for the following purposes:\n- To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.\n- To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.\n- To process payments: We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.\n- To send periodic emails: We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.`
    },
    {
      title: "6. HOW WE PROTECT YOUR INFORMATION",
      content: "We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site. Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures. All user passwords are encrypted using industry-standard hashing algorithms before being stored in our database."
    },
    {
      title: "7. SHARING YOUR PERSONAL INFORMATION",
      content: "We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above. We use third-party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission. Specifically, player IDs are shared with our fulfillment suppliers (e.g., Smile.one) to complete your orders."
    },
    {
      title: "8. CHANGES TO THIS PRIVACY POLICY",
      content: `${businessDetails.name} has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.`
    },
    {
      title: "9. YOUR ACCEPTANCE OF THESE TERMS",
      content: "By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes."
    },
    {
      title: "10. CONTACTING US",
      content: `If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:\nEmail: ${businessDetails.email}\nPhone: ${businessDetails.phone}\nAddress: ${businessDetails.address}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#050810] py-24 px-6 md:px-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[850px] mx-auto space-y-12"
      >
        <div className="space-y-4 border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white uppercase tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: {businessDetails.lastUpdated}
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-lg font-black font-heading text-gold uppercase tracking-tight">
                {section.title}
              </h2>
              <div className="text-gray-400 font-normal leading-relaxed text-sm text-justify whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs">
            © 2026 {businessDetails.name}. All rights reserved.
          </p>
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
