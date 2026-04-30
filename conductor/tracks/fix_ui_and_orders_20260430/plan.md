# Implementation Plan: UI and Orders Fixes

## Phase 1: Research & Reproduction
- [x] Locate the mobile navbar/menu component and identify where to add the logout button.
- [x] Locate the Orders tab component (likely in `/dashboard/orders` or a shared component) and analyze the data rendering logic.
- [x] Identify the source of the "fucked" product names (DB or frontend mapping).

## Phase 2: Mobile Logout Fix
- [x] Add a "Logout" button to the mobile navigation menu.
- [x] Ensure it triggers the same logout logic as the desktop version (clearing `reseller_session` cookie).
- [x] Verify functionality on mobile viewport.

## Phase 3: Orders Tab Cleanup
- [x] Update the Orders tab UI to exclude the Smile.one URL.
- [x] Simplify the displayed fields to: Product, Order ID, and Delivery Time.
- [x] Implement a formatter for product names to ensure they look clean (e.g., removing technical prefixes or cleaning up strings).

## Phase 4: Verification
- [x] Test mobile logout on simulated mobile device.
- [x] Verify the Orders tab layout on both mobile and desktop.
- [x] Confirm product names are correctly formatted.
