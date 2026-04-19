"use client"
import { useEffect } from "react"

export default function TawkChat() {
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

    if (!propertyId || !widgetId) return

    const script = document.createElement("script")
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")
    document.head.appendChild(script)

    return () => {
      // Avoid removing if we want it persistent, but standard React cleanup:
      // Actually, Tawk.to usually adds its own iframe outside the container.
      // Cleaning up the script is fine.
      document.head.removeChild(script)
    }
  }, [])

  return null
}
