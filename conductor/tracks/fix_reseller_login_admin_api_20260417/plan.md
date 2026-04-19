# Implementation Plan - Fix Reseller Login and Complete Admin User API

## Phase 1: Fix Admin API
- [x] Update `app/api/admin/users/route.ts` to set `isReseller: true` in `create` action.
- [x] Implement missing actions: `freeze`, `unfreeze`, `ban`, `unban`, `makeAdmin`, `removeAdmin`, `delete`, `resetSession`, `clearSuspicious`, `addNote`.
- [x] Ensure `updateRole` also syncs `isReseller`.

## Phase 2: Fix Existing Data
- [x] Create a temporary script or run a one-time update to set `isReseller: true` for all users with `role: "RESELLER"`.

## Phase 3: Verification
- [x] Verify reseller login.
- [x] Verify admin actions in the user management panel.
