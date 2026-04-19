# Implementation Plan: Fix Homepage Layout and Components

## Phase 1: Restore Layout Integrity
1. Update `app/(main)/layout.tsx`:
   - Import `Navbar` from `@/components/layout/Navbar`.
   - Set the main wrapper to `w-full min-h-screen bg-[#050810]`.
   - Render `<Navbar />` at the top, above `<main>`.
   - Ensure `Navbar` is imported correctly based on its export type (named vs default).

## Phase 2: Restore Banner Carousel
1. Update `app/(main)/page.tsx`:
   - Import `PromoBanner` from `@/components/shared/PromoBanner`.
   - Remove or replace the current "HERO / BANNER" section with `<PromoBanner />`.
   - Ensure `<PromoBanner />` is at the very top of the page content.

## Phase 3: Verification
1. Run `npm run dev`.
2. Confirm Navbar appears with correct elements.
3. Confirm Banner Carousel is visible at the top.
4. Confirm Full-width layout with background color `#050810`.
5. Confirm other sections (Search, Shop by Game, How It Works, Trust Bar) are present.
