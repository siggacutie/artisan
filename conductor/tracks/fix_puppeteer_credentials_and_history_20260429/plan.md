# Implementation Plan: Fix Puppeteer Credentials and Order History Details

## Tasks

### Phase 1: Bot API Fixes
- [ ] **Fix `pending-orders` API**:
  - Update `app/api/bot/pending-orders/route.ts` to query `DiamondPackage` by `supplierProductId`.
  - Map `playerInputs.playerId` to `user_id` and `playerInputs.zoneId` to `zone_id`.
- [ ] **Preserve Package Label**:
  - Update `app/api/bot/order-result/route.ts` to *append* to `notes` instead of overwriting, or store bot notes separately.

### Phase 2: Dashboard History Improvements
- [ ] **Update `dashboard/orders` API**:
  - Select `notes` in `prisma.order.findMany`.
  - Add logic to filter out `FAILED` or `REFUNDED` orders if `createdAt` is more than 6 hours ago.
- [ ] **Enhance Orders Page UI**:
  - Modify `app/(main)/dashboard/orders/page.tsx` to display `order.notes` (which contains the package label).
  - Show the full `order.id` (maybe with a copy button).

### Phase 3: Verification
- [ ] **Mock Bot Test**: Call `/api/bot/pending-orders` with `x-bot-secret` and verify JSON structure.
- [ ] **UI Verification**: Check dashboard with various order statuses and ages.
