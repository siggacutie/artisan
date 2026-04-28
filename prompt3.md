You are fixing the ArtisanStore.xyz delivery bot. The bot folder is separate from the Next.js app. You are editing these files ONLY: bot/purchase.js, bot/cookies.js, bot/index.js

Do NOT create new files unless explicitly told. Do NOT touch the Next.js app.

Here are ALL the bugs to fix:

────────────────────────────────────────────────────
BUG 1 — DOUBLE TYPING IN INPUT FIELDS
PROBLEM: The bot is typing the real playerId and zoneId correctly, but then ALSO typing leftover test values (like 12345678 and 1234) after. This means the fields are not being cleared before typing, and old values remain.
FIX in bot/purchase.js:
- Before typing into #user_id, triple-click to select all existing text, then press Backspace to clear it fully:
  await page.click('#user_id', { clickCount: 3 })
  await page.keyboard.press('Backspace')
- Do the same for #zone_id before typing:
  await page.click('#zone_id', { clickCount: 3 })
  await page.keyboard.press('Backspace')
- Then proceed with humanType as normal
- Also check: remove ANY hardcoded test values like '12345678' or '1234' anywhere in purchase.js — these must not exist

────────────────────────────────────────────────────
BUG 2 — NOT LOGGED IN (site still shows "Entrar")
PROBLEM: Cookies are not being injected correctly. The smile.one page still shows the login button ("Entrar") after cookie injection, meaning the session cookies are either not in the right format or not being applied to the correct domain.
FIX in bot/cookies.js:
- When injecting cookies, explicitly normalize each cookie's domain to ensure it works:
  - If domain does not start with '.', add '.' prefix: domain = '.' + domain.replace(/^\./, '')
  - Force domain to be '.smile.one' if the cookie's domain contains 'smile.one'
  - Set sameSite to 'Lax' for all cookies
  - Remove any cookie fields that Playwright doesn't accept (like 'hostOnly', 'session', 'storeId', 'id', 'expirationDate') — only keep: name, value, domain, path, expires, httpOnly, secure, sameSite
  - Convert 'expirationDate' to 'expires' (Playwright uses 'expires' not 'expirationDate')
- After injecting cookies, navigate to 'https://www.smile.one' first (not the MLBB page directly) and wait 2000ms, then navigate to the MLBB merchant page — this ensures the session is established on the root domain before going to the specific page
- Log each cookie being injected with its domain so we can debug: console.log('[cookies] Injecting:', c.name, 'for domain:', c.domain)

────────────────────────────────────────────────────
BUG 3 — "COMPRAR AGORA" BUTTON NOT APPEARING / NOT CLICKING
PROBLEM: The buy button ("Comprar agora" in Portuguese) does not appear at the bottom of the page because the bot moves through steps too fast. The button only appears after: player is verified AND package is selected AND payment method is selected.
FIX in bot/purchase.js:

STEP 4 (SmileCoin selection) — after clicking SmileCoin, wait longer:
- After triggering the SmileCoin click, wait for the payment section to update:
  await page.waitForFunction(() => {
    const el = document.querySelector('.sectionNav-cartao.smilecoin')
    return el && (el.classList.contains('active') || el.classList.contains('selected') || el.getAttribute('aria-selected') === 'true')
  }, { timeout: 10000 }).catch(() => {})
  await sleep(2000)

STEP 5 (Buy button) — completely rewrite this section:
- First wait for the button to appear and be visible:
  await page.waitForFunction(() => {
    const selectors = [
      '.payment-button-container .Nav-btn',
      '.Nav-btn[onclick]',
      'button.Nav-btn',
      '.btn-buy',
      '.buy-btn',
      'button[class*="buy"]',
      'button[class*="Buy"]',
      'button[class*="Nav"]'
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el && el.offsetHeight > 0 && el.offsetWidth > 0) return true
    }
    return false
  }, { timeout: 15000 })
  await sleep(500)

- Then enable pointer events and click:
  await page.evaluate(() => {
    const selectors = [
      '.payment-button-container .Nav-btn',
      '.Nav-btn[onclick]', 
      'button.Nav-btn',
      '.btn-buy',
      '.buy-btn',
      'button[class*="buy"]',
      'button[class*="Buy"]',
      'button[class*="Nav"]'
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
        el.style.pointerEvents = 'auto'
        el.style.opacity = '1'
        el.removeAttribute('disabled')
        if (typeof $ !== 'undefined') $(el).trigger('click')
        else el.click()
        return true
      }
    }
    throw new Error('Buy button not found with any selector')
  })

- Also add a screenshot right before clicking the buy button for debugging:
  await page.screenshot({ path: `logs/before_buy_${orderId}_${Date.now()}.png`, fullPage: true }).catch(() => {})

────────────────────────────────────────────────────
BUG 4 — GENERAL TIMING ISSUES
The bot moves too fast overall. Add these sleep increases:
- After page.goto and before checking login: increase sleep to 3000ms
- After humanType for zone_id and before triggering change event: sleep 800ms
- After triggering change event and before waitForFunction for player verification: sleep 500ms
- After package selected and before removing modals: sleep 1000ms
- After removing modals and before SmileCoin selection: sleep 500ms

────────────────────────────────────────────────────
BUG 5 — LOGIN CHECK SELECTOR
PROBLEM: The login check uses '.user-name, .username, .nickname, .user-info' but the actual logged-in indicator on smile.one merchant page may be different. The HTML dump shows the page is in Portuguese (Brazil) which means the merchant account is Brazilian.
FIX in bot/purchase.js:
- Change the login check to be more permissive — check for the ABSENCE of the login button instead of the presence of user info:
  const loginButton = await page.$('a[href*="login"], .login-btn, button:has-text("Entrar"), a:has-text("Entrar"), a:has-text("Login")')
  if (loginButton) {
    throw new Error('NOT_LOGGED_IN: Login button still visible. Cookies expired or invalid.')
  }
  console.log('[purchase] Login check passed — no login button found')

────────────────────────────────────────────────────
RULES:
- Do NOT add any new npm packages
- Do NOT change stealth.js
- Do NOT hardcode any test player IDs or zone IDs anywhere
- Do NOT use <form> tags
- After all fixes, output each changed file as a complete file in its own codeblock
- Label each codeblock clearly: "bot/purchase.js", "bot/cookies.js"
- Double-check: are there any hardcoded test values (12345678, 1234, etc) anywhere? Remove them all.
- Double-check: does every input field get cleared before typing?
- Double-check: does the buy button wait logic handle the case where the button text is in Portuguese ("Comprar agora")?