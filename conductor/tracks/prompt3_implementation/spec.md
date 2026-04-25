# Specification — Prompt3 Implementation (Full)

Implement the three major bug fixes and Discord webhook routing as defined in `prompt3.md`.

## Goals
1. **Full mobile responsiveness overhaul**: Fix navbar, dashboard, and all pages for mobile (375px-768px).
2. **Session stability fix**: Prevent false session termination due to IP changes by switching to User-Agent-only validation and normalizing User-Agents.
3. **Discord webhook routing**: Map all notifications to their correct webhooks (GENERAL, ERRORS, SIGNUP, ORDERS, PAYMENTS) using a centralized helper.

## Technical Requirements
- Next.js 16.2.2 App Router.
- Tailwind CSS 4.0.
- Custom Auth (lib/resellerAuth.ts).
- Mobile-first approach (375px+).
- No `<form>` tags.
- No emojis in UI (Lucide icons only).
- bg #050810, card #0d1120, gold #ffd700.

## Detailed Changes

### BUG 1 — Mobile Responsiveness
- **Navbar**: Hide center links/reseller text on mobile. Show hamburger menu opening a slide-in drawer.
- **MobileBottomNav**: Create `components/layout/MobileBottomNav.tsx` visible only on mobile.
- **Dashboard**: Sidebar becomes horizontal scrollable tab bar on mobile.
- **General Layout**: Responsive padding, stacking cards, flex-direction column on mobile.

### BUG 2 — Session Stability
- **lib/resellerAuth.ts**: Remove IP check in `getResellerSession`. Implement `normalizeUserAgent`. Use only UA for session invalidation.
- **app/api/reseller/auth/login/route.ts**: Only notify Discord if IP actually changed.

### BUG 3 — Discord Webhook Routing
- **lib/discord.ts**: Create centralized `sendDiscord` helper.
- **API Routes**: Update all routes to use the helper with correct webhook mapping.
