# Implementation Plan: Prompt 3 Mobile UI Fixes

## Phase 1: Global Fixes
- [ ] Update `app/globals.css`.
- [ ] Verify `isMobile` hook presence in key pages.

## Phase 2: Navbar Fixes
- [ ] Modify `components/layout/Navbar.tsx` for mobile clean look and dropdown closure on route change.

## Phase 3: Page Specific Fixes
- [ ] Fix `app/(main)/games/page.tsx` (Loyalty banner, padding).
- [ ] Fix `app/(main)/games/[game-slug]/topup/page.tsx` (Container, cards, inputs).
- [ ] Fix `app/(main)/dashboard/profile/page.tsx` (Avatar, form, toggle).

## Phase 4: Validation
- [ ] Verify mobile layouts on 375px width.
- [ ] Ensure no desktop regressions.
