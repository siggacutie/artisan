# Specification: Google-only Authentication

## Goal
Implement a secure, Google-only authentication system for Artisan.gg. This system will replace any existing or planned email/password authentication to simplify the user experience and enhance security.

## Requirements
- Google OAuth 2.0 via NextAuth.js (Auth.js v5).
- Database persistence using Prisma and Supabase (PostgreSQL).
- Discord webhook notification for new user signups.
- Custom login and register pages with a premium dark-themed gaming aesthetic.
- Session-protected navbar with user profile and sign-out functionality.
- No email/password or OTP fields.

## Tech Stack
- NextAuth.js v5 (@beta)
- Prisma Client & Adapter
- Google Cloud Console (OAuth Credentials)
- Discord (Webhooks)
- Tailwind CSS (Lucide Icons)
