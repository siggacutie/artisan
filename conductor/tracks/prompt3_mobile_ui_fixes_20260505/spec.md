# Specification: Prompt 3 Mobile UI Fixes

## Goal
Implement surgical mobile UI fixes for the navbar, games page, top-up page, and profile page to resolve overlapping items, alignment issues, and layout breakage on small screens.

## Requirements
- **Navbar:** Show only Logo and Coin balance (if logged in) on mobile.
- **Games Page:** Fix loyalty discount banner layout, page padding, and overflow.
- **Top-up Page:** Fix container, section cards, input fields, balance chip, and package cards.
- **Profile Page:** Close dropdowns on route change, fix container, avatar section, form fields, save button, and auto-renew toggle.
- **Global:** Prevent horizontal scroll, fix iOS input zoom, and ensure `isMobile` hook usage.

## Constraints
- Touch ONLY layout/styling.
- No logic or API changes.
- Dark theme colors: bg #050810, card #0d1120, gold #ffd700.
- No HTML form tags, no emojis.
- 44px minimum touch target.
