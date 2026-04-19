# Specification: Membership System and UI Refinement

## Part 1 — DATABASE SCHEMA UPDATES + SEED + API FIXES

### 1. Prisma Schema Updates
- **InviteLink Model:** Add `membershipMonths` field.
- **User Model:** Add `membershipExpiresAt` and `membershipMonths` fields.
- **MembershipPayment Model:** Create a new model to track membership payments.
- Run `npx prisma generate` and `npx prisma db push`.

### 2. Update Seed File
- Replace `prisma/seed.ts` with a new version that includes MLBB packages, Smilecoin config, and pricing config.
- Run `npx prisma db seed`.

### 3. API Fixes
- **`/api/packages`:** Update to use `SMILECOIN_COSTS` and `DISPLAY_NAMES` for price calculation.
- **`/api/admin/invite/create`:** Update to handle `membershipMonths`.
- **`/api/admin/users/[id]`:** Update PATCH to handle manual reseller grants with duration.
- **`/api/admin/users`:** Update GET to handle pagination and searching.

### 4. Auth and Middleware
- **`auth.ts`:** Enforce membership expiry and wallet lock. Include membership data in the session.
- **`middleware.ts`:** Add membership expiry protection for reseller routes.

### 5. New Pages
- **`/membership`:** Status and renewal page for resellers.
- **`/banned`:** Account suspension notice page.

## Part 2 — UI FIXES: ADMIN PANEL + LANDING PAGE + TOPUP PAGE + NAVBAR

### 1. Admin UI Updates
- **Admin Invites Page (`/admin/invites`):** Redesign with duration selector and list of recent links.
- **Admin Users Page (`/admin/users`):** Fix user fetch, add duration selector for reseller grant, and show membership status.

### 2. Public and Reseller UI Updates
- **Landing Page (`/`):** Update to show pricing table for unauthenticated users.
- **Top-Up Page (`/games/[game-slug]/topup`):** Change to wallet-only payments.
- **Navbar:** Add a Reseller dropdown with current prices.
- **Dashboard:** Add a Membership tab.
