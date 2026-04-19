# GEMINI.md — Artisan.gg Project Brief

## Project Overview
Artisan.gg is a dark-themed mobile-first e-commerce platform
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

5. Payment: Razorpay is the only gateway. No crypto.
   No Stripe. No NowPayments. Razorpay handles UPI, cards,
   netbanking, and international payments.

6. Dark theme always. Gold #ffd700 accents always.
   Never add light sections without explicit instruction.

7. Mobile-first always. Test every page at 375px first.

8. Admin routes are protected by role middleware always.
   Never expose admin pages to regular users.

9. Never store plain text passwords or account credentials.

10. All Razorpay webhooks must verify signature before
    processing anything.

11. Show savings in currency amount not percentage.
    "You save 18" not "5% off"

12. Every page needs loading states and error states.
    No page should ever show blank content.

13. Wallet pay always shows the 5% discount incentive.
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
- Account selling is currently disabled to comply with payment gateway policies.

---

## Routes

| Route                              | Page                        |
|------------------------------------|-----------------------------|
| /                                  | Landing Page (game-neutral) |
| /games                             | All Games Catalogue         |
| /games/[game-slug]                 | Game Landing Page           |
| /games/[game-slug]/topup           | Top-Up Page                 |
| /login                             | Login                       |
| /register                          | Register                    |
| /forgot-password                   | Forgot Password             |
| /dashboard                         | Dashboard (wallet tab)      |
| /dashboard/orders                  | Order History               |
| /dashboard/wallet                  | Wallet and Transactions     |
| /dashboard/profile                 | Profile Settings            |
| /wallet/add                        | Add Funds                   |
| /admin                             | Admin Dashboard             |
| /admin/games                       | Game Manager                |
| /admin/games/[game-slug]           | Game Settings               |
| /admin/packages                    | Package Manager             |
| /admin/orders                      | Order Management            |
| /admin/users                       | User Management             |
| /admin/payments                    | Payment Approval Queue      |
| /admin/coupons                     | Coupon Manager              |
| /admin/banners                     | Banner Manager              |
| /terms                             | Terms of Service            |
| /privacy                           | Privacy Policy              |
| /contact                           | Contact and Support         |

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

### Typography
- Headings: Orbitron (bold, gaming feel)
- Subheadings: Rajdhani
- Body: Inter
- Prices: Orbitron or Inter bold

### UI Rules
- CTA buttons: gold gradient background, black bold text
- Cards: #0d1120 bg, gold border low opacity, glow on hover
- Hover: gold glow box-shadow + translateY(-4px) 200ms
- Section headers: left aligned with 4px gold left border bar
- Loading: skeleton screens for all async content
- Errors: friendly message with retry button always
- Animations: framer-motion for entrances and hovers only
- No heavy libraries. Performance first.

### Mobile
- Design at 375px first, scale up
- Hamburger nav with slide-in drawer on mobile
- Bottom tab bar: Home, Games, Wallet, Profile
- Touch targets minimum 44px height
- Horizontal scroll with snap for card rows

---

## Auth System
- Email and password registration
- OTP email verification via Resend before first purchase
- JWT access tokens 15 min in httpOnly cookies
- Refresh tokens 7 days in httpOnly cookies
- Rate limit: 5 login attempts then 15 min lockout
- Password reset via email link expires 1 hour
- Admin role separate from user role
- Google OAuth in Phase 2

---

## Payment System

### Provider: Razorpay only
Handles: UPI, Credit Card, Debit Card, Net Banking,
PayPal, international cards, Razorpay Wallet.
No other gateway. No crypto. No Stripe. No NowPayments.

### Two Checkout Options

Option A — Artisan Wallet (recommended):
User tops up wallet via Razorpay then pays from balance.
One click checkout. No redirect. 5% discount applied.

Option B — Direct Checkout:
User pays per order via Razorpay redirect. No wallet needed.

### Wallet Incentives
- 5% instant discount on all wallet orders
- 2% cashback on wallet orders above 500 INR or $6 USD
- Savings shown as currency amount not percentage
- Cashback credited within 10 minutes post order
- Discount cannot stack with coupons, best deal wins

### Preset Top-Up Amounts
INR users: 100, 250, 500, 1000, 2000 + custom
USD users: 2, 5, 10, 25, 50 + custom
Other currencies: equivalent amounts auto-calculated

### Razorpay Webhook
Event: payment.captured
Always verify signature before processing.
On success: update order, trigger supplier delivery,
credit wallet if applicable, send email receipt.

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

### Environment Variables
SMILEONE_USER_ID=""
SMILEONE_API_KEY=""
SMILEONE_BASE_URL="https://www.smile.one/merchant/mobilelegends"

---

## Admin Panel Capabilities

### Banner Manager (/admin/banners)
Add, edit, delete promotional banners shown in the
homepage carousel. Fields: title, subtitle, CTA text,
CTA link, gradient start color, gradient end color,
is active, sort order.

### Game Manager (/admin/games)
Add new games with: name, slug, cover image, description,
is active, supplier config, input fields config.
Toggle game visibility on storefront.

### Package Manager (/admin/packages)
Filter by game. Add, edit, delete packages.
Fields: game, diamond amount, base price, display price,
is visible, bonus diamonds, bonus label,
supplier product ID, sort order.

### Order Management (/admin/orders)
View all orders. Filter by game, type, status, date.
Mark complete, failed, or refund to wallet.

### Payment Queue (/admin/payments)
Approve or reject manual UPI submissions.
Customer submits UTR, admin verifies, wallet credited.

### User Management (/admin/users)
Search users, view wallet and orders, manual wallet
credit or debit, ban or unban.

### Coupon Manager (/admin/coupons)
Create coupons with code, discount, max uses,
expiry, min order value, applicable game.

---

## Database Schema

### Users
id, email, passwordHash, name, role (USER/ADMIN),
emailVerified, avatarUrl, walletBalance,
currencyPreference, isBanned, createdAt, updatedAt

### Games
id, name, slug, description, coverImage, isActive,
supplierName, supplierBaseUrl, supplierConfig (json),
inputFields (json), createdAt, updatedAt

### Banners
id, title, subtitle, ctaText, ctaLink,
gradientStart, gradientEnd, isActive,
sortOrder, createdAt

### Orders
id, userId, gameId, type (TOPUP),
productId, quantity, unitPrice, totalPrice,
discountApplied, cashbackCredited, paymentMethod,
paymentStatus, orderStatus, playerInputs (json),
playerUsername, couponCode, supplierOrderId,
notes, createdAt, completedAt

### WalletTransactions
id, userId, type (CREDIT/DEBIT), amount, currency,
method, referenceId, status, description, createdAt

### DiamondPackages
id, gameId, diamondAmount, basePriceInr, displayPrice,
isVisible, bonusDiamonds, bonusLabel,
supplierProductId, sortOrder, createdAt

### Coupons
id, code, discountPercent, maxUses, usedCount,
minOrderValue, expiryDate, applicableGameId (null=all),
isActive, createdAt

### SupportTickets
id, userId, orderId, subject, status,
messages (json), createdAt, resolvedAt

---

## Tech Stack

| Layer       | Choice                                      |
|-------------|---------------------------------------------|
| Framework   | Next.js 14 App Router                       |
| Styling     | Tailwind CSS + shadcn/ui                    |
| Database    | PostgreSQL via Supabase                     |
| ORM         | Prisma                                      |
| Auth        | NextAuth.js v5 + JWT                        |
| Email       | Resend                                      |
| Payments    | Razorpay only                               |
| Delivery    | Smile.one API (MLBB), extensible per game   |
| Currency    | exchangerate-api.com                        |
| Geolocation | ip-api.com (free tier)                      |
| Storage     | Supabase Storage (screenshots)              |
| Encryption  | bcrypt (passwords) AES-256 (credentials)    |
| Hosting     | Vercel + Supabase                           |

---

## Environment Variables

DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="noreply@artisanstore.xyz"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""
SMILEONE_USER_ID=""
SMILEONE_API_KEY=""
SMILEONE_BASE_URL="https://www.smile.one/merchant/mobilelegends"
ENCRYPTION_KEY=""
CURRENCY_API_KEY=""

---

## Build Phases

### Phase 1 — MVP (current)
- Project scaffold complete
- Landing page UI (game-neutral, global appeal)
- Auth pages UI
- MLBB top-up page UI
- Dashboard UI
- Add funds page UI
- Razorpay wallet top-up backend
- Smile.one player verify API
- Order creation and status flow
- Email receipts via Resend
- Basic admin (orders, payments, packages)

### Phase 2 — Full Launch
- Smile.one auto delivery post payment
- Wallet discount and cashback logic
- Coupon system
- Full admin panel
- Currency auto-detection
- Banner management system

### Phase 3 — Growth
- Second game via admin (no code changes)
- Google OAuth
- Referral system
- Loyalty points
- SEO optimization
- Push notifications