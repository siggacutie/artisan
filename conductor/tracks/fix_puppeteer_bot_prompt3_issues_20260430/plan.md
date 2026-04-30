# Implementation Plan - Fix Puppeteer Bot issues

Fix multiple reliability issues in the Puppeteer-based purchase bot.

## User Review Required

> [!IMPORTANT]
> This track modifies the Puppeteer bot logic which interacts with an external site (smile.one). It assumes the selectors provided in `prompt3.md` are accurate for the current version of the site.

- **Wait for User Approval:** No (Directive issued)

## Proposed Changes

### 1. Bot Input Logic
#### [artisan-puppeteer/bot/purchase.js]
- Clear `#user_id` and `#zone_id` using `page.evaluate` before typing.
- Use triple-click and `Control+a` to ensure fields are empty.
- Use `humanType` to enter credentials.

### 2. Login Detection & Cookies
#### [artisan-puppeteer/bot/purchase.js]
- Implement a more detailed `loginState` check using `page.evaluate`.
- Log the detected state.
- Throw a specific error if "Entrar" button is detected.

#### [artisan-puppeteer/bot/cookies.js]
- Update `injectCookies` to normalize domains (ensure leading dot).
- Add better error handling for cookie injection.

### 3. Payment Selection & Purchase
#### [artisan-puppeteer/bot/purchase.js]
- Remove all blocking overlays/modals before payment selection.
- Implement robust SmileCoin selection with jQuery fallback.
- Force-enable buy buttons and use multiple selectors to find the clickable one.

## Verification Plan

### Automated Tests
- Run the bot with a test order to verify it reaches the expected failure/success points.
- Check logs and screenshots for "not_logged_in" or "no_buy_btn" states.

### Manual Verification
- Verify that player IDs are not doubled in the UI during bot execution.
- Confirm cookies are injected correctly by checking if the session persists.
