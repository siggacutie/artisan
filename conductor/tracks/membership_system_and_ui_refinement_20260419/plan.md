# Implementation Plan: Membership System and UI Refinement

## Part 1 — DATABASE SCHEMA UPDATES + SEED + API FIXES

### Task 1 — Update Prisma Schema
- [x] Modify `InviteLink` model in `prisma/schema.prisma`.
- [x] Modify `User` model in `prisma/schema.prisma`.
- [x] Add `MembershipPayment` model in `prisma/schema.prisma`.
- [x] Run `npx prisma generate` and `npx prisma db push`.

### Task 2 — Update Seed File
- [x] Replace `prisma/seed.ts` with the provided code.
- [x] Run `npx prisma db seed`.

### Task 3 — Fix API Routes
- [x] Update `app/api/packages/route.ts`.
- [x] Update `app/api/admin/invite/create/route.ts`.
- [x] Update `app/api/admin/users/[id]/route.ts`.
- [x] Update `app/api/admin/users/route.ts`.

### Task 4 — Auth and Middleware Updates
- [x] Update `auth.ts` to enforce membership expiry and include fields in the session.
- [x] Update `middleware.ts` to protect reseller routes with membership expiry.

### Task 5 — Create New Pages
- [x] Create `app/(main)/membership/page.tsx`.
- [x] Create `app/(main)/banned/page.tsx`.

## Part 2 — UI FIXES: ADMIN PANEL + LANDING PAGE + TOPUP PAGE + NAVBAR

### Task 6 — Update Admin Pages
- [x] Rewrite `app/(admin)/admin/invites/page.tsx`.
- [x] Update `app/(admin)/admin/users/page.tsx`.

### Task 7 — Update Public and Reseller UI
- [x] Update `app/(main)/page.tsx` with pricing table.
- [x] Update `app/(main)/games/[game-slug]/topup/page.tsx` for wallet-only payments.
- [x] Create `components/reseller/ResellerDropdownContent.tsx`.
- [x] Update `components/layout/Navbar.tsx` with Reseller dropdown.
- [x] Update `app/(main)/dashboard/layout.tsx` with Membership tab (check layout).

## Verification
- [x] Confirm Prisma schema.
- [x] Confirm seed completion.
- [x] Verify API responses.
- [x] Verify `/membership` and `/banned` pages.
- [x] Verify top-up flow with wallet.
