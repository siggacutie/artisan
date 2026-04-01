# Initial Concept

You are building "Artisan" — a dark-themed, mobile-first web store exclusively for Mobile Legends: Bang Bang. No other games. No blog. The site sells two things only: 1. Diamond Top-Ups (user enters UID, picks a package, pays) 2. Pre-built MLBB Accounts (browse, filter, buy, get credentials) Primary users are Indian (INR default, Razorpay priority) but the site must support foreign users too (auto currency detection, Stripe, NowPayments, PayPal). All purchases go through a Wallet system. Users can also checkout directly. Paying via wallet gives a 5% discount + 2% cashback on orders above ₹500. Show savings in rupees, not percentages. Payment methods: Razorpay, Stripe, NowPayments, PayPal, Manual UPI, Manual Crypto. Webhooks required for all automated methods. Tech stack: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, PostgreSQL via Supabase, Prisma ORM, NextAuth.js, Resend for email. Design: Dark navy/black background, gold (#ffd700) accents, Rajdhani or Orbitron for headings, Inter for body. Cards, glows, fast and clean. No bloat. Auth: Email + password, OTP verification, JWT in httpOnly cookies, rate limited login, admin role protected routes. Full project details are in GEMINI.md — read it before every session and follow the build phases in order. Start with Phase 1 MVP only.

# Product Definition: Artisan

## Vision & Mission
Artisan is a dark-themed, mobile-first web store exclusively for **Mobile Legends: Bang Bang (MLBB)**. We aim to be the premier destination for MLBB players to purchase Diamond Top-Ups and Pre-built Accounts with a focus on speed, security, and the **unbeatable price** for our loyal customers.

## Target Audience
Artisan caters to a diverse range of MLBB players, with a focus on:
- **Casual Players:** Looking for quick, easy, and affordable small top-up packages.
- **Competitive/Pro Players:** Seeking high-value accounts with specific ranks/skins and bulk diamond packages.
- **Gifting & Resellers:** Users who buy diamonds for others or manage multiple UIDs across different servers.
- **Regional Focus:** Primarily Indian users (INR default, Razorpay priority), while supporting international players via automated currency detection and global payment gateways (Stripe, PayPal, Crypto).

## Core Offerings

### 1. Diamond Top-Ups
- **Denominations:** Standard MLBB ladder (86💎 to 11144💎).
- **Verification:** **Real-time API Verification** of UID + Server to display the in-game username before payment, ensuring zero delivery errors.
- **Delivery:** Instant or within 5 minutes of payment confirmation.

### 2. Pre-built Account Shop
- **Browse & Filter:** Advanced filtering by Rank, Server, Hero Count, Skin Count, and Price.
- **On-Demand Requests:** An **Account Request Form** for users seeking specific skins or ranks not currently in stock.
- **Alerts:** **Personalized Price Alerts** to notify users when an account matching their criteria is listed or drops in price.
- **Secure Handoff:** Encrypted credential delivery via the user dashboard and email.

## Value Proposition
- **Unbeatable Price:** Our "hook" is the best market rate in INR.
- **Wallet Incentive:** A 5% instant discount and 2% cashback on orders above ₹500 when paying via the Artisan Wallet.
- **Trust & Speed:** Lightning-fast fulfillment backed by automated webhooks and a clean, gaming-inspired UI.

## Tech Stack Overview
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Backend/DB:** PostgreSQL via Supabase, Prisma ORM, NextAuth.js.
- **Infrastructure:** Resend for transactional emails, Vercel for hosting.
- **Payments:** Multi-gateway support including Razorpay, Stripe, NowPayments, and PayPal.
