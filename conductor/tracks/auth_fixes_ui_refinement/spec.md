# Specification: Auth Fixes and UI Refinement

## Goal
Improve the stability and aesthetics of the authentication system. This includes fixing connection issues with Supabase's PGBouncer, providing a more polished Google-only sign-in/up experience, and adding a functional user dropdown menu to the navbar.

## Requirements
- **Prisma Fix:** Use `DIRECT_URL` for the Prisma client to avoid PGBouncer connection pooling issues in the adapter.
- **Login/Register Redesign:** Centered card layout with Google OAuth branding, clear trust points, and a modern dark aesthetic.
- **Navbar User Menu:** Post-login state showing user avatar, first name, and a dropdown for Dashboard, Orders, Wallet, Profile, and Sign Out.
- **Strict Adherence:** No email/password fields, follow exact JSX/CSS styles provided.
