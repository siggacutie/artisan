Read GEMINI.md before doing anything.

Multiple tasks. Read all before touching any file.

---

## TASK 1 — Update Tawk.to widget with correct script

Open file: components/providers/TawkToWidget.tsx

Replace entire contents with:

```typescript
'use client'

import { useEffect } from 'react'

export function TawkToWidget() {
  useEffect(() => {
    if ((window as any).Tawk_API) return

    ;(function () {
      const Tawk_API = (window as any).Tawk_API || {}
      const Tawk_LoadStart = new Date()
      void Tawk_LoadStart

      const s1 = document.createElement('script')
      const s0 = document.getElementsByTagName('script')[0]
      s1.async = true
      s1.src = 'https://embed.tawk.to/69da8af3f28f6f1c3576711b/1jluqtism'
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      s0.parentNode!.insertBefore(s1, s0)
    })()
  }, [])

  return null
}
```

---

## TASK 2 — Update address in Terms and Privacy pages

Open file: app/(main)/terms/page.tsx
Find every occurrence of the old address:
"GMC Hostel Rd, Christian Basti, Guwahati, Assam 781006, India"
Replace with:
"Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India"

Also find and remove the line "Wallet payments receive a 5% discount." from the payments section. Do not replace it with anything.

Open file: app/(main)/privacy/page.tsx
Find every occurrence of the old address and replace with:
"Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India"

---

## TASK 3 — Create Refund Policy page

Create file: app/(main)/refund/page.tsx

This is a standalone page in the (main) layout group so it has the navbar.

Content must be exactly:

Title: "Refund & Cancellation Policy" in Orbitron 28px white
Last updated: "Last Updated: April 2025" in Inter 13px #64748b
Background: #050810, max-width 800px, margin auto, padding 60px 24px

Sections (Inter 15px, line-height 1.8, color #cbd5e1):

**1. Digital Goods Policy**
All purchases on ArtisanStore.xyz are for digital goods (MLBB diamond top-ups) which are delivered instantly to your in-game account. Due to the instant and irreversible nature of digital delivery, all completed transactions are generally non-refundable once diamonds have been credited to your account.

**2. Eligible Refund Cases**
We will issue a full refund in the following cases:
- Diamonds were not delivered to your account within 24 hours of payment confirmation
- You were charged but no order was created in our system
- Duplicate payment was made for the same order
- Technical error on our platform caused an incorrect amount to be charged

**3. Non-Eligible Cases**
Refunds will NOT be issued for:
- Incorrect Player ID or Zone ID provided by the customer
- Change of mind after purchase
- Account bans by Moonton after delivery
- Delays caused by Moonton's servers

**4. How to Request a Refund**
To raise a refund request, email support@artisanstore.xyz within 24 hours of your purchase with:
- Your registered email address
- Order ID
- Description of the issue
- Screenshot of your in-game account showing diamonds not received (if applicable)
We will respond within 24 hours and process approved refunds within 5-7 business days.

**5. Cancellations**
Orders cannot be cancelled once submitted as processing begins immediately. If you have made an error, contact us immediately at support@artisanstore.xyz and we will do our best to assist before delivery is completed.

**6. Wallet Balance**
Wallet top-ups are non-refundable once credited to your ArtisanStore wallet. Wallet balance has no cash value and cannot be withdrawn.

**7. Chargebacks**
We strongly request customers to contact us before initiating a chargeback with their bank. Unauthorized chargebacks may result in account suspension. We are happy to resolve all disputes directly.

**8. Contact**
Email: support@artisanstore.xyz
Phone: +91 9387606432
Address: Dharmapur, Abhayapuri, Bongaigaon, Assam 783384, India

Section headings: Orbitron 16px #ffd700, marginTop 32px, marginBottom 12px
Body text: Inter 15px #cbd5e1
Bullet points: rendered as plain divs with "— " prefix, NOT html ul/li tags
Horizontal dividers between sections: 1px solid rgba(255,215,0,0.08)

---

## TASK 4 — Add legal pages to public landing page footer

Open file: app/(main)/page.tsx

Find the footer section at the bottom of the landing page. Add these links in the footer:

Links to add: Terms of Service (/terms), Privacy Policy (/privacy), Refund Policy (/refund), Contact (/contact)

Style: display flex, gap 24px, justifyContent center, flexWrap wrap, marginTop 16px
Each link: Inter 13px, color #475569, textDecoration none, on hover color #64748b
Separator between links: " · " in #334155

Do not change anything else on the landing page.

---

## TASK 5 — Update authenticated navbar support dropdown

Open file: components/layout/Navbar.tsx

Find the SUPPORT dropdown in the authenticated navbar. Currently it has some links. Replace its contents with these exact links:

- Contact Us → /contact
- Terms of Service → /terms  
- Privacy Policy → /privacy
- Refund Policy → /refund

Each item: Inter 14px white, padding 10px 16px, display block, no underline, on hover background rgba(255,215,0,0.05)
Dropdown container: background #0d1120, border 1px solid rgba(255,215,0,0.1), borderRadius 8px, minWidth 180px
Dropdown appears on CSS hover of the SUPPORT nav item, NOT JavaScript toggle.

Do not change any other part of the navbar.

---

## TASK 6 — Add legal links to authenticated navbar (logged-in footer or secondary area)

The terms, privacy, and refund links are now in the SUPPORT dropdown (Task 5). No additional changes needed for the authenticated navbar beyond what Task 5 covers.

---

## VERIFICATION STEPS

1. Visit / unauthenticated — confirm footer shows Terms, Privacy, Refund Policy, Contact links
2. Visit /terms — confirm address shows "Dharmapur, Abhayapuri, Bongaigaon, Assam 783384" and no "5% discount" mention
3. Visit /privacy — confirm address is updated
4. Visit /refund — confirm page renders with all 8 sections
5. Hover SUPPORT in authenticated navbar — confirm dropdown shows Contact Us, Terms of Service, Privacy Policy, Refund Policy
6. Confirm Tawk.to chat bubble appears on main pages
7. Visit /admin — confirm NO Tawk.to widget

## DO NOT:
- Do NOT use html ul/li tags for bullet points in the refund page
- Do NOT add framer-motion
- Do NOT use emojis
- Do NOT modify auth.ts or middleware.ts
- Do NOT change the landing page pricing table or hero section
- Do NOT add the Tawk.to widget to the admin layout