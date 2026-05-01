'use client'

import { useState, useEffect } from 'react'
import { Timer, AlertTriangle } from 'lucide-react'

interface OutOfStockOverlayProps {
  restockTime: string | null
}

export default function OutOfStockOverlay({ restockTime }: OutOfStockOverlayProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null)

  useEffect(() => {
    if (!restockTime) return

    const targetDate = new Date(restockTime).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [restockTime])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050810]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gold/20 blur-2xl rounded-full animate-pulse" />
          <AlertTriangle size={80} className="text-gold relative z-10 mx-auto" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white uppercase italic tracking-tighter">
            Out of Stock
          </h1>
          <p className="text-gray-400 font-inter text-lg">
            Our store is currently out of stock. We are working hard to restock as soon as possible.
          </p>
        </div>

        {timeLeft && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gold font-orbitron text-sm uppercase tracking-widest">
              <Timer size={16} />
              Estimated Restock In
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-3xl font-orbitron font-bold text-white">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8">
          <p className="text-xs text-gray-600 font-inter uppercase tracking-widest">
            Artisanstore.xyz — Professional Reseller Panel
          </p>
        </div>
      </div>
    </div>
  )
}
