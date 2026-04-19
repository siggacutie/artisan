# Plan: Homepage Redesign (Banner, Coming Soon, Search Pills)

## Overview
Rebuild the homepage banner carousel, cleanup inactive game cards, and update search pills to reflect the project's focus (MLBB).

## Tasks

### 1. Rebuild Banner Carousel
- File: `components/shared/PromoBanner.tsx`
- Strategy: Replace existing `PromoBanner` implementation with a full-width carousel matching the new spec.
- Steps:
  - Define new `banners` data array with the 3 slides.
  - Implement full-width container (420px/260px).
  - Implement left side content (Label, Heading, Subtext, CTA).
  - Implement right side decorative text with opacity.
  - Implement auto-advance logic (4s) and dot indicators.
  - Apply CSS transitions for slide effect.

### 2. Cleanup Inactive Game Cards
- File: `app/(main)/page.tsx`
- Strategy: Modify the `games.map` loop's inactive state rendering.
- Steps:
  - Update the inactive card UI to show only the `Gamepad2` icon and "Coming Soon" text.
  - Remove game name and category from inactive cards.
  - Ensure background and border match spec (#0d1120, gold border opacity).

### 3. Update Popular Search Pills
- File: `app/(main)/page.tsx`
- Strategy: Update the hardcoded list of popular tags.
- Steps:
  - Replace the tags array with `["MLBB Diamonds", "MLBB Accounts"]`.

### 4. Verification
- Verify banner height and styling on desktop/mobile.
- Verify banner auto-advance and dot indicators.
- Verify inactive cards UI.
- Verify search pills.
- Run build/lint check.
