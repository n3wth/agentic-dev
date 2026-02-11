import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/.well-known'],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://agentic-dev-rho.vercel.app/sitemap.xml',
    host: 'https://agentic-dev-rho.vercel.app',
  }
}
