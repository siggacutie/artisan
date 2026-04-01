# Tech Stack: Artisan

## Core Framework
- **Next.js 14 (App Router):** The foundation for our fast, SEO-friendly, and mobile-first web store.
- **TypeScript:** Ensuring type safety across the entire codebase.

## Frontend & Styling
- **Tailwind CSS:** For rapid, utility-first styling consistent with our dark theme.
- **shadcn/ui:** High-quality, accessible UI components (Radix UI + Tailwind).
- **Lucide React:** Consistent and clean iconography.

## Backend & Data
- **PostgreSQL via Supabase:** A scalable, serverless PostgreSQL database.
- **Prisma ORM:** For type-safe database queries and migrations.
- **NextAuth.js v5:** Secure authentication with custom JWTs stored in httpOnly cookies.

## Infrastructure & Services
- **Resend:** Reliability for transactional emails (signups, receipts).
- **Vercel:** Optimized hosting and serverless functions.
- **Supabase Storage:** For hosting account screenshots and user avatars.

## Payments & Integrations
- **Payment Gateways:** Razorpay (India), Stripe (Global), NowPayments (Crypto), and PayPal (Global Fallback).
- **Currency Conversion:** ExchangeRate-API or Frankfurter for real-time INR/Global rates.
- **Geolocation:** ip-api.com for automated region and currency detection.

## Security & Performance
- **bcrypt / AES-256:** Password hashing and encrypted credential storage.
- **Vercel Analytics:** Monitoring performance and conversion rates.
