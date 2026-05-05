# Specification: Old User Discount Popup and Tracker

## Goal
To inform "old users" about the new pricing discount system via a mandatory-read popup and provide a tracker to show remaining discount uses.

## Requirements
1.  **Define "Old User":** Users created before 2026-05-05.
2.  **Discount Eligibility:** Users get a special discount for their first 3 **successful** orders.
3.  **Mandatory Popup:**
    - Shown to old users who haven't acknowledged it.
    - Cannot be dismissed without acknowledging they've read the Terms of Service.
    - Content must mention the discount but be slightly unclear about the exact "3 orders" limit (e.g., "for your next few orders").
4.  **Discount Tracker:**
    - A UI component on the homepage (games catalogue) for logged-in users.
    - Shows how many discounted orders are remaining.
5.  **Order Logic:**
    - If an order fails or is refunded, it does NOT count towards the 3-order limit.
    - Bot result route must correctly increment `ordersCount` on success.

## Technical Details
- **Database:** Add `hasSeenOldUserPopup` (boolean) and `tosAcceptedAt` (DateTime?) to the `User` model.
- **API:**
    - `getResellerSession` needs to return `createdAt`, `hasSeenOldUserPopup`, and `tosAcceptedAt`.
    - New API endpoint to mark popup as seen/ToS accepted.
    - Update Bot Result API to increment `ordersCount`.
- **UI:**
    - New component `OldUserDiscountPopup` in `MainLayout`.
    - New component `DiscountTracker` in `GamesPage`.
