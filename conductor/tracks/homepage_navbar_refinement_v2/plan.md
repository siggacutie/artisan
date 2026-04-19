# Plan: Homepage and Navbar Refinement

## Overview
Update the banner carousel, navbar games dropdown, and homepage MLBB card to include new visual elements and direct links to WhatsApp. Revamp popular and wallet sections.

## Tasks

### 1. Refine Banner Carousel
- File: `components/shared/PromoBanner.tsx`
- Changes:
  - Height to `320px`.
  - Add light streak div.
  - Add bottom border.
  - Decorative text size to `100px`.
  - Heading border-left and padding-left.
  - Update CTA button styles (Inter 13px bold, hover effects).

### 2. Implement Navbar MLBB Submenu
- File: `components/layout/Navbar.tsx`
- Changes:
  - Add state for submenu visibility (`isMlbbSubmenuOpen`).
  - Update MLBB link item to toggle submenu instead of navigating.
  - Implement submenu with "Top Up Diamonds" and "Buy Account" (WhatsApp) options.
  - Apply specified styles (background, border, hover, typography).

### 3. Implement Homepage MLBB Card Menu
- File: `app/(main)/page.tsx`
- Changes:
  - Add state/logic to handle MLBB card interaction.
  - Use `DropdownMenu` or a simple absolute popover to show options.
  - Update "Accounts" to point to WhatsApp.
  - Update labels and icons.

### 4. Revamp Sections
- File: `app/(main)/page.tsx`
- Changes:
  - Update "Popular" search pills styling.
  - Update "How it works" or "Wallet" sections for a more distinctive look.

### 5. Verification
- Verify banner height and styling.
- Verify navbar dropdown submenu on desktop/mobile.
- Verify homepage MLBB card popover.
- Ensure no regressions on other games/links.
