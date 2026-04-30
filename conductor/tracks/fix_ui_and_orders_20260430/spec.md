# Specification: UI and Orders Fixes

## Overview
This track addresses three specific issues in the ArtisanStore platform:
1. Missing logout option on mobile devices.
2. Extraneous information (Smile.one URL) and messy product names in the Orders tab.
3. General product name formatting improvements.

## Requirements
- **Mobile Logout:** Ensure users on mobile devices can easily log out of their accounts. This should likely be integrated into the mobile navigation menu.
- **Orders Tab Cleanup:**
    - Remove Smile.one URLs from the order display.
    - Only show: Product Purchased, Order ID, and Time Delivered.
    - Fix the formatting of product names (currently described as "fucked").
- **Consistency:** Maintain the dark theme and gold accent aesthetic across all changes.

## Success Criteria
- [ ] Logout button visible and functional on mobile devices.
- [ ] Orders tab shows clean information without Smile.one URLs.
- [ ] Product names in the Orders tab are properly formatted and readable.
- [ ] No regressions in other UI components.
