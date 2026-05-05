# Implementation Plan: Membership Queue & Pricing Update

## Phase 1: Pricing Update
- [ ] Update `MEMBERSHIP_PLANS` in `app/(main)/membership/page.tsx`.
- [ ] Update `MEMBERSHIP_PLANS` in `app/api/membership/renew/route.ts`.

## Phase 2: Database Foundation
- [ ] Add `MembershipItem` model to `prisma/schema.prisma`.
- [ ] Update `User` model to have a relation to `MembershipItem`.
- [ ] Run SQL to create the table and backfill existing memberships.

## Phase 3: Queue Logic Implementation
- [ ] Refactor `app/api/membership/renew/route.ts` to handle sequential scheduling.
- [ ] Implement active tier derivation logic in `lib/resellerAuth.ts`.
- [ ] Ensure `User.tier` and `User.membershipExpiresAt` are synchronized with the queue during session retrieval.

## Phase 4: Validation
- [ ] Test buying Premium while having active Basic (should remain Basic until expiry).
- [ ] Test buying Basic while having active Premium (should remain Premium until expiry).
- [ ] Verify pricing update in UI and checkout.
