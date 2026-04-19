# Specification - Fix Admin Login Redirection and Secret Error

## Problem Statement
1. **Redirection Issue:** The `/admin-login` page uses NextAuth's `signIn("admin-credentials", ...)` but for some reason, the user ends up at the reseller login page. This could be due to middleware or NextAuth configuration.
2. **Missing Secret:** `lib/adminAuth.ts` uses `process.env.ADMIN_JWT_SECRET!` which is likely undefined, causing `jwt.sign` to fail.

## Proposed Solution
1. **Fix Secret:** Ensure `ADMIN_JWT_SECRET` is defined in `.env`. If not, provide a fallback or instruct the user to add it.
2. **Fix Redirection:** 
    - Investigate `auth.ts` to see how `admin-credentials` is handled.
    - Check `middleware.ts` for any logic that redirects non-resellers or admins incorrectly.
    - Verify `AdminLoginPage`'s use of `signIn`.

## Success Criteria
- Admin can login via `/admin-login` and be correctly redirected to `/admin`.
- No `secretOrPrivateKey` error in logs.
