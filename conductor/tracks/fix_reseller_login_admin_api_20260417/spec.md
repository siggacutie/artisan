# Specification - Fix Reseller Login and Complete Admin User API

## Problem Statement
1. **Login Issue:** Admins create resellers via the admin panel. The API sets `role: "RESELLER"` but not `isReseller: true`. NextAuth's `signIn` callback rejects users where `isReseller` is `false`.
2. **Incomplete API:** The admin user management page calls several actions (`freeze`, `unfreeze`, `ban`, `unban`, `makeAdmin`, `removeAdmin`, `delete`, `resetSession`, `clearSuspicious`, `addNote`) that are either missing or named differently in `app/api/admin/users/route.ts`.

## Proposed Solution
1. **Sync `isReseller`:** Update `app/api/admin/users/route.ts` to set `isReseller: true` whenever a user is created as a `RESELLER` or promoted to one.
2. **Complete Admin API:** Implement all missing actions in `app/api/admin/users/route.ts` to match the frontend expectations.
3. **Database Migration/Fix:** Run a script or a temporary endpoint to fix existing resellers who have `isReseller: false`.

## Success Criteria
- Existing resellers with `role: "RESELLER"` can log in.
- Newly created resellers can log in.
- All actions in the admin user management panel work correctly.
