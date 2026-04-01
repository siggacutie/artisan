# GEMINI.md — MLBB Store Project Brief

## 🎯 Project Overview
A clean, fast, mobile-first e-commerce web platform exclusively for
Mobile Legends: Bang Bang (MLBB). Users can purchase Diamond Top-Ups
and pre-built MLBB Accounts. No other games. No blog. No unnecessary
pages. The goal is a simple, trustworthy, conversion-optimized store, the name decided is "Artisan".

---

## 🌍 Target Audience
- **Primary:** Indian users (payments in INR ₹, Razorpay UPI priority)
- **Secondary:** Southeast Asia, Middle East, Europe, US
- **Currency:** Show INR by default, auto-detect and switch for foreign
  users (USD, EUR, MYR, PHP, AED etc.) via IP geolocation
- **Language:** English only for now
- **Device:** Mobile-first (majority of MLBB players are on mobile)

---

## 🛍️ Products Offered

### 1. Diamond Top-Ups
- User provides MLBB UID + Server
- Site verifies and displays in-game username before purchase
- Packages: 86, 172, 257, 344, 429, 514, 600, 706, 792, 878, 963,
  1049, 1135, 1220, 1306, 1412, 2195, 3688, 5532, 7376, 9220, 11144
  diamonds (standard MLBB denomination ladder)
- Pricing in INR with foreign currency auto-conversion
- Delivery: instant or within 5 minutes
- Each package card shows: 💎 amount, original price, discounted
  price, savings amount, estimated delivery time

### 2. Pre-built Account Shop
- Accounts listed with: Rank, Hero Count, Skin Count, Server,
  Price, Screenshots
- Filter by: Rank (Epic/Legend/Mythic/Mythical Glory/Glorious
  Mythic), Price Range, Server, Hero Count, Skin Count
- After purchase: credentials shown once in dashboard (email +
  password), also emailed to buyer
- Account detail page: full hero list, skin gallery, rank history,
  server, price, buy button

---

## 🧭 Pages & Routes

| Route              | Page                          |
|--------------------|-------------------------------|
| /                  | Landing Page                  |
| /topup             | Diamond Top-Up Page           |
| /accounts          | Account Shop                  |
| /accounts/[id]     | Account Detail Page           |
| /login             | Login                         |
| /register          | Register                      |
| /forgot-password   | Forgot Password               |
| /dashboard         | User Dashboard                |
| /dashboard/orders  | Order History                 |
| /dashboard/wallet  | Wallet & Transactions         |
| /dashboard/profile | Profile Settings              |
| /wallet/add        | Add Funds Page                |
| /admin             | Admin Panel (protected)       |
| /admin/orders      | Order Management              |
| /admin/accounts    | Account Inventory             |
| /admin/users       | User Management               |
| /admin/payments    | Payment Approval Queue        |
| /terms             | Terms of Service              |
| /privacy           | Privacy Policy                |
| /contact           | Contact / Support             |

---

## 🎨 Design System

### Theme
- **Mode:** Dark (primary), optional light mode toggle later
- **Background:** Deep navy #0a0f1e or near-black #0d0d0d
- **Primary Accent:** MLBB Gold #f4c430 / Yellow #ffd700
- **Secondary Accent:** Electric blue #00c3ff for highlights
- **Success:** #22c55e | **Error:** #ef4444 | **Warning:** #f59e0b
- **Cards:** Slightly lighter than background #131929, subtle border

### Typography
- **Headings:** Rajdhani or Orbitron (bold, gaming feel)
- **Body:** Inter or DM Sans (clean, readable)
- **Font sizes:** Follow Tailwind scale (text-sm to text-5xl)

### UI Rules
- Card-based layout with soft glow on hover
- CTA buttons: gold background, dark text, bold, rounded-lg
- Trust badges and icons throughout (shield, lightning bolt, clock)
- Smooth transitions (300ms ease)
- Skeleton loaders for async content
- Toast notifications for actions (success/error/info)
- No stock photos — use official MLBB artwork (verify licensing)
- Flags + currency codes for international display
- Rupee symbol ₹ default, swap to $ € etc by region

### Mobile First
- Hamburger nav on mobile
- Bottom tab bar on mobile for: Home, Top Up, Accounts, Wallet,
  Profile
- Touch-friendly tap targets (min 44px)
- Swipeable package cards on mobile

---

## 🔐 Auth System

- Email + Password registration
- OTP email verification on signup (via Resend or Nodemailer)
- Google OAuth login (optional but recommended)
- JWT access tokens (15 min expiry) + refresh tokens (7 days)
- Tokens stored in httpOnly cookies (not localStorage)
- Rate limiting on login: max 5 attempts then 15 min lockout
- Admin role separate from user role (role field in DB)
- Password reset via email link (expires in 1 hour)
- Email verification required before first purchase

---

## 💳 Payment System

### Direct Checkout (Pay Per Order)
Users can pay directly per order without pre-loading wallet:

| Method         | Provider       | Region            | Notes                          |
|----------------|----------------|-------------------|--------------------------------|
| UPI / Cards    | Razorpay       | India (Primary)   | UPI, NetBanking, RuPay, Cards  |
| Int'l Cards    | Stripe         | Global            | Visa, Mastercard, Amex         |
| Crypto         | NowPayments    | Global            | USDT, BTC, ETH, 100+ coins     |
| PayPal         | PayPal SDK     | Global            | International fallback         |
| Manual UPI     | Admin-verified | India             | User submits UTR number        |
| Manual Crypto  | Admin-verified | Global            | User sends to wallet address   |

### Wallet System (Pre-load Balance)
- User tops up wallet using any payment method above
- Balance stored in account, spend on any purchase
- Minimum top-up: ₹50 / $1 equivalent
- Preset amounts: ₹100, ₹250, ₹500, ₹1000, ₹2000 (INR)
  or $2, $5, $10, $25, $50 (USD) based on detected region
- Custom amount input allowed

### Wallet Incentives (Keep Subtle)
- ✅ 5% instant discount on all orders paid via wallet
- ✅ 2% cashback credited to wallet on orders above ₹500 / $6
- ✅ Bonus diamonds on select packages during events
  (e.g. "Buy 1049💎 get 50💎 free — wallet pay only")
- ✅ One-click checkout — no payment redirect

### Discount Rules
- Show savings in currency amount not percentage
  ("You save ₹18" not "5% off") — feels more real
- Wallet % discount and cashback can apply together
- Wallet discount cannot stack with coupon codes
  (best deal wins, show which is applied)
- Cashback credited within 10 minutes post-order
- Admin can create limited-time coupon codes
- Referral codes: 2-3% one-time discount for new user's first topup

### Checkout Flows

**Wallet Pay (Recommended):**
Select Package → Confirm UID → One-Click Buy →
Deducted from wallet → Processing → Done ✅

**Direct Pay:**
Select Package → Confirm UID → Choose Payment →
Redirect to Razorpay / Stripe / NowPayments →
Webhook confirms → Order fulfilled → Done ✅

### Webhooks Required
- Razorpay: payment.captured event
- Stripe: checkout.session.completed event
- NowPayments: payment_status webhook (confirmed/finished)
- PayPal: PAYMENT.CAPTURE.COMPLETED event
- All webhooks must: verify signature → update order → credit
  wallet if applicable → trigger delivery → send email receipt

---

## 🧾 Order System

### Diamond Top-Up Order States
```
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED → REFUNDED (wallet credit)
```

### Account Order States
```
PENDING → PAID → CREDENTIALS_SENT → COMPLETED
             ↘ FAILED → REFUNDED
```

### Post-Order Actions
- Email receipt sent immediately
- Dashboard order history updated in real time
- For top-ups: delivery within 5 minutes (show countdown)
- For accounts: credentials shown in dashboard + emailed
- Failed orders: auto-refund to wallet within 10 minutes
- Support ticket auto-created for failed orders

---

## 👤 User Dashboard

### Wallet Tab
- Current balance (large, prominent)
- Add Funds button → opens payment method selector
- Transaction log: date, type (credit/debit), amount, method,
  status, reference ID

### Orders Tab
- All orders (top-ups + accounts) in one list
- Filter by: type, status, date range
- Each row: order ID, product, amount, status badge, date,
  action (view details / raise issue)

### Profile Tab
- Display name, email (verified badge), avatar upload
- Change password
- Linked payment methods (saved cards via Stripe/Razorpay)
- Notification preferences (email on order complete, promotions)
- Delete account option

### My Accounts Tab (if they bought accounts)
- List of purchased accounts
- "Reveal Credentials" button (requires password confirmation)
- Re-reveal allowed anytime (credentials stored encrypted)

---

## 🛠️ Admin Panel

### Dashboard
- Live stats: today's revenue, total orders, pending approvals,
  active users, wallet balances total, conversion rate

### Order Management
- View all orders with filters
- Manually fulfill, mark complete, issue refund to wallet
- Notes field per order for internal use

### Payment Approval Queue
- UPI: user submits UTR → admin sees screenshot + UTR →
  approve → wallet credited
- Manual Crypto: user submits TX hash → admin verifies →
  approve → wallet credited

### Account Inventory
- Add new accounts: rank, server, heroes, skins, price,
  screenshots, credentials (stored encrypted)
- Edit / remove listings
- Mark as sold (auto-happens on purchase)
- Stock count display

### Diamond Package Manager
- Edit pricing per package
- Toggle package visibility (show/hide)
- Add bonus diamond labels to packages
- Set regional pricing overrides

### User Management
- Search users by email / ID
- View wallet balance, order history
- Manual wallet credit / debit with reason note
- Ban / unban accounts
- Reset user password (sends email link)

### Coupon Manager
- Create coupon: code, discount %, max uses, expiry date,
  min order value, applicable products
- View usage stats per coupon

---

## 🗄️ Database Schema (PostgreSQL)

### Users
```
id, email, password_hash, name, role (user/admin),
email_verified, google_id, avatar_url,
wallet_balance, currency_preference,
created_at, updated_at, is_banned
```

### Orders
```
id, user_id, type (topup/account), product_id,
quantity, unit_price, total_price, discount_applied,
cashback_credited, payment_method, payment_status,
order_status, mlbb_uid, mlbb_server, mlbb_username,
coupon_code, notes, created_at, completed_at
```

### Wallet Transactions
```
id, user_id, type (credit/debit), amount, currency,
method, reference_id, status, description, created_at
```

### Diamond Packages
```
id, diamond_amount, base_price_inr, display_price,
is_visible, bonus_diamonds, bonus_label, created_at
```

### Accounts
```
id, rank, server, hero_count, skin_count,
price_inr, screenshots (array), credential_email,
credential_password (encrypted), is_sold,
sold_to_user_id, created_at
```

### Coupons
```
id, code, discount_percent, max_uses, used_count,
min_order_value, expiry_date, applicable_to,
created_by, is_active, created_at
```

### Support Tickets
```
id, user_id, order_id, subject, status,
messages (json array), created_at, resolved_at
```

---

## ⚙️ Tech Stack

| Layer         | Choice                                      |
|---------------|---------------------------------------------|
| Framework     | Next.js 14 (App Router)                     |
| Styling       | Tailwind CSS + shadcn/ui                    |
| Database      | PostgreSQL via Supabase                     |
| ORM           | Prisma                                      |
| Auth          | NextAuth.js v5 + custom JWT                 |
| Email         | Resend (transactional emails)               |
| Payments      | Razorpay + Stripe + NowPayments + PayPal    |
| Currency API  | exchangerate-api.com or frankfurter.app     |
| Geolocation   | ip-api.com (free tier) for region detect    |
| File Upload   | Supabase Storage (account screenshots)      |
| Encryption    | bcrypt (passwords) + AES-256 (credentials) |
| Hosting       | Vercel (frontend + API) + Supabase (DB)     |
| Analytics     | Vercel Analytics or Plausible               |

---

## 🚀 Build Phases

### Phase 1 — MVP (Build First)
- [ ] Next.js project scaffold + Tailwind + folder structure
- [ ] Landing page with hero, trust badges, product CTAs
- [ ] Auth: register, login, email OTP, JWT
- [ ] Diamond top-up page (UID input + package grid)
- [ ] Wallet system (add funds via Manual UPI only)
- [ ] Razorpay direct checkout integration
- [ ] Basic user dashboard (wallet + orders)
- [ ] Order creation + status flow
- [ ] Admin panel basics (order view + UPI approval)
- [ ] Email receipts via Resend

### Phase 2 — Full Launch
- [ ] Account shop with filters + detail pages
- [ ] Stripe + NowPayments + PayPal integration
- [ ] Wallet discount (5%) + cashback (2%) logic
- [ ] Coupon code system
- [ ] Referral system
- [ ] Currency auto-detection + conversion
- [ ] Full admin panel (inventory, coupons, users)
- [ ] Support ticket system

### Phase 3 — Growth
- [ ] Google OAuth
- [ ] Mobile bottom tab bar
- [ ] Push notifications (order updates)
- [ ] Loyalty points system
- [ ] Seasonal discount events
- [ ] Review / testimonial system
- [ ] SEO optimization

---

## 📌 Strict Rules for AI (Read Every Session)
1. This site sells ONLY MLBB products. Never add other games.
2. No blog page, no games dropdown, no unrelated navigation.
3. Navigation: Home, Top Up, Accounts, Wallet, Login — that's it.
4. Dark theme always. Gold (#ffd700) accents always.
5. Mobile-first always. Test all layouts at 375px width.
6. All prices in INR (₹) by default, convert for foreign users.
7. Wallet checkout = 5% off. Always show this incentive.
8. Never store plain-text passwords or account credentials.
9. All payment webhooks must verify signatures before processing.
10. Keep UI minimal and fast. No unnecessary animations or bloat.
11. Every page must have proper loading states and error states.
12. Admin routes must be protected by role check middleware.
```

---

Paste the entire block above as your `GEMINI.md` in the root of your project folder. Then start your first Gemini CLI session with:
```
Read GEMINI.md fully before doing anything.
Scaffold a Next.js 14 app router project with Tailwind CSS and
Prisma. Set up the folder structure, install all dependencies
listed in the tech stack, and initialize the Prisma schema with
all tables from the Database Schema section. Do not start any
UI yet, just the foundation.