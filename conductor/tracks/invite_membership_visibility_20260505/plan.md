# Implementation Plan: Invite Membership Visibility

## Phase 1: API Update
- [ ] Update `app/api/invite/validate/[token]/route.ts` to return the `tier` field.

## Phase 2: UI Implementation
- [ ] Update `app/invite/[token]/page.tsx` state to include `tier`.
- [ ] Update fetch logic to save the `tier`.
- [ ] Update the UI banner to display the tier name with appropriate styling.

## Phase 3: Validation
- [ ] Verify with a "BASIC" invite link.
- [ ] Verify with a "PREMIUM" invite link.
