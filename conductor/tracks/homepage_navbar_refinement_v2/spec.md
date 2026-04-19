# Specification: Homepage and Navbar Refinement

## Goal
Perform three surgical fixes to the banner, navbar, and homepage game cards to improve visual appeal and UX. Additionally, revamp the "Popular" and "Wallet" sections on the homepage.

## Scope

### FIX 1: Banner Carousel Refinement
- **Height:** 320px (Desktop & Mobile).
- **Diagonal Light Streak:** Add an absolutely positioned div inside each slide.
  - `position: absolute`, `top: -50%`, `left: 30%`, `width: 1px`, `height: 200%`.
  - `background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)`.
  - `rotate: 25deg`, `pointer-events: none`.
- **Bottom Border:** `1px solid rgba(255,215,0,0.15)`.
- **Decorative Text:** Font size 100px.
- **Heading:** Wrap `h2` in a div with `border-left: 3px solid #ffd700` and `padding-left: 16px`.
- **CTA Button:**
  - Background: `#ffd700`, Color: `#050810`, Font: Inter bold 13px.
  - Padding: 10px 28px, BorderRadius: 6px, No border.
  - Hover: Background `#ffed4a`.

### FIX 2: Navbar Games Dropdown MLBB Submenu
- Modify `components/layout/Navbar.tsx`.
- Clicking "MLBB" or "Mobile Legends" in the dropdown should NOT navigate.
- Show a popover/submenu (to the right on desktop) with:
  - **Option 1: Top Up Diamonds**
    - Icon: `Zap` (lucide-react, 16px, #ffd700).
    - Label: "Top Up Diamonds", Sublabel: "Instant delivery".
    - Action: Navigate to `/games/mobile-legends/topup`, Close dropdown.
  - **Option 2: Buy Account**
    - Icon: `MessageCircle` (lucide-react, 16px, #25d366).
    - Label: "Buy Account", Sublabel: "via WhatsApp".
    - Action: Open `https://wa.me/WHATSAPP_NUMBER_PLACEHOLDER` in new tab, Close dropdown.
- Submenu Styling:
  - Background: `#0d1120`, Border: `1px solid rgba(255,215,0,0.15)`, BorderRadius: 8px, Padding: 8px.
  - Items: Padding 10px 14px, BorderRadius 6px.
  - Hover: Background `rgba(255,215,0,0.05)`.
  - Typography: Label (White, 13px, 600 weight), Sublabel (#64748b, 11px).

### FIX 3: Homepage MLBB Card Menu
- Modify `app/(main)/page.tsx`.
- Replace the direct link on the MLBB card with a menu (popover) containing "Top Up" and "Accounts".
- **"Top Up" option:**
  - Navigates to `/games/mobile-legends/topup`.
- **"Accounts" option:**
  - Icon: `MessageCircle` (#25d366), Sublabel: "via WhatsApp".
  - Action: Open `https://wa.me/WHATSAPP_NUMBER_PLACEHOLDER` in new tab via `window.open()`.
- No internal accounts page link for MLBB on the homepage.

### Bonus: Section Revamp
- **Popular Section:** Revamp or replace with a "spotlight search" style if appropriate, or just make it look less "AI-ish".
- **Wallet Section:** Revamp to look more distinctive.

## Constraints
- Do not change other parts of navbar/homepage.
- Use only specified colors and fonts.
- Surgical fixes (no full rebuilds).
