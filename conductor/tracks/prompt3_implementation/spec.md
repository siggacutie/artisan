# Specification — Prompt3 Implementation (Updated)

Update the application according to the instructions in `prompt3.md`.

## Goals
1. Fix mobile alignment and spacing on the Games page header.
2. Fix wallet balance loading, horizontal overflow, and "ADD FUNDS" button styling on the Dashboard.
3. Update Dashboard API to return necessary summary data.
4. Provide instructions for setting up the cleanup CRON job.

## Technical Requirements
- Next.js 14+ App Router.
- Tailwind CSS 4.0.
- No `<form>` tags.
- No `framer-motion` (unless existing and necessary, but avoid adding).
- Fixed Color Palette:
  - Background: #050810
  - Card bg: #0d1120
  - Gold: #ffd700
  - Blue: #00c3ff
  - Success: #22c55e
  - Muted text: #64748b

## Changes Needed

### FIX 1: app/(main)/games/page.tsx
- Stats row: `flex-wrap`, `gap-3`, `items-center`.
- Badges ("Instant Delivery", "Secure Payments"): `whitespace-nowrap`.
- "1 GAME AVAILABLE": own block on left.
- Header section horizontal padding: `px-4` on mobile.
- Root wrapper: `overflow-hidden`.

### FIX 2: app/(main)/dashboard/wallet/page.tsx + app/api/dashboard/summary/route.ts
- Fetch `/api/dashboard/summary`: `credentials: 'include'`, `cache: 'no-store'`.
- Loading state: show skeletons or "Loading...".
- Error state: show "Could not load wallet".
- API Route: return `walletBalance`, `membershipExpiresAt`, `totalOrders`, `totalSpent`.
- Balance/Spent display: `Math.floor(x / 1.5) + " coins"`.
- Horizontal overflow fix: `max-w-full overflow-hidden` on root div and cards.
- ADD FUNDS button: solid `#ffd700` background, dark text, no gradient/glow.
- Cards: `w-full max-w-full box-sizing border-box`.

### FIX 3: CRON Instructions
- Output a clear markdown instruction block for manual setup on Ubuntu VPS.
