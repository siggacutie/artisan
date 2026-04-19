# Track Specification: NextAuth and Navbar Logo Fixes

## Overview
This track addresses two specific issues:
1.  **NextAuth API Route Fix:** Resolves the "Unexpected token '<', <!DOCTYPE is not valid JSON" error by ensuring the NextAuth API route and its dependencies (`auth.ts`, `lib/prisma.ts`) are correctly configured to return JSON instead of an HTML error page.
2.  **Navbar Logo Restoration:** Updates the logo in `components/layout/Navbar.tsx` to match the brand's specific design: "ARTISANstore" in white/gold Orbitron on one line and ".xyz" in tiny gray Inter below it.

## Scope
-   `app/api/auth/[...nextauth]/route.ts`: Replace content to correctly export GET/POST handlers from `@/auth`.
-   `auth.ts`: Update to export handlers, auth, signIn, and signOut with specific providers, callbacks, and Prisma adapter configuration.
-   `lib/prisma.ts`: Verify/Update Prisma client initialization.
-   `next.config.ts`: Ensure no conflicting redirects or rewrites.
-   `components/layout/Navbar.tsx`: Update the logo JSX.

## Success Criteria
-   `npm run dev` builds without errors.
-   Homepage displays the correct "ARTISANstore.xyz" logo.
-   Login/Signup buttons trigger the Google OAuth flow correctly.
-   Authentication flow completes without JSON parsing errors.
-   New user signups are correctly logged to the database and Discord via webhook.
