# Implementation Plan: Security Audit and Hardening

## Phase 1: Research & Discovery
1. [ ] Audit `lib/resellerAuth.ts` and `lib/adminAuth.ts` for session security (A3, A4, A5, A6).
2. [ ] Audit `lib/validateOrigin.ts` (C15).
3. [ ] Audit `middleware.ts` (K44, K45).
4. [ ] Audit `next.config.ts` (G36, G37).
5. [ ] List all API routes and categorize them (Public vs Private).
6. [ ] Search for all raw SQL queries (`$queryRaw`, `$executeRaw`) (F33).
7. [ ] Audit environment variables (H40).

## Phase 2: Systematic API Route Audit
1. [ ] Audit `app/api/reseller/**` for auth, validation, CSRF, and rate limiting.
2. [ ] Audit `app/api/admin/**` for admin auth, validation, and CSRF.
3. [ ] Audit `app/api/wallet/**` for balance integrity, UTR validation, and idempotency.
4. [ ] Audit `app/api/payments/confirm` for webhook security.
5. [ ] Audit `app/api/invite/**` for signup security.
6. [ ] Audit `app/api/dashboard/avatar` for file upload security.

## Phase 3: Business Logic & Injection Hardening
1. [ ] Ensure all wallet deductions use `gte` balance check (E25).
2. [ ] Ensure atomic transactions for order creation (E29).
3. [ ] Protect SuperAdmin account from admin actions (E30).
4. [ ] Verify tagged template literals for all raw SQL (F33).

## Phase 4: Final Validation
1. [ ] Run lint and type checks.
2. [ ] Verify no sensitive data exposure in API responses.
3. [ ] Verify error handling prevents stack trace leaks.
