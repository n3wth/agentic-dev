/**
 * Agentic Dev - Hero Message Variant B
 * "Ship Features 3x Faster with AI"
 */

import { useCTATracking, useVariantTracking } from '@/shared/lib/variant-analytics'

export function HeroMessageVariantB() {
  const { trackClick } = useCTATracking('agentic-dev-hero-message', 'B')
  useVariantTracking('agentic-dev-hero-message', 'B')

  return (
    <section className="hero-message-variant-b relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Variant B: Speed/benefit focused */}
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Ship Features 3x Faster with AI
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your engineering team moves 3x faster. Reduce development cycles from months to weeks. AI handles the heavy lifting—you ship the value.
            </p>

            <button
              onClick={() => trackClick('Get Your API Key', 'hero')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Get Your API Key
            </button>

            <p className="mt-4 text-sm text-gray-400">Free tier includes $100 in credits. No credit card required.</p>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-gray-300">3x faster feature shipping</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
