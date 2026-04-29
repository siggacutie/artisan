# Specification: Fix Puppeteer Credentials and Order History Details

## Problem
The integration between the website and the Puppeteer automation bot has several issues:
1. **Credentials Missing**: The bot is not receiving `user_id` and `zone_id` correctly.
   - Root Cause A: `app/api/bot/pending-orders/route.ts` tries to find `DiamondPackage` using `order.productId` (which stores the supplier ID) instead of the actual `id`.
   - Root Cause B: `playerInputs` keys are camelCase (`playerId`, `zoneId`) while the bot expects snake_case (`user_id`, `zone_id`).
2. **Missing History Details**: The dashboard order history lacks the package name and full order ID.
   - Root Cause: `app/api/dashboard/orders/route.ts` does not select the `notes` field.
   - Bug: `bot/order-result/route.ts` overwrites the `notes` field, causing the package label to be lost.
3. **Failed Order Clutter**: Failed/Refunded orders stay in history indefinitely.
   - Requirement: Hide orders with `FAILED` or `REFUNDED` status if they are older than 6 hours.

## Proposed Solution
1. **Fix Bot API**:
   - Update `app/api/bot/pending-orders/route.ts` to correctly handle `supplierProductId` lookup.
   - Map `playerInputs` to include `user_id` and `zone_id` for the bot.
2. **Fix Order Creation/Update**:
   - Ensure `notes` field is handled carefully so package label is preserved or use another field for bot status.
3. **Improve History API**:
   - Update `app/api/dashboard/orders/route.ts` to select `notes`.
   - Implement filtering logic to hide `FAILED`/`REFUNDED` orders older than 6 hours.
4. **Update Dashboard UI**:
   - Display package label (from `notes`) in the order list.
   - Make the full Order ID visible/copyable.

## Acceptance Criteria
- [ ] Bot receives `user_id`, `zone_id`, and `supplierProductId` correctly.
- [ ] Order history shows package name (e.g., "5 Diamonds").
- [ ] Failed/Refunded orders older than 6 hours are hidden from the dashboard.
- [ ] Package label is preserved in `notes` even after bot updates the order.
