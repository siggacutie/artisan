# Implementation Plan — Prompt3 Implementation (Updated)

## Phase 1: Games Page (FIX 1)
- [ ] Modify `app/(main)/games/page.tsx` for mobile alignment and overflow.
- [ ] Verify badges have `whitespace-nowrap` and row uses `flex-wrap gap-3`.

## Phase 2: Dashboard API (FIX 2 - Part 1)
- [ ] Update `app/api/dashboard/summary/route.ts` to return `totalSpent`.
- [ ] Ensure `totalSpent` is calculated correctly from PAID orders.

## Phase 3: Dashboard UI (FIX 2 - Part 2)
- [ ] Update `app/(main)/dashboard/wallet/page.tsx` fetch call with credentials and cache options.
- [ ] Implement loading and error states.
- [ ] Format balances as "coins" using the 1.5 divisor.
- [ ] Style ADD FUNDS button and fix horizontal overflow issues.

## Phase 4: Verification & Instructions
- [ ] Verify all changes against the checklist in `prompt3.md`.
- [ ] Generate CRON job setup instructions.
