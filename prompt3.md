You are working on ArtisanStore.xyz. Fix ONLY the mobile UI issues visible in the three screenshots. Surgical fixes only — do not change any logic, APIs, or desktop layout.

---

## ISSUE 1 — Navbar overlapping on mobile (visible in all 3 screenshots)

The navbar items are cramped and overlapping on mobile. "Reseller", "coins", "Support" are all squished together.

File: components/layout/Navbar.tsx

On mobile (width < 768px), the navbar must show ONLY:
- Logo on the left
- Coin balance chip on the right (if logged in)
- Nothing else — no nav links, no dropdowns, no text

```tsx
// Mobile navbar — clean, no clutter
{isMobile && (
  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0,
    height: '56px', zIndex: 100,
    background: '#0d1120',
    borderBottom: '1px solid rgba(255,215,0,0.08)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    boxSizing: 'border-box',
  }}>
    <a href="/games" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '1px' }}>
      <span style={{ color: '#fff', fontFamily: 'Orbitron', fontWeight: 700, fontSize: '16px', letterSpacing: '2px' }}>ARTISAN</span>
      <span style={{ color: '#ffd700', fontFamily: 'Orbitron', fontWeight: 400, fontSize: '16px' }}>store</span>
      <span style={{ color: '#475569', fontFamily: 'Inter', fontSize: '9px' }}>.xyz</span>
    </a>
    {user && (
      <a href="/wallet/add" style={{
        background: 'rgba(255,215,0,0.08)',
        border: '1px solid rgba(255,215,0,0.25)',
        borderRadius: '20px', padding: '5px 12px',
        color: '#ffd700', fontFamily: 'Inter',
        fontWeight: 700, fontSize: '13px',
        textDecoration: 'none', letterSpacing: '-0.5px',
        whiteSpace: 'nowrap',
      }}>
        {Math.floor(user.walletBalance ?? 0)} coins
      </a>
    )}
  </nav>
)}
```

Hide the desktop navbar entirely on mobile using the isMobile flag.

---

## ISSUE 2 — Games page (/games) mobile layout

Screenshot 1 shows the games page. Fix these:

### Loyalty discount banner
The "LOYALTY DISCOUNT ACTIVE" banner layout is broken — text and the "3 ORDERS REMAINING" badge are misaligned.

```tsx
// Loyalty banner — mobile fix
<div style={{
  background: '#0d1120',
  border: '1px solid rgba(255,215,0,0.15)',
  borderRadius: '12px',
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  boxSizing: 'border-box',
  width: '100%',
}}>
  {/* Icon */}
  <div style={{
    width: '40px', height: '40px', flexShrink: 0,
    background: 'rgba(255,215,0,0.1)',
    border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Zap size={18} color="#ffd700" />
  </div>
  {/* Text */}
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '2px' }}>
      LOYALTY DISCOUNT ACTIVE
    </div>
    <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px' }}>
      Your special wholesale rates are applied.
    </div>
  </div>
  {/* Badge */}
  <div style={{
    flexShrink: 0,
    background: 'rgba(255,215,0,0.1)',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '8px',
    padding: '6px 10px',
    textAlign: 'center',
  }}>
    <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>
      3
    </div>
    <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.5px', marginTop: '2px' }}>
      ORDERS LEFT
    </div>
  </div>
</div>
```

### Page wrapper — fix padding and overflow
```tsx
<div style={{
  maxWidth: '100%',
  overflowX: 'hidden',
  padding: isMobile ? '72px 16px 80px' : '32px 24px',
  minHeight: '100vh',
  backgroundColor: '#050810',
  boxSizing: 'border-box',
}}>
```

Note: 72px top padding accounts for fixed navbar (56px) + 16px gap. 80px bottom padding accounts for bottom nav.

---

## ISSUE 3 — MLBB top-up page mobile layout (screenshot 2)

File: app/(main)/games/mlbb/topup/page.tsx

### Fix the page container
```tsx
<div style={{
  maxWidth: '600px',
  margin: '0 auto',
  padding: isMobile ? '72px 16px 80px' : '32px 24px',
  minHeight: '100vh',
  backgroundColor: '#050810',
  boxSizing: 'border-box',
  overflowX: 'hidden',
}}>
```

### Fix section cards — they need consistent mobile padding
Every card section (Player Details, Select Package) must use:
```tsx
<div style={{
  background: '#0d1120',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  padding: isMobile ? '16px' : '24px',
  marginBottom: '16px',
  boxSizing: 'border-box',
  width: '100%',
  overflowX: 'hidden',
}}>
```

### Fix input fields — must not overflow
```tsx
<input style={{
  width: '100%',
  boxSizing: 'border-box',
  background: '#050810',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: '#fff',
  fontFamily: 'Inter',
  fontSize: '15px',
  outline: 'none',
  display: 'block',
}} />
```

### Fix BALANCE chip alignment
```tsx
<div style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255,215,0,0.08)',
  border: '1px solid rgba(255,215,0,0.2)',
  borderRadius: '20px',
  padding: '6px 14px',
  marginBottom: '16px',
}}>
  <span style={{ color: '#ffd700', fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>
    BALANCE: {Math.floor(walletBalance)} COINS
  </span>
</div>
```

### Fix package cards — must not overflow on 375px screen
```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  background: selected ? 'rgba(255,215,0,0.08)' : '#050810',
  border: `1px solid ${selected ? '#ffd700' : 'rgba(255,255,255,0.06)'}`,
  borderRadius: '10px',
  cursor: 'pointer',
  marginBottom: '8px',
  boxSizing: 'border-box',
  width: '100%',
  gap: '8px',
}}>
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{
      color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {package.label}
    </div>
  </div>
  <div style={{ flexShrink: 0, color: '#ffd700', fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>
    {Math.ceil(package.resellerPrice)} coins
  </div>
</div>
```

---

## ISSUE 4 — Profile page mobile layout (screenshot 3)

File: app/(main)/dashboard/profile/page.tsx

### User dropdown menu is overlapping profile content
The dropdown from the navbar avatar is rendering on top of the profile page content. On mobile, the dropdown should close when navigating to any page. 

In Navbar.tsx, add a useEffect that closes all dropdowns on route change:
```tsx
const pathname = usePathname()
useEffect(() => {
  setDropdownOpen(false)
  setGamesDropdownOpen(false)
  setSupportDropdownOpen(false)
}, [pathname])
```

### Profile page container
```tsx
<div style={{
  maxWidth: '500px',
  margin: '0 auto',
  padding: isMobile ? '72px 16px 80px' : '32px 24px',
  minHeight: '100vh',
  backgroundColor: '#050810',
  boxSizing: 'border-box',
}}>
```

### Avatar section — center properly on mobile
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '24px',
}}>
  {/* Avatar circle */}
  <div style={{
    width: '80px', height: '80px', borderRadius: '50%',
    border: '2px solid rgba(255,215,0,0.3)',
    overflow: 'hidden', position: 'relative',
    marginBottom: '8px',
  }}>
    {/* avatar img or initials */}
  </div>
  <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '16px', fontWeight: 700 }}>
    {user.username}
  </div>
  <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '12px', marginTop: '2px' }}>
    MEMBER SINCE {memberSince}
  </div>
</div>
```

### Form fields — full width, no overflow
All input fields in the profile form must have:
```tsx
style={{
  width: '100%',
  boxSizing: 'border-box',
  background: '#050810',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: '#fff',
  fontFamily: 'Inter',
  fontSize: '14px',
  outline: 'none',
  display: 'block',
}}
```

### Save Changes button — full width on mobile
```tsx
<div onClick={handleSave} style={{
  width: '100%',
  background: '#ffd700',
  color: '#000',
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '15px',
  padding: '14px',
  borderRadius: '10px',
  textAlign: 'center',
  cursor: 'pointer',
  boxSizing: 'border-box',
  marginTop: '16px',
}}>
  SAVE CHANGES
</div>
```

### Auto-renew toggle — fix layout on mobile
```tsx
<div style={{
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '16px',
  background: '#0d1120',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  marginTop: '16px',
  boxSizing: 'border-box',
}}>
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
      AUTO-RENEW MEMBERSHIP
    </div>
    <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', lineHeight: '1.5' }}>
      Automatically renew using coin balance.
    </div>
  </div>
  {/* Toggle */}
  <div style={{ flexShrink: 0 }}>
    {/* existing toggle component */}
  </div>
</div>
```

---

## GLOBAL MOBILE FIXES — Apply to ALL pages

### Add to app/globals.css:
```css
/* Prevent horizontal scroll globally on mobile */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

* {
  box-sizing: border-box;
}

/* Prevent inputs from zooming on iOS */
input, select, textarea {
  font-size: 16px !important;
}

@media (max-width: 767px) {
  /* Ensure all page content clears the fixed navbar */
  main {
    padding-top: 56px !important;
  }
}
```

### isMobile hook — add to EVERY page component that doesn't have it:
```tsx
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])
```

---

## STRICT RULES
1. Touch ONLY layout/styling. Zero logic changes. Zero API changes.
2. Colors: bg #050810, card #0d1120, gold #ffd700, error #ef4444, muted #64748b
3. No html form tags. No emojis. Lucide icons only.
4. Every container must have boxSizing: 'border-box' and overflowX: 'hidden'
5. Minimum touch target: 44px height on all interactive elements
6. paddingTop: 72px on all page wrappers (56px navbar + 16px gap)
7. paddingBottom: 80px on all page wrappers (bottom nav clearance)
8. List every file modified