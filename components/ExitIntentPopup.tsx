import React, { useState, useEffect } from 'react';

/**
 * ExitIntentPopup Component for Agentic Dev
 * Customized messaging for AI agent development services
 */
interface ExitIntentPopupProps {
  title?: string;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  onClose?: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  title = "Before you leave...",
  message = "Get a free AI agent architecture review from our senior developers. See how much time you could save.",
  ctaText = "Schedule Your Review",
  ctaLink = "/start",
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showOnce, setShowOnce] = useState(false);

  useEffect(() => {
    if (showOnce) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setIsVisible(true);
        setShowOnce(true);
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'popup_shown', {
            popup_type: 'exit_intent',
            service: 'agentic_dev'
          });
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showOnce]);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_close', {
        popup_type: 'exit_intent',
        service: 'agentic_dev'
      });
    }
    onClose?.();
  };

  const handleCTA = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_cta_click', {
        popup_type: 'exit_intent',
        service: 'agentic_dev'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in scale-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        <a
          href={ctaLink}
          onClick={handleCTA}
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-center transition-colors duration-200"
        >
          {ctaText}
        </a>

        <button
          onClick={handleClose}
          className="block w-full mt-3 text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
