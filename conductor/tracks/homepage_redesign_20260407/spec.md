# Specification: Homepage Redesign (Banner, Coming Soon, Search Pills)

## Goal
Perform three surgical fixes to the homepage at `app/(main)/page.tsx` to improve visual impact and remove placeholder/fake content.

## Scope

### 1. Banner Carousel Redesign
- Rebuild `components/shared/PromoBanner.tsx` (or new component if preferred, but updating existing is surgical).
- Full-width, 420px height on desktop, 260px on mobile.
- 3 slides with auto-advance every 4 seconds.
- Dot indicators at bottom center (6px circles, inactive #ffffff30, active #ffd700, 8px gap).
- Gradient backgrounds (left to right, dark to slightly lighter).
- Left side (60%):
  - Label tag: Gold (#ffd700), 11px Orbitron, uppercase.
  - Heading: White, 42px desktop / 26px mobile, Orbitron bold, max 2 lines.
  - Subtext: #94a3b8, 15px Inter, max 1 line.
  - CTA Button: #ffd700 bg, #050810 text, 14px Inter bold, 10px 24px padding, rounded-md.
- Right side (40%):
  - Decorative text: Accent color at 20% opacity, 120px Orbitron, 900 weight, right-aligned, clipped.
- No `framer-motion`. Use CSS transitions only.

#### Slide Data:
- **Slide 1**: #1a0533 -> #2d0a4e, accent #c084fc, label "MEGA DIAMOND SALE", heading "Double Diamonds\nThis Weekend", subtext "Limited time offer on all MLBB packages", ctaText "SHOP NOW", decorativeText "2X".
- **Slide 2**: #0a1628 -> #0f2347, accent #00c3ff, label "PREMIUM ACCOUNTS", heading "Own a Legend-Tier\nMLBB Account", subtext "Mythical Glory ranked accounts, instant delivery", ctaText "BROWSE ACCOUNTS", decorativeText "MLBB".
- **Slide 3**: #1a1200 -> #2d1f00, accent #ffd700, label "ARTISAN WALLET", heading "Save 5% on Every\nOrder Instantly", subtext "Top up your wallet once, save on every purchase", ctaText "ADD FUNDS", decorativeText "5%".

### 2. Coming Soon Cards Fix
- Target "Shop by Game" section in `app/(main)/page.tsx`.
- Placeholder cards for inactive games must show:
  - Background: #0d1120.
  - Border: 1px solid rgba(255,215,0,0.1).
  - Icon: Centered `gamepad` from `lucide-react`, #ffffff20, 32px.
  - Text: "Coming Soon" in #ffffff30, 13px Inter, centered below icon.
  - Remove game names, letter logos, and fake stats.

### 3. Popular Search Pills Fix
- Target popular search pills below search bar in `app/(main)/page.tsx`.
- Show ONLY: "MLBB Diamonds" and "MLBB Accounts".
- Remove all other fake game references (PUBG, Free Fire, Valorant, etc.).

## Constraints
- Dark theme (#050810) and Gold (#ffd700) accents.
- Mobile-first (test at 375px).
- No Light Mode sections.
- No `framer-motion`.
- No new dependencies.
- Surgical fixes only (do not rebuild the full page).
