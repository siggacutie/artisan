'use client'

import { useEffect } from 'react'

export function TawkToWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).Tawk_API) return

    ;(function () {
      const s1 = document.createElement('script')
      const s0 = document.getElementsByTagName('script')[0]
      s1.async = true
      s1.src = 'https://embed.tawk.to/69da8af3f28f6f1c3576711b/1jluqtism'
      s1.charset = 'UTF-8'
      // Removing s1.setAttribute('crossorigin', '*') as it can cause "Failed to fetch" 
      // errors on Tawk.to's internal language files in some environments.
      
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0)
      } else {
        document.head.appendChild(s1)
      }
    })()
  }, [])

  return null
}
