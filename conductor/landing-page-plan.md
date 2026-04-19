# Implementation Plan: Artisan.gg Landing Page (Phase 1 MVP UI)

Build the landing page UI for Artisan.gg as per the requirements in `prompt2.md`.

## Objective
Create a production-ready, visually striking, and conversion-optimized landing page in `app/(main)/page.tsx`.

## Key Components & Context
- `app/(main)/page.tsx`: The main landing page file.
- `components/ui/`: Existing shadcn/ui components (button, card, etc.).
- `lucide-react`: For icons.
- `framer-motion`: For animations.

## Sections to Implement

### 1. Navbar
- Fixed at the top with backdrop blur and bottom border.
- "Artisan" logo in Orbitron (gold + white).
- Links: "Top Up", "Accounts" (hover gold with underline slide).
- Buttons: "Login" (ghost), "Sign Up" (solid gold).
- Mobile: Hamburger menu opening a `framer-motion` slide-in drawer.

### 2. Hero Section
- 100vh height, radial gradient background, CSS grid overlay.
- Staggered fade-up animation for headlines (Orbitron).
- Subtext and two action buttons (scale on hover).
- Stats badges ("10,000+ Orders", "4.9 Star Rating") with floating animation (desktop only).

### 3. Trust Bar
- Full width, dark background with borders.
- 4 key items with icons (Instant Delivery, Secure Payments, Worldwide Service, 10,000+ Orders).

### 4. Featured Game Banner (MLBB)
- Reusable banner/card for Mobile Legends Bang Bang.
- Game info, cover placeholder, and action buttons ("Top Up", "Buy Accounts").

### 5. Diamond Packages Preview
- Horizontal scrollable row (snap scroll).
- Package cards with gem icons, diamond amounts, and discounted prices.
- "BEST VALUE" ribbon on the 3rd card.

### 6. Account Listings Preview
- Grid of cards with rank banners (Epic, Legend, Mythic).
- Card details (heroes, skins, server) and "View Details" button.

### 7. How It Works
- Three steps (Enter Details, Choose Package, Instant Delivery).
- Step numbers as background decoration.

### 8. Testimonials
- Star ratings, review text, and user avatars.

### 9. Footer
- Three columns (Logo/Tagline, Quick Links, Payments badges).
- Bottom copyright bar.

### 10. Mobile Bottom Nav
- Fixed bottom, hidden on desktop.
- 5 tabs (Home, Top Up, Accounts, Wallet, Profile).

## Implementation Steps
1. Create `app/(main)/page.tsx`.
2. Implement sub-components (Navbar, Footer, etc.) either within the same file or in `components/layout/`.
3. Add `framer-motion` animations as specified (fade-up, float, pulse).
4. Ensure mobile-first design and responsive layout (375px, 768px, 1280px).
5. Use dummy data for all sections.

## Verification & Testing
- Verify layout at 375px (mobile), 768px (tablet), and 1280px (desktop).
- Check all `framer-motion` animations for smoothness and lack of errors.
- Ensure all links and buttons have correct hover states and transitions.
- Confirm no TypeScript or linting errors.
