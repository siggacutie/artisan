# Implementation Plan — Surgical Fixes 20260419

## Phase 1: API and Backend
- [x] Task 3: Update `app/api/dashboard/summary/route.ts` to include membership and status fields in Prisma select and response.
- [x] Task 2: Create `app/api/cron/cleanup-expired/route.ts` with the provided logic and secret verification.

## Phase 2: Membership Page
- [x] Task 1: Refactor `app/(main)/membership/page.tsx`.
    - Add `paddingTop: '100px'`.
    - Implement fetching from `/api/dashboard/summary`.
    - Implement warning banners and status logic.

## Phase 3: Wallet Page
- [x] Task 4: Refactor `app/(main)/wallet/add/page.tsx`.
    - Remove custom amount logic.
    - Implement 9-button grid with specified styling and grid layout.
    - Update button activation logic.

## Phase 4: UI Pricing Refinement
- [x] Task 5a: Update `components/reseller/ResellerDropdownContent.tsx` to change "₹" to "coins".
- [x] Task 5b: Update `app/(main)/games/[game-slug]/topup/page.tsx` to change "₹" to "coins" in all specified locations and messages.

## Phase 5: Verification
- [x] Verify each task against the requirements.
- [x] Ensure landing page and reseller page remain unchanged.
- [x] Run build and check for errors.
