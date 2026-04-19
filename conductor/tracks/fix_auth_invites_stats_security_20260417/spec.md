# Specification - Fix Reseller Auth, Invitation System, Real Admin Stats & Security Audit

## Problem Statement
1. **Auth:** `existingUser.isReseller` check in `auth.ts` might be too strict if `isReseller` is false but `role` is `RESELLER`.
2. **Invites:** `signIn` callback in `auth.ts` doesn't use the specific token from the cookie, allowing any "in-progress" invite to be used. Also, `isUsed` might not be correctly set.
3. **Stats:** `AdminDashboard` components use hardcoded data.
4. **Security:** Known vulnerabilities in price manipulation and rate limiting need constant monitoring, and new ones need to be identified.

## Proposed Solution
1. **Auth Fix:** Update `auth.ts` to allow login if `role === 'RESELLER' || isReseller === true`.
2. **Invite Fix:** Use `cookies()` in `auth.ts` to get the `pending_invite` token and specifically mark *that* token as used.
3. **Stats Fix:** Update `AdminDashboard` to fetch from `/api/admin/analytics`. Enhance the API to provide all required metrics.
4. **Security:** Implement server-side checks for all sensitive operations.

## Success Criteria
- Resellers can log in.
- Invite links are one-time use and tracked correctly.
- Admin dashboard shows real-time data from the DB.
- No critical vulnerabilities found in the audit.
