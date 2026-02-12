/**
 * Agentic Dev - Hero Message Variant C
 * "Build Autonomous Agents in Hours"
 */

import { useCTATracking, useVariantTracking } from '@/shared/lib/variant-analytics'

export function HeroMessageVariantC() {
  const { trackClick } = useCTATracking('agentic-dev-hero-message', 'C')
  useVariantTracking('agentic-dev-hero-message', 'C')

  return (
    <section className="hero-message-variant-c relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Variant C: Capability/innovation focused */}
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Build Autonomous Agents in Hours
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Autonomous agents used to take months. Now build multi-agent systems with reasoning, tools, and memory—fully production-ready in hours.
            </p>

            <button
              onClick={() => trackClick('Explore Autonomous Agents', 'hero')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Explore Autonomous Agents
            </button>

            <p className="mt-4 text-sm text-gray-400">Join 1,000+ builders. Free tier. No credit card.</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-gray-300">Autonomous agents in hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
