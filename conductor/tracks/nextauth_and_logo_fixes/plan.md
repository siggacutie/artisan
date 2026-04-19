# Implementation Plan: NextAuth and Navbar Logo Fixes

## Phase 1: Authentication Fixes
1.  **Step 1:** Verify `app/api/auth/[...nextauth]/route.ts` path and replace content with `export { GET, POST } from '@/auth'`.
2.  **Step 2:** Update `auth.ts` in the project root with the provided configuration including Google provider, Prisma adapter, JWT session, and custom callbacks for user roles and Discord webhooks.
3.  **Step 3:** Ensure `lib/prisma.ts` correctly initializes the Prisma Client with the appropriate datasources.
4.  **Step 4:** Check `next.config.ts` for any intercepting rules.

## Phase 2: UI Restoration
1.  **Step 5:** Locate the logo element in `components/layout/Navbar.tsx` and replace it with the specified JSX for the "ARTISANstore.xyz" logo.

## Phase 3: Validation
1.  Run `npm run dev` to ensure no build errors.
2.  Manually verify the logo appearance on the homepage.
3.  Verify the authentication flow (simulated if necessary, or by checking the code structure).
