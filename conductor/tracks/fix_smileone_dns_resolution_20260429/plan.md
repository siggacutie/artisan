# Implementation Plan: Fix Smile.one DNS Resolution and Supplier Config

## Tasks

### Phase 1: URL Updates
- [ ] **Global Replace**: Replace `www.smile.one` with `smile.one` in:
  - `app/api/verify-player/route.ts`
  - `prisma/seed.ts`
  - `GEMINI.md`
  - `app/(main)/games/[game-slug]/page.tsx`
- [ ] **Update `pending-orders` API**:
  - Add `game.supplierBaseUrl` to the selected fields.
  - Ensure the response includes `supplierBaseUrl` at the root or per order.

### Phase 2: Verification
- [ ] Verify that `/api/bot/pending-orders` now includes the `supplierBaseUrl`.
- [ ] Check if `verify-player` still works (mocked or logic check).
