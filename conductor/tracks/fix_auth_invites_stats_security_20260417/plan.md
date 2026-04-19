# Implementation Plan - Fix Reseller Auth, Invitation System, Real Admin Stats & Security Audit

## Phase 1: Authentication & Invites
- [ ] Update `auth.ts` `signIn` callback to use `cookies()` for invite validation.
- [ ] Fix the "infinite use" bug by specifically targeting the token from the cookie.
- [ ] Ensure `isReseller` flag and `RESELLER` role are synced and allowed.

## Phase 2: Admin Stats
- [ ] Enhance `/api/admin/analytics` to include:
    - Today's Revenue
    - Total Orders
    - Pending Approvals
    - Active Users (online recently)
    - Total Revenue All Time
- [ ] Update `AdminDashboard` (`app/(admin)/admin/page.tsx`) to fetch and display this data.

## Phase 3: Security & Audit
- [ ] Audit API routes for missing auth or validation.
- [ ] Patch identified issues.
- [ ] Update `vulnerabilities.md`.

## Phase 4: Verification
- [ ] Test full reseller registration and login flow.
- [ ] Verify admin dashboard correctness.
