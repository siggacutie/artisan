# Implementation Plan: Landing Page INR Pricing

## Phase 1: Research & Verification
- [x] Verify that `app/api/packages/route.ts` returns `resellerPrice` in INR.
- [x] Identify the exact lines in `app/(main)/page.tsx` that perform the coin conversion.

## Phase 2: Implementation
- [x] Update `app/(main)/page.tsx` to remove the `/ 1.5` division.
- [x] Prefix the price with the Rupee symbol (₹) or append "INR".
- [x] Ensure the formatting (rounding) is consistent.

## Phase 3: Validation
- [x] Check the landing page visually (mocking or running).
- [x] Verify that the Reseller Dropdown still shows "coins".
- [x] Verify that the Top-up page still shows "coins".
