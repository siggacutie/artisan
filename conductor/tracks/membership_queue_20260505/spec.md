# Specification: Membership Queue & Pricing Update

## Goal
Implement a "waiting list" model for memberships where different tiers (Basic/Premium) are queued sequentially. Also, reduce the Premium 1-month recharge price from ₹240 to ₹200.

## Requirements
1.  **Sequential Queue:**
    - If a user has an active membership, any new membership purchased starts *after* the current one expires.
    - Multiple tiers can be queued (e.g., 6 months BASIC -> 1 month PREMIUM -> 1 month BASIC).
2.  **Dynamic Tier Resolution:**
    - The system must dynamically determine the *current* active tier based on the sequence.
    - Pricing and UI must reflect the *active* tier, not the total duration.
3.  **Pricing Update:**
    - Premium 1-month plan: ₹240 -> ₹200.
    - Ensure proportional savings are updated if applicable.

## Technical Details
- **Database:**
    - New model `MembershipItem` to track individual membership segments.
    - Fields: `userId`, `tier`, `months`, `startsAt`, `expiresAt`.
- **API:**
    - `app/api/membership/renew`: Refactor to create `MembershipItem` records and calculate sequential `startsAt`.
    - `lib/resellerAuth`: Update `getResellerSession` to derive the active tier from the queue and update the `User.tier` if it has changed.
- **UI:**
    - `app/(main)/membership/page.tsx`: Update `MEMBERSHIP_PLANS` constant.
    - (Optional) Show the queue or next scheduled tier in the UI.
