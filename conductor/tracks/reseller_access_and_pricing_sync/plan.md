# Implementation Plan: Reseller Access and Pricing Sync

## Phase 1: Database & Schema
- [ ] Add `section` to `DiamondPackage` in `prisma/schema.prisma`.
- [ ] Add `durationMonths` to `InviteLink` in `prisma/schema.prisma`.
- [ ] Add `resellerExpiresAt` to `User` in `prisma/schema.prisma`.
- [ ] Run `npx prisma generate` (and `npx prisma db push` if possible, or advise user).

## Phase 2: Pricing & Package Sync
- [ ] Update `lib/pricing.ts` to fetch from DB instead of `PACKAGE_DEFINITIONS`.
- [ ] Implement label generation logic in `lib/pricing.ts`.
- [ ] Update `app/api/admin/packages/route.ts` to support `section`.
- [ ] Update `app/api/packages/route.ts` to ensure clean data delivery.

## Phase 3: Webhook & Access Logic
- [ ] Update `auth.ts` to use `DISCORD_WEBHOOK` for signups.
- [ ] Update `auth.ts` to set `resellerExpiresAt` on user creation.
- [ ] Update `auth.ts` `signIn` callback to block expired resellers.
- [ ] Update `app/api/admin/invite/create/route.ts` to handle `durationMonths`.

## Phase 4: UI Refinement
- [ ] Update `components/reseller/ResellerDropdownContent.tsx` to use correct labels and sections.
- [ ] Update `app/(main)/reseller/page.tsx` to use correct labels.
- [ ] Update Admin invite UI (if exists) or create a simple one.

## Phase 5: Verification & Security
- [ ] Test price updates from admin.
- [ ] Test expiry logic by manually setting an expired date.
- [ ] Verify webhooks are sent to the correct channels.
- [ ] Check for potential IDOR or unauthorized access in new API fields.
