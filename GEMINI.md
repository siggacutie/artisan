# GEMINI.md — ArtisanStore.xyz Project Brief

## Project Overview
ArtisanStore.xyz is a dark-themed mobile-first e-commerce platform
for gaming top-ups and accounts. Currently launching with
Mobile Legends Bang Bang only. More games will be added later
via the admin panel without any code changes.

Brand name: ArtisanStore.xyz
Tagline: "Game Credits. Instantly. Delivered."

Current games: Mobile Legends Bang Bang (MLBB) only.
Future games: added via admin panel, zero code changes needed.

---

## CRITICAL RULES — READ EVERY SINGLE SESSION

1. ArtisanStore.xyz is a MULTI-GAME store. It sells MLBB now
   but is built for many games. Never make it feel like an
   MLBB-only store. The homepage, navbar, hero, and all
   global UI must be game-neutral and globally appealing.

2. MLBB-specific content belongs ONLY inside:
   /games/mobile-legends/* routes
   /admin/games/mobile-legends/* routes
   Never bleed MLBB branding into global pages.

3. Target audience is GLOBAL. Indians are the primary market
   but the store serves players from Malaysia, Philippines,
   Indonesia, Middle East, Europe, and beyond. Never use
   India-only language on global pages. Never say
   "India's #1" anywhere. Say "Trusted by players worldwide"
   or "The ultimate gaming store" instead.

4. Currency: INR default for Indian users only. Auto-detect
   region and show local currency. Foreign users see USD,
   MYR, PHP, AED etc. Never hardcode INR on global pages.

5. Payment: The platform uses a payment gateway that supports
   UPI, cards, netbanking, and wallets. No crypto. No Stripe.
   Payment provider may change — never hardcode provider
   names in UI text or user-facing copy.

6. Dark theme always. Gold #ffd700 accents always.
   Never add light sections without explicit instruction.

7. Mobile-first always. Test every page at 375px first.

8. Admin routes are protected by role middleware always.
   Never expose admin pages to regular users.

9. Never store plain text passwords or account credentials.

10. All payment webhooks must verify signature before
    processing anything.

11. Show savings in currency amount not percentage.
    "You save ₹18" not "5% off"

12. Every page needs loading states and error states.
    No page should ever show blank content.

13. Wallet pay always shows the discount incentive.
    This must be visible on every checkout flow.

---

## Target Audience

Primary: Indian players (INR default, UPI preferred)
Secondary: Southeast Asia (Malaysia, Philippines, Indonesia)
Tertiary: Middle East, Europe, global players

Currency: Auto-detect via IP geolocation
  India → INR
  Malaysia → MYR
  Philippines → PHP
  UAE → AED
  Default fallback → USD

Language: English only for now.
Device: Mobile-first. Most players are on mobile.

---

## Products

### 1. Game Top-Ups (currently MLBB only)
- Customer selects a game from the games catalogue
- Customer enters game-specific player details
  (for MLBB: Player ID and Zone ID)
- Site verifies player via supplier API before checkout
- Packages managed per game via admin panel
- Delivery fully automatic via supplier API after payment
- Delivery target: under 5 minutes

### 2. Pre-built Account Shop (DEPRECATED)
- Account selling is currently disabled.

---

## Routes

| Route                              | Page                        |
|------------------------------------|-----------------------------|
| /                                  | Landing Page (game-neutral) |
| /games                             | All Games Catalogue         |
| /games/[game-slug]                 | Game Landing Page           |
| /games/[game-slug]/topup           | Top-Up Page                 |
| /login                             | Login                       |
| /invite/[token]                    | Reseller Signup             |
| /dashboard                         | Dashboard (wallet tab)      |
| /dashboard/orders                  | Order History               |
| /dashboard/wallet                  | Wallet and Transactions     |
| /dashboard/profile                 | Profile Settings            |
| /wallet/add                        | Add Funds                   |
| /membership                        | Membership Status           |
| /reseller                          | Reseller Pricing            |
| /admin                             | Admin Dashboard             |
| /admin/games                       | Game Manager                |
| /admin/packages                    | Package Manager             |
| /admin/orders                      | Order Management            |
| /admin/users                       | User Management             |
| /admin/payments                    | Payment Approval Queue      |
| /admin/coupons                     | Coupon Manager              |
| /admin/banners                     | Banner Manager              |
| /admin/pricing                     | Pricing Config              |
| /admin/invites                     | Invite Link Manager         |
| /admin/analytics                   | Sales Analytics             |
| /terms                             | Terms of Service            |
| /privacy                           | Privacy Policy              |
| /refund                            | Refund Policy               |
| /contact                           | Contact and Support         |
| /banned                            | Account Suspended           |

---

## Design System

### Colors
- Background: #050810
- Section alternate: #0a0f1e
- Card background: #0d1120
- Border: rgba(255,215,0,0.1)
- Primary accent: #ffd700 (gold)
- Secondary accent: #00c3ff (electric blue)
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b
- Glow gold: rgba(255,215,0,0.3)
- Glow blue: rgba(0,195,255,0.3)
- Muted text: #64748b
- Subtle text: #475569
- Faint text: #334155
- WhatsApp green: #25d366

### Typography
- Headings: Orbitron (bold, gaming feel)
- Body: Inter
- Prices: Orbitron or Inter bold

### UI Rules
- CTA buttons: gold background (#ffd700), black bold text
- Cards: #0d1120 bg, gold border low opacity, glow on hover
- Hover: gold glow box-shadow + translateY(-2px) 200ms ease
- Section headers: left aligned with gold accent
- Loading: skeleton screens for all async content
- Errors: friendly message with retry button always
- Animations: framer-motion on product/dashboard pages only
- No framer-motion on homepage, navbar, login, invite pages
- No emojis anywhere — Lucide icons only
- No html form tags — use div + onClick always
- No gradient text effects
- Content visible above fold on desktop

### Card Rules
- Vary padding and borders based on card importance
- Primary cards: box-shadow 0 4px 32px rgba(0,0,0,0.5)
- Add subtle top gradient line on primary cards
- Icon containers: color-coded per semantic meaning
  - Wallet/coins: amber (#ffd700)
  - Security/shield: green (#22c55e)
  - Orders/package: blue (#00c3ff)
  - Settings: purple (#8b5cf6)
  - Warning: orange (#f59e0b)

### Mobile
- Design at 375px first, scale up
- Hamburger nav or bottom tab bar on mobile
- Touch targets minimum 44px height
- Horizontal scroll with snap for card rows

---

## Auth System

### Reseller Auth (custom — NO NextAuth)
- File: lib/resellerAuth.ts
- Username + password only at /login
- bcrypt password hashing (12 rounds)
- Session stored in ResellerSession table
- httpOnly cookie named reseller_session
- Single device enforcement
- NO Google OAuth, NO email primary login
- Email used only for OTP/2FA verification
- 2FA OTP sent via Resend when email is linked
- Forgot password via email OTP flow
- Rate limit: 5 failed attempts per 15 minutes per IP/username

### Admin Auth (custom JWT)
- File: lib/adminAuth.ts
- Email + password at /admin/login
- JWT cookie named admin_session, 8hr expiry
- SUPER_ADMIN hardcoded: alandumspar@gmail.com

### OTP System
- 6-digit codes via crypto.randomInt
- Stored in OtpCode table
- Types: EMAIL_VERIFY, LOGIN_2FA, PASSWORD_RESET
- Expires in 10 minutes
- Max 5 wrong attempts before invalidation
- Sent via Resend from noreply@artisanstore.xyz
- In development: printed to terminal console

---

## Payment System

### Architecture
- Wallet-based: users top up wallet, then pay from balance
- Direct checkout: DISABLED (users must use wallet balance)
- Payment provider: Manual UPI with UTR verification & Automatic Listener
- Never hardcode payment provider names in UI copy
- All verification endpoints must be rate-limited and protected

### Wallet Top-Up
- User selects preset amount (INR): 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000
- Site generates unique UPI QR code and reference (upiRef)
- User pays via any UPI app and submits 12-digit UTR number
- Automatic verification via Android notification listener
- Fallback manual approval via Admin Panel
- Wallet balance stored as INR float in database
- Display to users: Math.floor(walletBalance) coins
- 1 INR = 1 coin

### Coin System
- 1 INR = 1 coin
- walletBalance stored as INR in DB
- Display: Math.floor(walletBalance) + " coins"
- Package prices in coins: Math.ceil(resellerPrice)
- Insufficient balance check: compare raw INR values
- Landing page shows INR with ₹ symbol (unauthenticated)
- All authenticated pages show coins only, never ₹

### Security Requirements
- Amount whitelist enforced server-side only
- Payment signature verified before any DB write
- Order amount fetched server-side — never trust client
- Idempotency check on all payment processing
- Prisma $transaction for atomic wallet credits
- Session required for all payment endpoints
- Origin validation on all POST routes

### Payment Webhook
- Always verify HMAC signature first
- Idempotency: check referenceId before crediting
- Atomic DB transaction for credit + transaction log

---

## Membership System

- Resellers access platform via invite link only
- Invite links have membershipMonths: 1, 3, 6, or 12
- Pricing: 1mo=₹250, 3mo=₹699, 6mo=₹1299, 12mo=₹2699
- On expiry: redirect to /membership?expired=true
- 3 days after expiry: cron cleans up wallet, freezes account
- Renewal payment available on /membership page
- membershipExpiresAt stored in User table

---

## Supplier Integration

### Current Supplier: Smile.one (MLBB only)

Step 1 — Verify Player (before checkout):
POST https://www.smile.one/merchant/mobilelegends/checkrole
Form data:
  user_id: our smile.one merchant ID
  zone_id: customer zone ID input
  pid: 25 (fixed for MLBB)
  checkrole: 1

Response code 200 = valid player.
Show "Confirmed: [username]" in green.
Any other code = show "Invalid Player ID or Zone ID".

Step 2 — Place Order (after payment confirmed):
Call smile.one order endpoint with player details
and the mapped product ID for selected package.

### Supplier Config Per Game (in admin)
Each game stores: supplier name, base URL,
API credentials, product ID mapping per package,
input field config (what player details to collect).

---

## Admin Panel

### User Management (/admin/users)
- Search and filter users
- View wallet balance, orders, membership status
- Change username, change password
- Manual wallet credit or debit
- Ban / unban / freeze accounts
- Set membership duration
- Revoke membership immediately
- Email 2FA toggle per user (emailDisabled)
- View user email and verification status
- Add admin note

### Invite Manager (/admin/invites)
- Generate one-time invite links
- Select membership duration: 1, 3, 6, 12 months
- Toggle email requirement per invite
- View recent invites and usage status

### Package Manager (/admin/packages)
- Filter by game
- View packages (seeded, no manual create)
- Fields: diamond amount, base price, display price,
  visibility, bonus diamonds, supplier product ID

### Pricing Config (/admin/pricing)
- SmileCoin amount purchased + INR paid
- Markup percent
- Landing page discount percent
- Invite link expiry hours

### Order Management (/admin/orders)
- View all orders
- Filter by game, status, date
- Mark complete, failed, refund to wallet

### Payment Queue (/admin/payments)
- Approve or reject payment submissions
- Manual wallet credit on approval

### Coupon Manager (/admin/coupons)
- Create coupons: code, discount, max uses,
  expiry, min order value, applicable game

### Banner Manager (/admin/banners)
- Add, edit, delete banners for homepage carousel
- Fields: title, subtitle, CTA text, CTA link,
  gradient colors, active status, sort order

### Game Manager (/admin/games)
- Add new games with supplier config
- Toggle game visibility on storefront

### Analytics (/admin/analytics)
- Sales overview, revenue, order counts

---

## Database Models (key ones)

User, ResellerSession, OtpCode, InviteLink,
AdminAccount, SmilecoinConfig, PricingConfig,
Game, DiamondPackage, Order, WalletTransaction,
Banner, Coupon, SupportTicket, LoginHistory,
SuspiciousActivity, MembershipPayment, Settings

Full schema in prisma/schema.prisma

---

## Tech Stack

| Layer       | Choice                                      |
|-------------|---------------------------------------------|
| Framework   | Next.js 16.2.2 App Router                   |
| React       | 19.2.4                                      |
| Styling     | Tailwind CSS 4.0 + inline styles            |
| Database    | PostgreSQL via Supabase                     |
| ORM         | Prisma 5.22.0                               |
| Auth        | Custom (no NextAuth for resellers)          |
| Email       | Resend (noreply@artisanstore.xyz)           |
| Payments    | TBD — gateway being finalized              |
| Delivery    | Smile.one API (MLBB), extensible per game  |
| Storage     | Supabase Storage (avatars bucket, public)  |
| Encryption  | bcrypt (passwords)                         |
| Hosting     | Ubuntu VPS 103.165.11.203, PM2 + Nginx     |
| Animations  | Framer Motion 12.38.0 (product pages only) |
| State       | Zustand 5.0.12                             |
| Live chat   | Tawk.to                                    |

---

## Environment Variables

DATABASE_URL=""
DIRECT_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="https://artisanstore.xyz"
RESEND_API_KEY=""
EMAIL_FROM="noreply@artisanstore.xyz"
UPI_ID="noblessem@ybl"
NEXT_PUBLIC_UPI_ID="noblessem@ybl"
LISTENER_SECRET="artisan-listener-secret-2026"
SMILEONE_BASE_URL="https://www.smile.one/merchant/mobilelegends"
ENCRYPTION_KEY=""
SUPERADMIN_PASSWORD=""
ADMIN_JWT_SECRET=""
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_SERVICE_KEY=""
NEXT_PUBLIC_TAWK_PROPERTY_ID=""
NEXT_PUBLIC_TAWK_WIDGET_ID=""
DISCORD_WEBHOOK=""
DISCORD_WEBHOOK_ERRORS=""
SIGNUP_ALERTS_WEBHOOK=""
AUTH_TRUST_HOST=true
CRON_SECRET=""
NODE_ENV="development"

---

## Deployment

Local → GitHub → VPS pull and rebuild

VPS: Ubuntu 22.04, 103.165.11.203
Served via PM2 + Nginx
Domain: artisanstore.xyz (GoDaddy)
GitHub: https://github.com/siggacutie/artisan (master)
Local: C:\Users\HARSH\Downloads\Artisan

DB Note: Use port 6543 (pooler) only. Port 5432 unreachable.
lib/prisma.ts must use DATABASE_URL only, never DIRECT_URL.
Never run prisma db push. Use Supabase SQL Editor only.
Always run npx prisma generate after schema changes.

---

## Known Gemini Bad Behaviors — Always Guard Against

- Adds fake games (Free Fire, PUBG, Valorant) — NEVER
- Uses wrong colors — always specify every color value
- Adds email/Google to reseller login — NEVER
- Exports GET/POST from auth.ts — only from route.ts
- Adds framer-motion to homepage or navbar
- Hardcodes prices instead of fetching from API
- Shows ₹ prices on authenticated pages (coins only)
- Uses html form tags — always div + onClick
- Adds unrequested features
- Rebuilds entire files for surgical fixes
- Uses DIRECT_URL in prisma.ts
- Mentions payment provider names in UI copy
- Adds light mode or light sections
- Uses emojis in UI