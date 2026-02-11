'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ExitIntentPopupProps {
  title: string
  message: string
  cta: string
  ctaHref: string
  email?: boolean
}

export default function ExitIntentPopup({
  title,
  message,
  cta,
  ctaHref,
  email = true,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user has already interacted
    const hasInteractedBefore = localStorage.getItem('exit-intent-popup-interacted')
    if (hasInteractedBefore) {
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect if mouse is leaving towards top (likely leaving the page)
      if (e.clientY <= 0) {
        setIsVisible(true)
        setHasInteracted(true)
        localStorage.setItem('exit-intent-popup-interacted', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleCTA = () => {
    setIsVisible(false)
    // Navigate or trigger action
    if (ctaHref.startsWith('http')) {
      window.location.href = ctaHref
    } else {
      window.location.pathname = ctaHref
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in slide-in-from-bottom">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>

        {email && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Enter your email to stay updated</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}

        <button
          onClick={handleCTA}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors mb-3"
        >
          {cta}
        </button>

        <button
          onClick={handleClose}
          className="w-full px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}
