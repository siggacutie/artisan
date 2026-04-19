# Design Principles — Anti-AI-Generic Guide

## Core Philosophy
AI generates generic defaults. Every decision below
exists to override those defaults with intentional design.

## 1. ICONOGRAPHY
- Never use emojis in UI. Use Lucide icons only.
- Icons must be consistent size and weight throughout.
- Icon color must have semantic meaning not decoration.
- Gold icons = primary actions or important data.
- Gray icons = secondary or inactive.
- Red icons = destructive actions only.
- Green icons = success or positive states only.

## 2. COLOR
- Never use AI-chosen colors. Palette is defined in
  GEMINI.md and must not be deviated from.
- Do not add colored buttons or icons for decoration.
- Color must communicate meaning, not add visual noise.
- Use micro-charts and data visualizations to add color
  to data-heavy pages instead of colored cards.
- Avoid gradient overuse. One gradient per section max.

## 3. LAYOUT AND DENSITY
- Never duplicate KPI cards across multiple pages.
  KPIs belong in the Analytics page only.
- Sidebar: left-aligned text, tight spacing, no gradients.
- Profile/account in sidebar: clean text row not a
  gradient circle avatar card.
- Secondary sidebar links (Sign Out, Back to Store) must
  be tucked into a bottom section or popover, not
  scattered throughout the nav.
- Cards: move secondary actions into a three-dot menu.
  Do not put multiple large buttons on every card.
- Quantitative data (counts, prices) goes right-aligned.
- Dates and labels go left-aligned.

## 4. MODALS VS FLYOUTS
- Use centered modals for forms with fewer than 8 fields.
- Use side panel flyouts only for complex multi-step flows.
- Every modal must have an Advanced Options section
  collapsed by default for secondary settings.
- Every form must have a Description or Notes field
  that AI typically forgets to include.

## 5. INFORMATION ARCHITECTURE
- Remove any card or section that does not provide
  actionable data. No filler content.
- Consolidate related data. If it appears on two pages
  it should appear on one.
- Every empty state must have a clear CTA.
- Every list must have search and filter.
- Every table must have sortable columns.

## 6. TYPOGRAPHY HIERARCHY
- Page titles: Orbitron bold, very large.
- Section titles: Orbitron or Rajdhani bold, large.
- Data values: Orbitron bold or Inter bold, sized by
  importance. Most important = largest.
- Labels: Inter, gray-400 or gray-500, small caps.
- Body text: Inter, gray-300, normal weight.
- The most important number on a page should be the
  largest element on that page visually.

## 7. PRICING AND PLANS
- Fewer options are always better. Max 4 tiers.
- Price (the number) must be the largest text on the
  pricing card. Plan name is secondary.
- Always show the discount for annual/wallet payment
  explicitly as a number not a percentage.
- Always show what is in the next tier to encourage
  upgrades.

## 8. ANALYTICS
- Prefer area charts and shaded region charts over
  plain bar charts for trend data.
- Use comparison toggles (This week vs Last week) on
  all time-based charts.
- Charts must use the project color palette.
  Gold for primary metric, blue for secondary.
- Every chart needs a summary stat above it showing
  the key takeaway number.

## 9. LANDING PAGE
- Use real UI screenshots of the product (skewed or
  framed) instead of generic icons or illustrations.
- Trust signals must be specific numbers not vague claims.
  "10,284 orders delivered" not "thousands of orders".
- Every section needs one visual anchor that draws the eye.

## 10. PROMPTING RULES FOR AI
- Always specify layout density: "high-density 2-column"
  not just "dashboard layout".
- Always specify icon library: "Lucide icons only".
- Always specify that advanced options are collapsed.
- Always specify data alignment: left for labels,
  right for numbers.
- Never let AI decide information architecture.
  Always specify exactly what goes where.