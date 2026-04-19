# Specification: Fix Homepage Layout and Components

## Goal
Restore the navbar and banner carousel to the homepage and fix layout width issues.

## Issues to Address
1. **Navbar missing**:
   - `components/layout/Navbar.tsx` exists but is not rendered in `app/(main)/layout.tsx`.
   - Restore `<Navbar />` to the layout above `{children}`.
2. **Banner carousel missing**:
   - `app/(main)/page.tsx` is missing the `PromoBanner` component.
   - The carousel must be the first section after the navbar, before the search bar.
3. **Layout width broken**:
   - `app/(main)/layout.tsx` main content wrapper must have `w-full min-h-screen bg-[#050810]`.
   - Ensure no accidental `max-w` or `mx-auto` constraint is wrapping the entire layout.

## Constraints
- Do NOT rebuild any component from scratch.
- Do NOT change any colors, fonts, or design.
- Do NOT add any new features.
- Touch ONLY `app/(main)/layout.tsx` and `app/(main)/page.tsx`.
- (Optional but implied) Verify `Navbar.tsx` is a default export, but do not modify if it violates the "Touch ONLY" rule unless strictly necessary for export correctness.
