import type { MetadataRoute } from 'next'
import { legalPages, site } from '@/lib/site'

export default function sitemap (): MetadataRoute.Sitemap {
	return [
		{ url: site.url, changeFrequency: 'monthly', priority: 1 },
		...legalPages.map(page => ({
			url: `${site.url}${page.path}`,
			changeFrequency: 'yearly' as const,
			priority: 0.3,
		})),
	]
}
