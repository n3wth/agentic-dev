/**
 * Agentic Dev - Hero Message Variant A (Control)
 * "Rapid AI Development Platform"
 */

import { useCTATracking, useVariantTracking } from '@/shared/lib/variant-analytics'

export function HeroMessageVariantA() {
  const { trackClick } = useCTATracking('agentic-dev-hero-message', 'A')
  useVariantTracking('agentic-dev-hero-message', 'A')

  return (
    <section className="hero-message-variant-a relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Variant A: Feature-focused */}
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Rapid AI Development Platform
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Build production-grade AI applications in days, not months. Our platform handles infrastructure, fine-tuning, and deployment.
            </p>

            <button
              onClick={() => trackClick('Start Building Free', 'hero')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Start Building Free
            </button>

            <p className="mt-4 text-sm text-gray-400">Get $100 in free API credits. No credit card required.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-gray-300">See the power of rapid AI development</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
