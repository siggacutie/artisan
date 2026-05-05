# Implementation Plan: Old User Discount Popup and Tracker

## Phase 1: Database & API Foundation
- [ ] Add `hasSeenOldUserPopup` and `tosAcceptedAt` to `User` model in `prisma/schema.prisma`.
- [ ] Update `lib/resellerAuth.ts` to include these fields and `createdAt` in the session object.
- [ ] Create API route `app/api/reseller/tos-acknowledge/route.ts` to update these fields.
- [ ] Update `app/api/bot/order-result/route.ts` to increment `user.ordersCount` on successful delivery.

## Phase 2: UI Components
- [ ] Create `components/shared/OldUserDiscountPopup.tsx`.
- [ ] Create `components/shared/DiscountTracker.tsx`.
- [ ] Integrate `OldUserDiscountPopup` into `app/(main)/layout.tsx`.
- [ ] Integrate `DiscountTracker` into `app/(main)/games/page.tsx`.

## Phase 3: Testing & Validation
- [ ] Verify that new users (created >= 2026-05-05) don't see the popup.
- [ ] Verify that old users see the popup until acknowledged.
- [ ] Verify that the tracker correctly reflects `3 - ordersCount`.
- [ ] Verify that failed/refunded orders don't decrement the remaining count.
- [ ] Verify that successful bot deliveries increment the `ordersCount`.
