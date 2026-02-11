import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://agentic-dev-rho.vercel.app'
  const lastModified = new Date()

  // Core pages
  const corePages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Blog posts
  const blogPosts = [
    {
      url: `${baseUrl}/blog/building-first-ai-agent`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/multi-agent-systems`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/autonomous-workflows`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/agent-architecture`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/ai-automation`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Case studies
  const caseStudies = [
    {
      url: `${baseUrl}/case-studies`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies/workflow-automation`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case-studies/data-processing`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case-studies/customer-support`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Lead magnets
  const leadMagnets = [
    {
      url: `${baseUrl}/lead-magnets`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...corePages, ...blogPosts, ...caseStudies, ...leadMagnets]
}
