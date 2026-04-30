## FIX 1 — Double typing in input fields

The bot is typing the real player ID then APPENDING the test data 
because the input fields already have values from a previous run 
(smile.one remembers last entered IDs via cookies/localStorage).

In bot/purchase.js, replace the player ID entry section:

FIND:
```js
await page.waitForSelector('#user_id', { timeout: 10000 })
await humanType(page, '#user_id', String(playerId))
await sleep(300)
await humanType(page, '#zone_id', String(zoneId))
```

REPLACE WITH:
```js
await page.waitForSelector('#user_id', { timeout: 10000 })

// Clear existing values first before typing
await page.evaluate(() => {
  const userIdEl = document.getElementById('user_id')
  const zoneIdEl = document.getElementById('zone_id')
  if (userIdEl) { userIdEl.value = ''; userIdEl.dispatchEvent(new Event('input', { bubbles: true })) }
  if (zoneIdEl) { zoneIdEl.value = ''; zoneIdEl.dispatchEvent(new Event('input', { bubbles: true })) }
})
await sleep(300)

// Triple-click to select all then type (catches any remaining content)
await page.click('#user_id', { clickCount: 3 })
await page.keyboard.press('Control+a')
await page.keyboard.press('Delete')
await sleep(200)
await humanType(page, '#user_id', String(playerId))

await sleep(300)

await page.click('#zone_id', { clickCount: 3 })
await page.keyboard.press('Control+a')
await page.keyboard.press('Delete')
await sleep(200)
await humanType(page, '#zone_id', String(zoneId))
```

---

## FIX 2 — Not logged in (cookies not working, shows "Entrar")

The cookies are either expired or not being injected with the right 
domain format. The persistent profile approach is more reliable.

Step 1: In bot/purchase.js, improve the login check:

FIND:
```js
const isLoggedIn = await page.$('.user-name, .user-info, .login-text .user-info, header img[src*="Icon"]')
if (!isLoggedIn) {
  throw new Error('NOT_LOGGED_IN: Cookies expired or invalid.')
}
```

REPLACE WITH:
```js
// Wait up to 5 seconds for login state to resolve
await sleep(2000)

const loginState = await page.evaluate(() => {
  // "Entrar" = not logged in
  const loginBtn = document.querySelector('.login-btn a')
  if (loginBtn && loginBtn.innerText.includes('Entrar')) return 'not_logged_in'
  
  // Check for user-specific elements
  const userInfo = document.querySelector('.user-info, .user-name, .nickname')
  if (userInfo) return 'logged_in'
  
  // Check if login button is hidden (means logged in)
  const loginText = document.querySelector('.login-text')
  if (loginText) {
    const style = window.getComputedStyle(loginText)
    const loginBtnEl = loginText.querySelector('.login-btn')
    const userInfoEl = loginText.querySelector('.user-info')
    if (userInfoEl && window.getComputedStyle(userInfoEl).display !== 'none') return 'logged_in'
    if (loginBtnEl && window.getComputedStyle(loginBtnEl).display === 'none') return 'logged_in'
  }
  
  return 'unknown'
})

console.log(`[purchase] Login state: ${loginState}`)

if (loginState === 'not_logged_in') {
  await page.screenshot({ path: `logs/not_logged_in_${Date.now()}.png` })
  throw new Error('NOT_LOGGED_IN: Page shows Entrar button. Re-run node bot/login.js to refresh session.')
}
// If 'unknown', continue anyway — might still be logged in
```

Step 2: In bot/cookies.js, fix the domain format:

Replace the entire injectCookies function:
```js
async function injectCookies(context) {
  const cookies = loadCookies()
  if (cookies.length === 0) {
    console.warn('[cookies] No cookies to inject')
    return
  }

  const playwrightCookies = cookies
    .filter(c => c.name && c.value) // skip empty cookies
    .map(c => {
      // Normalize domain — must start with dot for subdomain matching
      let domain = c.domain || 'www.smile.one'
      if (!domain.startsWith('.') && !domain.startsWith('http')) {
        domain = '.' + domain
      }
      // Remove protocol if present
      domain = domain.replace('https://', '').replace('http://', '')
      
      return {
        name: String(c.name),
        value: String(c.value),
        domain: domain,
        path: c.path || '/',
        expires: typeof c.expirationDate === 'number' 
          ? c.expirationDate 
          : typeof c.expires === 'number' 
          ? c.expires 
          : -1,
        httpOnly: Boolean(c.httpOnly),
        secure: Boolean(c.secure),
        sameSite: c.sameSite === 'None' ? 'None' 
          : c.sameSite === 'Strict' ? 'Strict' 
          : 'Lax',
      }
    })

  try {
    await context.addCookies(playwrightCookies)
    console.log(`[cookies] Injected ${playwrightCookies.length} cookies`)
  } catch (err) {
    console.error('[cookies] Cookie injection error:', err.message)
    console.error('[cookies] Try re-running: node bot/login.js')
  }
}
```

---

## FIX 3 — "Comprar agora" button not appearing / not clickable

The button is grayed out because either:
a) SmileCoin payment method was not properly selected
b) The package was not properly activated
c) The buy button is in the mobile bar not the desktop container

In bot/purchase.js, replace the entire payment selection + buy button section:

FIND the section from "STEP 3: Remove any blocking modals" through "await sleep(1000)" after clicking buy.

REPLACE WITH:
```js
// STEP 3: Remove ALL blocking overlays and modals
await page.evaluate(() => {
  const selectors = [
    '.modal', '.overlay', '.popup', '.van-overlay', '.modal-mask',
    '.loginmarksmak', '#notifi_div', '#install_div', '#shadow',
    '.loginmarksmak.mobile-legends', '[style*="z-index: 200"]'
  ]
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.display = 'none'
      el.style.visibility = 'hidden'
      el.style.pointerEvents = 'none'
      el.style.zIndex = '-1'
    })
  })
})
await sleep(500)

// STEP 4: Select SmileCoin — try multiple approaches
console.log('[purchase] Selecting SmileCoin payment...')

const smilecoinSelected = await page.evaluate(() => {
  // Find smilecoin element
  const smilecoin = document.querySelector('.sectionNav-cartao.smilecoin')
  if (!smilecoin) {
    console.log('SmileCoin element not found')
    return false
  }
  
  // Remove pointer-events block if any
  smilecoin.style.pointerEvents = 'auto'
  
  // Try jQuery first (page uses jQuery)
  if (typeof $ !== 'undefined') {
    $(smilecoin).trigger('click')
  } else {
    smilecoin.click()
  }
  
  return true
})

if (!smilecoinSelected) {
  throw new Error('PAYMENT_METHOD_NOT_FOUND: SmileCoin option not found on page')
}

await sleep(2000)

// Verify SmileCoin is actually active now
const smilecoinActive = await page.evaluate(() => {
  const el = document.querySelector('.sectionNav-cartao.smilecoin')
  return el ? el.classList.contains('active') || el.classList.contains('selected') : false
})
console.log(`[purchase] SmileCoin active: ${smilecoinActive}`)

// STEP 5: Enable ALL buy buttons and click
console.log('[purchase] Enabling and clicking buy button...')

// Force enable every possible buy button
await page.evaluate(() => {
  document.querySelectorAll('.Nav-btn, .pay-btn, [class*="buy"], [class*="purchase"]').forEach(btn => {
    btn.style.pointerEvents = 'auto'
    btn.style.cursor = 'pointer'
    btn.style.opacity = '1'
    btn.removeAttribute('disabled')
  })
})
await sleep(300)

// Try clicking the main payment button
const buyClicked = await page.evaluate(() => {
  // Priority order of buy button selectors
  const selectors = [
    '.payment-button-container .Nav-btn',
    '.mobile-purchasebar .Nav-btn',
    '.Nav-btn:not([style*="pointer-events: none"])',
    '.pay-btn',
  ]
  
  for (const sel of selectors) {
    const btn = document.querySelector(sel)
    if (btn && btn.offsetHeight > 0) {
      console.log('Clicking buy button:', sel)
      if (typeof $ !== 'undefined') $(btn).trigger('click')
      else btn.click()
      return sel
    }
  }
  return null
})

console.log(`[purchase] Buy button clicked: ${buyClicked}`)

if (!buyClicked) {
  await page.screenshot({ path: `logs/no_buy_btn_${Date.now()}.png`, fullPage: true })
  throw new Error('BUY_BUTTON_NOT_FOUND: Could not find clickable buy button')
}

await sleep(1500)
```

---

## ALSO — Fix the test order issue

The orders with playerId=12345678 and zoneId=1234 are fake test orders 
that will always fail player verification on smile.one. This is expected.

In bot/purchase.js, after the player verification throws PLAYER_NOT_FOUND,
make sure the error is clearly logged and the order is marked as failed 
(it already does this via the catch block — no change needed).

To create a real test order, use actual MLBB player credentials in the 
order. The bot will only work with real player IDs.

---

## STRICT RULES
- Only touch files in artisan-puppeteer/bot/
- Do not touch the Next.js app
- Do not add new features
- List every file modified