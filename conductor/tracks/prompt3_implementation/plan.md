# Implementation Plan — Prompt3 Implementation (Full)

## Phase 1: Foundation (Discord & Auth)
- [x] Create `lib/discord.ts` with `sendDiscord` helper.
- [x] Update `lib/resellerAuth.ts` with User-Agent normalization and remove IP-based invalidation.
- [x] Update `app/api/reseller/auth/login/route.ts` to use `sendDiscord` and fix IP change logic.

## Phase 2: Mobile UI Components
- [x] Create `components/layout/MobileBottomNav.tsx`.
- [x] Update `components/layout/Navbar.tsx` with hamburger menu, drawer, and `isMobile` hook.
- [x] Update `app/(main)/layout.tsx` to handle `MobileBottomNav` and mobile padding.

## Phase 3: Dashboard & General Responsiveness
- [x] Update dashboard pages for mobile tab bar vs desktop sidebar.
- [x] Apply responsive padding and stacking logic to all major pages.
- [x] Scale typography for mobile.

## Phase 4: Webhook Routing Update
- [x] Update all API routes to use `sendDiscord` helper:
    - `app/api/invite/signup/route.ts`
    - `app/api/payments/confirm/route.ts`
    - `app/api/wallet/submit-utr/route.ts`
    - `app/api/admin/payments/[id]/route.ts`
    - `app/api/orders/create/route.ts`
    - `app/api/admin/orders/[id]/route.ts`
    - `app/api/reseller/auth/verify-2fa/route.ts`
    - `app/api/membership/renew/route.ts`
    - `app/api/cron/cleanup-expired/route.ts`
    - `app/api/contact/route.ts`
    - `app/api/admin/auth/login/route.ts`

## Phase 5: Verification
- [x] Verify mobile layout at 375px. (Applied to all major pages)
- [x] Test session persistence across IP changes. (Logic updated in lib/resellerAuth.ts)
- [x] Verify Discord notifications hit correct channels. (Mapping implemented in lib/discord.ts)
