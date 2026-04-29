# Implementation Plan: Fix Bot Credentials Mapping and Order UI Titles

## Tasks

### Phase 1: Bot API Hardening
- [ ] **Enhance `pending-orders` response**:
  - Modify `app/api/bot/pending-orders/route.ts` to inject `user_id` and `zone_id` into the `playerInputs` object in the response.
  - Ensure root-level `user_id` and `zone_id` are strings.

### Phase 2: UI Enhancements
- [ ] **Improve Dashboard Order Display**:
  - Update `app/(main)/dashboard/orders/page.tsx` with better splitting logic for `notes`.
  - Handle cases where the package name might be missing or merged with status.
- [ ] **Improve Admin Order Display**:
  - Update `app/(admin)/admin/orders/page.tsx` to show only the package part of `notes` in the main column, and the full notes in a sub-text.

### Phase 3: Validation
- [ ] **API Structure Check**: Verify `/api/bot/pending-orders` returns the expected multi-location mapping.
- [ ] **UI Visual Check**: Ensure titles look clean for both successful and failed orders.
