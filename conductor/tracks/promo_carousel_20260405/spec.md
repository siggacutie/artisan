# Specification: Dynamic PromoCarousel Refactor

## Objective
Refactor the landing page's `PromoCarousel` to fetch and render dynamic banners from the database, including all custom elements (text, buttons) and their positions as defined in the `BannerEditor`.

## Requirements
- Fetch active banners from `/api/admin/banners`.
- Fallback to a set of default banners if the database is empty or the API fails.
- Render background images or gradients correctly.
- Support custom text and buttons from `contentConfig` with their specific positions (X, Y percentages).
- Ensure buttons are clickable and link to their respective destinations.
- Maintain a high-end gaming aesthetic (animations, glows, etc.).
- Ensure responsiveness (hide/adjust complex elements on smaller screens if needed).
- Automatic cycling of banners every 8 seconds.
- Interactive pagination dots.

## Technical Details
- Data structure matches `Banner` model and `BannerElement` interface in `BannerEditor.tsx`.
- Component: `PromoCarousel` in `app/(main)/page.tsx`.
- API: `/api/admin/banners` (GET).
- Animation: `framer-motion` for transitions and elements.
