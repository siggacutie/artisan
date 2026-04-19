# Implementation Plan: Security Hardening Pass

## Phase 1: Foundation
- [x] Category 7: Create `lib/securityLog.ts`
- [x] Category 8: Create `lib/validate.ts`
- [x] Category 5: Create `lib/validateOrigin.ts`
- [x] Category 6: Create `lib/rateLimit.ts`
- [x] Category 10: Create `lib/wallet.ts` (atomic debit)

## Phase 2: Core Payment Security
- [x] Category 1: Refactor `app/api/orders/create/route.ts` (registry, price source of truth)
- [x] Category 1: Update topup page frontend
- [x] Category 2: Hardening `app/api/orders/verify/route.ts`
- [x] Category 3: Create `app/api/webhooks/razorpay/route.ts`
- [x] Category 4: Idempotency in `app/api/orders/create/route.ts` and frontend

## Phase 3: Route & Upload Protection
- [x] Category 5: Apply CSRF protection to state-changing POST routes
- [x] Category 6: Apply Rate Limiting to sensitive routes
- [x] Category 8: Apply Input Validation to routes
- [x] Category 9: Hardening `app/api/dashboard/avatar/route.ts` (magic bytes)
- [x] Category 11: Ensure Auth on all relevant API routes

## Phase 4: Admin & Session Security
- [x] Category 12: Admin layout and Middleware protection
- [x] Category 13: NextAuth session hardening in `auth.ts`
- [x] Category 14: Security headers in `next.config.ts`
- [x] Category 15: Timeout for verify-player

## Phase 5: Audit & Cleanup
- [x] Category 16: Environment Variable Audit
- [x] Category 17: Database Schema (isBanned)
- [x] Category 18: Final Cleanup (logs, secrets, TODOs)
