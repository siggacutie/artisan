# Implementation Plan: Fix Mobile Navbar on Landing Page

## Tasks

### Phase 1: Component Updates
- [ ] **Update `MobileBottomNav`**:
  - Add authentication check (fetch `/api/reseller/auth/me` or similar).
  - Hide component if user is not logged in.
- [ ] **Update `Navbar`**:
  - Add a check for `pathname === '/' && isMobile`.
  - Return `null` if the condition is met.

### Phase 2: Layout Adjustments
- [ ] **Update `MainLayout`**:
  - Conditionally apply `pt-[72px]` based on whether we are on the landing page and on mobile.
  - Since `MainLayout` doesn't have `isMobile` logic easily available as a server component (it's not marked `use client`), I might need to move the padding logic into the pages or use a CSS class that handles it.

### Phase 3: Verification
- [ ] Verify landing page on mobile (simulated) has no top/bottom nav and starts at the top.
- [ ] Verify internal pages on mobile still have the expected navigation.
