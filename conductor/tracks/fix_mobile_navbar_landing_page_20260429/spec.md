# Specification: Fix Mobile Navbar on Landing Page

## Problem
On the landing page (`/`), mobile users see both the top `Navbar` and the `MobileBottomNav`.
1. The `MobileBottomNav` contains links to protected areas (`/games`, `/wallet`, `/dashboard`) which are irrelevant for unauthenticated guests on the landing page.
2. The top `Navbar` (fixed) takes up vertical space on the landing page, which should be a clean hero-focused experience on mobile.
3. The redundancy of two navigation bars on a mobile landing page is poor UX.

## Proposed Solution
1. **Hide `MobileBottomNav` for Guests**: Update the `MobileBottomNav` component to only render if a user is authenticated.
2. **Hide Top `Navbar` on Mobile Landing Page**: Update the `Navbar` component to return `null` when on the landing page (`/`) and in mobile view, OR update the layout to handle this condition.
3. **Adjust Layout Padding**: Ensure the `pt-[72px]` in `MainLayout` is removed when the navbar is hidden to prevent a gap at the top.

## Acceptance Criteria
- [ ] Mobile users on the landing page (`/`) do not see the top `Navbar`.
- [ ] Mobile users on the landing page (`/`) do not see the `MobileBottomNav`.
- [ ] Authenticated mobile users on internal pages (`/games`, etc.) still see both (or as intended).
- [ ] No large gap exists at the top of the landing page on mobile.
