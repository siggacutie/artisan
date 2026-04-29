# Specification: Fix Bot Credentials Mapping and Order UI Titles

## Problem
1. **Bot Credentials**: The Puppeteer bot is failing to enter `user_id` and `zone_id`. Even though they are mapped at the root of the JSON response, the bot might be looking inside `playerInputs` or expecting different keys.
2. **UI Titles**: The "orders tab" (both dashboard and admin) shows "messed up" titles. This is likely due to how the `notes` field (which stores the package label and bot status) is being parsed and displayed.

## Proposed Solution
1. **Bot API Hardening**:
   - Update `app/api/bot/pending-orders/route.ts` to include `user_id` and `zone_id` both at the root AND inside `playerInputs` (mapping existing keys).
   - Ensure all ID values are sent as strings.
2. **UI Robustness**:
   - Update `app/(main)/dashboard/orders/page.tsx` to more reliably extract the package name from `notes`. If `notes` contains "Bot error" but no separator, use a better fallback.
   - Update `app/(admin)/admin/orders/page.tsx` to similarly clean up the package display.
3. **Data Integrity**:
   - Verify `order/create` always sets a valid `notes` field.

## Acceptance Criteria
- [ ] Puppeteer bot receives `user_id` and `zone_id` in multiple locations in the JSON.
- [ ] Dashboard order titles show the package name (e.g., "78 + 8 Diamonds") even if the order failed.
- [ ] Admin order panel shows the package name clearly, separating it from bot status messages.
