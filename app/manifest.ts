import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function manifest (): MetadataRoute.Manifest {
	return {
		name: site.name,
		short_name: site.shortName,
		description: site.description,
		start_url: '/',
		display: 'standalone',
		background_color: site.colors.background,
		theme_color: site.colors.background,
		icons: [192, 512].flatMap(size => (['any', 'maskable'] as const).map(purpose => ({
			src: `/icon/${size}`,
			sizes: `${size}x${size}`,
			type: 'image/png',
			purpose,
		}))),
	}
}
