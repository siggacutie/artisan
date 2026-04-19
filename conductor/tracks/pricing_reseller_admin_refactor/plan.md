# Implementation Plan: Pricing, Reseller, and Admin Refactor

Comprehensive implementation based on `@prompt3.md`.

## Section 1: Currency Conversion System
- [x] Create `lib/pricing.ts` with `BRL_PRICES`, `rateCache`, `fetchBrlToInr`, `getConversionRate`, `calculatePrices`, and `getPackagesWithPrices`.
- [x] Ensure `Math.ceil` is used for all INR prices to avoid decimals.

## Section 2: Database Schema Updates
- [x] Add `PricingConfig` model to `prisma/schema.prisma`.
- [x] Add `isReseller` field to `User` model in `prisma/schema.prisma`.
- [x] Run `npx prisma db push`.
- [x] Create and run `scripts/seedPricing.ts`.

## Section 3: Packages API Route
- [x] Create `app/api/packages/route.ts` to fetch dynamic prices and reseller status.

## Section 4: Order Creation Update
- [x] Refactor `app/api/orders/create/route.ts` to use dynamic pricing from `getPackagesWithPrices`.
- [x] Ensure server-side price calculation and reseller status verification.

## Section 5: Reseller Navbar UI
- [x] Update `components/layout/Navbar.tsx` with "RESELLER" dropdown.
- [x] Create `components/reseller/ResellerDropdownContent.tsx` with dynamic reseller prices and WhatsApp CTA.

## Section 6: Topup Page Refactor
- [x] Update `app/(main)/games/[game-slug]/topup/page.tsx` to fetch dynamic prices from `/api/packages`.
- [x] Implement reseller badge and loading skeletons.
- [x] Add "Double Diamonds" tooltip with info icon.

## Section 7: Geo-Restriction
- [x] Create `app/api/geo/route.ts` for IP-based country detection.
- [x] Add geo-check and block overlay to `app/(main)/games/[game-slug]/topup/page.tsx`.

## Section 8: Admin Panel Backend
- [x] Create `/api/admin/users` (GET, PATCH).
- [x] Create `/api/admin/orders` (GET, PATCH).
- [x] Create `/api/admin/analytics` (GET).
- [x] Create `/api/admin/pricing` (GET, PATCH).
- [x] Create `/api/admin/banners` (GET, POST, PATCH, DELETE).

## Section 9: Admin Panel UI Updates
- [x] Connect User Management, Order Management, and Analytics to real APIs.
- [x] Create `app/(main)/admin/pricing/page.tsx` with live preview and markup configuration.
- [x] Update `app/(main)/admin/banners/page.tsx` to use new API.

## Section 10: Security and Hardening
- [x] Rate limit `/api/packages`.
- [x] Log pricing changes and admin actions using `securityLog`.
- [x] Implement admin self-protection (cannot ban/demote self).
- [x] Implement IP caching for geo-check.
- [x] Add "Pricing" to Admin Sidebar.

## Section 11: Validation and Finalization
- [x] Run full build and verify all 20 verification steps in `@prompt3.md`.
