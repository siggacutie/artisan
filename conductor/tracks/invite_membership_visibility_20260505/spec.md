# Specification: Invite Membership Visibility

## Goal
To clearly display the membership tier (Premium or Basic) and the duration (X months) a user will receive when signing up via an invite link.

## Requirements
1.  **Backend Changes:**
    - Update `app/api/invite/validate/[token]/route.ts` to include the `tier` field from the `InviteLink` model in the response.
2.  **Frontend Changes:**
    - Update `app/invite/[token]/page.tsx` to:
        - Fetch and store the `tier` from the validation API.
        - Display a clear message in the UI: "Valid invite — grants **X months** of **[TIER]** access".
        - Use color coding for the tier (e.g., Gold for Premium, Blue or Silver for Basic).

## Technical Details
- **InviteLink Model:** Already contains `tier` (String) and `membershipMonths` (Int).
- **API Response:** Add `tier: invite.tier` to the validation success JSON.
- **UI Component:** Modify the success banner in `InvitePage` to include the tier name.
