import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import JsonLd from '@/components/JsonLd'
import { site } from '@/lib/site'
import { siteGraph } from '@/lib/structured-data'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'] })

const title = `${site.name} · ${site.tagline}`

export const viewport: Viewport = {
	themeColor: site.colors.background,
	colorScheme: 'dark',
}

// Icons and share images come from the file conventions in this folder:
// icon.tsx, apple-icon.tsx, opengraph-image.tsx and twitter-image.tsx.
export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: { default: title, template: `%s | ${site.name}` },
	description: site.description,
	applicationName: site.shortName,
	authors: [{ name: site.name, url: site.url }],
	creator: site.name,
	alternates: { canonical: '/' },
	openGraph: {
		type: 'profile',
		firstName: 'Felix',
		lastName: 'Huisinga',
		username: 'rabitem',
		url: '/',
		siteName: site.name,
		title,
		description: site.description,
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title,
		description: site.description,
		creator: site.xHandle,
		site: site.xHandle,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { 'max-image-preview': 'large' },
	},
	appleWebApp: { title: site.shortName, statusBarStyle: 'black-translucent' },
	formatDetection: { email: false, address: false, telephone: false },
}

export default function RootLayout ({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang='en'>
			<body className={`${inter.variable} ${jetbrainsMono.variable}`}>
				<JsonLd data={siteGraph()} />
				{children}
			</body>
		</html>
	)
}
