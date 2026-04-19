# Implementation Plan: Landing Page Refactor & Top-Up Page Implementation

Refactor the landing page and implement the MLBB Top-Up page as per `prompt3.md`.

## Objective
- Streamline the landing page by replacing detailed previews with simple CTA sections.
- Extract shared components (`Navbar`, `MobileBottomNav`, icons) for reusability.
- Build a fully functional, interactive Top-Up page for MLBB.

## Key Files & Context
- `app/(main)/page.tsx`: Existing landing page (to be refactored).
- `app/(main)/games/[game-slug]/topup/page.tsx`: New Top-Up page.
- `components/layout/Navbar.tsx`: New shared Navbar.
- `components/layout/MobileBottomNav.tsx`: New shared Mobile Bottom Nav.
- `components/shared/Icons.tsx`: New shared icons (DiamondSVG, etc.).

## Implementation Steps

### 1. Extract Shared Components & Icons
- Create `components/shared/Icons.tsx`:
    - Move `DiamondSVG`, `RankBadgeSVG`, and `HexagonIcon` here.
- Create `components/layout/Navbar.tsx`:
    - Move `Navbar` component here.
    - Import `DiamondSVG` from `@/components/shared/Icons`.
- Create `components/layout/MobileBottomNav.tsx`:
    - Move `MobileBottomNav` component here.

### 2. Refactor Landing Page (`app/(main)/page.tsx`)
- Import `Navbar` and `MobileBottomNav` from `@/components/layout/`.
- **Diamond Packages Section**:
    - Remove `DiamondPackages` component.
    - Add a new `TopUpCTA` section with background `#0d1120`, Orbitron title "Instant Diamond Top-Ups", and a "Top Up Now" button linking to `/games/mobile-legends/topup`.
- **Account Listings Section**:
    - Remove `AccountListings` component.
    - Add a new `AccountsCTA` section with background `#0a0f1e`, Orbitron title "Pre-Built MLBB Accounts", and a "Browse Accounts" button linking to `/games/mobile-legends/accounts`.
- **Game Section**:
    - Update the label to "Currently Available" (gray-400 small caps).
    - Add "More games coming soon" pill badge with a clock icon.
    - Keep the MLBB card but ensure it feels like a catalogue item.

### 3. Implement Top-Up Page (`app/(main)/games/[game-slug]/topup/page.tsx`)
- **Layout**: Two-column (60/40 desktop, stacked mobile).
- **Left Column**:
    - Breadcrumbs (`Home / Games / Mobile Legends Bang Bang`).
    - Game Header (Logo, Name, feature pills).
    - **Player Verification**:
        - Card with "Player ID" and "Zone ID" inputs.
        - "Verify Player" button with dummy loading/success/error states.
        - `framer-motion` success/error banners.
    - **Package Selection**:
        - Grid of package cards based on dummy data.
        - Interactive selection state (glow, checkmark).
        - Bonus badges and "Best Value" ribbons.
        - Wallet discount reminder banner.
- **Right Column**:
    - **Order Summary Card**:
        - Sticky on desktop.
        - Displays Game, Player Info (after verification), Selected Package, Price Breakdown.
        - **Wallet Section**: "Pay with Wallet" toggle with 5% discount logic.
        - **Payment Selector**: Shown if wallet toggle is off.
        - "Top Up Now" button (disabled until verified + selected).
    - **Accordion**: "How to find your ID" steps.
- **Mobile Bottom Bar**:
    - Fixed bar showing selected package and "Top Up Now" button when a package is selected.

### 4. Verification
- Run `npm run dev` and ensure no errors.
- Test responsiveness at 375px, 768px, and 1280px.
- Confirm sticky behavior and interactivity (useState).

## Verification & Testing
- Check all `framer-motion` animations.
- Ensure all dummy logic (verification, selection, toggle) works as expected.
- Verify pathing and imports.
