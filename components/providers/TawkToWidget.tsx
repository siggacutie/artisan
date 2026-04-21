'use client'

import { useEffect } from 'react'

export function TawkToWidget() {
  useEffect(() => {
    if ((window as any).Tawk_API) return

    ;(function () {
      const Tawk_API = (window as any).Tawk_API || {}
      const Tawk_LoadStart = new Date()
      void Tawk_LoadStart

      const s1 = document.createElement('script')
      const s0 = document.getElementsByTagName('script')[0]
      s1.async = true
      s1.src = 'https://embed.tawk.to/69da8af3f28f6f1c3576711b/1jluqtism'
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      s0.parentNode!.insertBefore(s1, s0)
    })()
  }, [])

  return (
    <style jsx global>{`
      @media (max-width: 768px) {
        #tawkchat-container, 
        .tawk-min-container,
        iframe[title="chat widget"] {
          bottom: 70px !important;
        }
      }
    `}</style>
  )
}
