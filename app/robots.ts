import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', // No queremos que Google indexe los paneles privados
    },
    sitemap: 'https://iampaw.vercel.app/sitemap.xml',
  }
}