# GEMINI.md — Artisan.gg Project Brief

## Project Overview
Artisan.gg is a dark-themed mobile-first e-commerce platform
for gaming top-ups and accounts. Currently launching with
Mobile Legends Bang Bang only. More games will be added later
via the admin panel without restructuring the codebase.

Brand name: Artisan.gg
Tagline: "Top Up. Play Better."

Current games: Mobile Legends Bang Bang (MLBB) only.
Future games: added via admin panel, no code changes needed.

---

## Target Audience
- Primary: Indian users (INR default, Razorpay UPI priority)
- Secondary: Global users (USD, EUR, MYR, PHP, AED auto-detect)
- Currency: INR by default, auto-switch via IP geolocation
- Language: English only
- Device: Mobile-first (majority of players are on mobile)

---

## Products

### 1. Diamond Top-Ups (per game)
- Customer selects a game (currently only MLBB shown)
- Customer enters Player ID and Zone ID (game-specific fields)
- Site verifies player via game supplier API before checkout
- Packages are managed per game via admin panel
- Delivery is fully automatic via supplier API after payment
- Delivery target: under 5 minutes

### 2. Pre-built Account Shop (per game)
- Accounts listed with rank, hero count, skin count,
  server, price, screenshots
- Filter by game, rank, price, server, hero count, skin count
- After purchase credentials shown once in dashboard
  and emailed to buyer
- Admin manages all account listings via admin panel

---

## Routes

| Route                          | Page                          |
|--------------------------------|-------------------------------|
| /                              | Landing Page                  |
| /games                         | All Games (future use)        |
| /games/[game-slug]             | Game Page (top-up + accounts) |
| /games/[game-slug]/topup       | Top-Up Page for that game     |
| /games/[game-slug]/accounts    | Account Shop for that game    |
| /games/[game-slug]/accounts/[id] | Account Detail Page         |
| /login                         | Login                         |
| /register                      | Register                      |
| /forgot-password               | Forgot Password               |
| /dashboard                     | User Dashboard (wallet tab)   |
| /dashboard/orders              | Order History                 |
| /dashboard/wallet              | Wallet and Transactions       |
| /dashboard/profile             | Profile Settings              |
| /dashboard/accounts            | My Purchased Accounts         |
| /wallet/add                    | Add Funds Page                |
| /admin                         | Admin Dashboard               |
| /admin/games                   | Game Manager                  |
| /admin/games/[game-slug]       | Game Settings                 |
| /admin/packages                | Diamond Package Manager       |
| /admin/accounts                | Account Inventory             |
| /admin/orders                  | Order Management              |
| /admin/users                   | User Management               |
| /admin/payments                | Payment Approval Queue        |
| /admin/coupons                 | Coupon Manager                |
| /terms                         | Terms of Service              |
| /privacy                       | Privacy Policy                |
| /contact                       | Contact and Support           |

For now /games redirects to /games/mobile-legends and
/games/mobile-legends is the only active game slug.
The landing page links directly to MLBB top-up and accounts.

---

## Design System

### Colors
- Background: #0a0f1e
- Card background: #131929
- Primary accent: #ffd700 (gold)
- Secondary accent: #00c3ff (electric blue)
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b
- Border: rgba(255,215,0,0.1)
- Glow: rgba(255,215,0,0.3)

### Typography
- Headings: Orbitron or Rajdhani (bold, gaming)
- Body: Inter (clean, readable)
- All prices: bold white or gold, never gray

### UI Rules
- All CTA buttons: gold background, black bold text, rounded-lg
- Cards: #131929 background, gold border at low opacity
- Hover: gold glow box-shadow, subtle translateY(-4px)
- Every async action needs a loading skeleton
- Every error needs a friendly message and retry option
- No excessive animations, framer-motion for entrances only
- Mobile bottom nav always visible on small screens
- Show savings in rupee amount not percentage

### Mobile
- Design for 375px first then scale up
- Hamburger nav on mobile
- Bottom tab bar: Home, Top Up, Accounts, Wallet, Profile
- Touch targets minimum 44px
- Horizontal scroll with snap for package cards

---

## Auth System
- Email and password registration
- OTP email verification on signup via Resend
- JWT access tokens (15 min) in httpOnly cookies
- Refresh tokens (7 days) in httpOnly cookies
- Rate limiting: 5 attempts then 15 min lockout
- Password reset via email link (expires 1 hour)
- Admin role separate from user role
- Email must be verified before first purchase

---

## Payment System

### Provider
Razorpay handles everything.
UPI, Credit Card, Debit Card, Net Banking, PayPal, Wallets.
No other payment gateway. No crypto. No Stripe.

### Methods Available
- UPI (GPay, PhonePe, Paytm etc)
- Credit and Debit Cards (Visa, Mastercard, RuPay)
- Net Banking
- PayPal via Razorpay international
- Razorpay Wallet

### Two Ways to Pay

Option A — Artisan Wallet (Recommended):
Customer tops up their Artisan.gg wallet using Razorpay
then spends balance on any order with one click.
No redirect on checkout. Instant purchase.

Option B — Direct Checkout:
Customer pays per order via Razorpay checkout redirect.
No wallet required.

### Wallet Incentives
- 5% instant discount on all orders paid via wallet
- 2% cashback on wallet orders above 500 INR
- Show savings as "You save X" not as percentage
- Wallet discount cannot stack with coupon codes
- Best deal wins when both apply
- Cashback credited within 10 minutes of order completion

### Preset Wallet Top-Up Amounts
INR: 100, 250, 500, 1000, 2000 plus custom input
USD equivalent shown for foreign users

### Razorpay Webhook
Event: payment.captured
Verify signature before processing anything
On success: update order, trigger supplier delivery,
credit wallet if applicable, send email receipt

---

## Supplier Integration

### Current Supplier: Smile.one (MLBB only for now)
Smile.one handles all MLBB diamond delivery automatically.
Future games will use their own supplier, added via admin.

### Step 1 — Verify Player
POST https://www.smile.one/merchant/mobilelegends/checkrole
Form data:
  user_id: our smile.one merchant ID from env
  zone_id: customer entered zone ID
  pid: 25 (fixed for MLBB)
  checkrole: 1

Success: {"code":200,"username":"PlayerName",...}
Show "Confirmed: [username]" in green below the inputs.
If code is not 200 show "Invalid Player ID or Zone ID".

### Step 2 — Place Order (after payment confirmed)
Call smile.one order endpoint with:
  user_id: customer MLBB player ID
  zone_id: customer MLBB zone ID
  pid: 25
  product_id: smile.one product ID mapped to package
  quantity: 1

### Supplier Config in Admin
Each game in admin panel has:
  supplier name
  supplier API base URL
  supplier API credentials
  product ID mapping per package

### Environment Variables
SMILEONE_USER_ID=""
SMILEONE_API_KEY=""
SMILEONE_BASE_URL="https://www.smile.one/merchant/mobilelegends"

---

## Admin Panel

### Game Manager (/admin/games)
- Add a new game: name, slug, cover image, description,
  is active toggle, supplier config, input fields config
  (e.g. MLBB needs Player ID and Zone ID, other games
  may need different fields)
- Edit existing game settings
- Toggle game visibility on storefront
- Each game has its own packages and account listings

### Diamond Package Manager (/admin/packages)
- Filter packages by game
- Add or edit packages per game
- Fields: game, diamond amount, base price INR, display price,
  is visible, bonus diamonds, bonus label,
  supplier product ID, sort order
- Toggle package visibility

### Account Inventory (/admin/accounts)
- Filter by game
- Add new listing: game, rank, server, hero count, skin count,
  price, screenshots, credential email, credential password
- Edit or delete listings
- Sold accounts auto-hidden from shop

### Order Management (/admin/orders)
- View all orders with filters (game, type, status, date)
- Full order details
- Manually mark complete or failed
- Issue refund to customer wallet
- Internal notes per order

### Payment Approval Queue (/admin/payments)
- Pending manual UPI submissions
- Customer submits UTR number
- Admin approves or rejects
- On approval wallet is credited automatically

### User Management (/admin/users)
- Search by email or ID
- View wallet balance and order history
- Manual wallet credit or debit with reason note
- Ban or unban account

### Coupon Manager (/admin/coupons)
- Create: code, discount percent, max uses,
  expiry date, min order value, applicable game or all
- View usage stats
- Deactivate coupons

### Admin Dashboard (/admin)
- Today revenue
- Total orders
- Pending approvals
- Active users
- Recent orders feed

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

### Orders
id, userId, gameId, type (TOPUP/ACCOUNT), productId,
quantity, unitPrice, totalPrice, discountApplied,
cashbackCredited, paymentMethod, paymentStatus,
orderStatus, playerInputs (json), mlbbUsername,
couponCode, supplierOrderId, notes,
createdAt, completedAt

### WalletTransactions
id, userId, type (CREDIT/DEBIT), amount, currency,
method, referenceId, status, description, createdAt

### DiamondPackages
id, gameId, diamondAmount, basePriceInr, displayPrice,
isVisible, bonusDiamonds, bonusLabel,
supplierProductId, sortOrder, createdAt

### AccountListings
id, gameId, rank, server, heroCount, skinCount,
priceInr, screenshots (array), credentialEmail,
credentialPassword (AES-256 encrypted),
isSold, soldToUserId, createdAt

### Coupons
id, code, discountPercent, maxUses, usedCount,
minOrderValue, expiryDate, applicableGameId (null = all),
isActive, createdAt

### SupportTickets
id, userId, orderId, subject, status,
messages (json), createdAt, resolvedAt

---

## Tech Stack

| Layer        | Choice                                    |
|--------------|-------------------------------------------|
| Framework    | Next.js 14 App Router                     |
| Styling      | Tailwind CSS + shadcn/ui                  |
| Database     | PostgreSQL via Supabase                   |
| ORM          | Prisma                                    |
| Auth         | NextAuth.js v5 + JWT                      |
| Email        | Resend                                    |
| Payments     | Razorpay only                             |
| Delivery     | Smile.one API (MLBB), extensible          |
| Currency     | exchangerate-api.com                      |
| Geolocation  | ip-api.com                                |
| Storage      | Supabase Storage (screenshots)            |
| Encryption   | bcrypt (passwords) AES-256 (credentials)  |
| Hosting      | Vercel + Supabase                         |

---

## Environment Variables

DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="noreply@artisan.gg"
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

### Phase 1 — MVP
- Project scaffold and folder structure
- Prisma schema with Games table for extensibility
- Landing page UI (MLBB featured, built to support more)
- Auth pages UI
- Top-up page UI at /games/mobile-legends/topup
- Dashboard UI
- Add funds page UI
- Razorpay wallet top-up backend
- Smile.one player verify API route
- Order creation and status flow
- Email receipts via Resend
- Basic admin (orders, payment approval, package manager)

### Phase 2 — Full Launch
- Account shop at /games/mobile-legends/accounts
- Smile.one auto delivery after payment confirmed
- Wallet discount and cashback logic
- Coupon system
- Full admin panel (games, packages, accounts, users, coupons)
- Currency auto-detection and conversion
- Credential delivery to dashboard

### Phase 3 — Growth
- Second game added via admin panel (no code changes)
- Google OAuth
- Referral system
- Loyalty points
- Seasonal events
- SEO optimization
- Push notifications

---

## Strict Rules (Read Every Session)
1. Brand is Artisan.gg everywhere. No other name.
2. Currently MLBB only on storefront. Architecture must
   support multiple games. Use gameId on all relevant
   models so new games need zero database changes.
3. No blog. No unrelated pages.
4. Nav: Home, Games (MLBB only for now), Wallet, Login.
5. Dark theme always. Gold #ffd700 accents always.
6. Mobile-first always. Test at 375px.
7. INR default. Auto-convert for foreign users.
8. Razorpay is the only payment gateway. No exceptions.
9. Smile.one handles MLBB delivery. Built to swap per game.
10. Wallet pay always shows 5% discount incentive.
11. Never store plain text passwords or credentials.
12. All Razorpay webhooks must verify signature first.
13. Admin routes protected by role middleware always.
14. Show savings in rupee amount not percentage.
15. Every page needs loading and error states.