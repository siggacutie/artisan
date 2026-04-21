# Implementation Plan — Prompt3 Implementation

## Phase 1: Email OTP Update
- [ ] Update `lib/email.ts` with new Resend SDK implementation and HTML templates.
- [ ] Verify `RESEND_API_KEY` is present in environment variables.

## Phase 2: Avatar Upload Fix
- [ ] Update `app/api/dashboard/avatar/route.ts` with improved validation and magic byte checks.
- [ ] Ensure filename follows `${userId}-${Date.now()}.${ext}` format.
- [ ] Verify Supabase credentials in environment.

## Phase 3: Admin Membership Revocation
- [ ] Modify `app/api/admin/users/[id]/route.ts` to handle `revokeMembership: true`.
- [ ] Update `app/(admin)/admin/users/page.tsx` to include the "Revoke Membership" button and confirmation modal.

## Phase 4: Membership Renewal System
- [ ] Create `app/api/membership/create-order/route.ts` for Razorpay order generation.
- [ ] Create `app/api/membership/verify/route.ts` for payment signature verification and membership extension.
- [ ] Update `app/(main)/membership/page.tsx` to integrate Razorpay renewal flow.

## Phase 5: Verification & Cleanup
- [ ] Test email sending in dev mode.
- [ ] Test avatar upload with various file types and sizes.
- [ ] Test admin membership revocation and verify user access is blocked.
- [ ] Test membership renewal flow (can be tested with Razorpay Test Mode).
- [ ] Ensure all modified files adhere to project coding standards.
