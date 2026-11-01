// Everything the site says about its owner lives here, so the page, metadata, structured data,
// sitemap and manifest cannot drift apart.

export const site = {
	url: 'https://rabitem.de',
	name: 'Felix Huisinga',
	shortName: 'Rabitem',
	tagline: 'Somebunny has to ship it.',
	description: 'Felix Huisinga writes software at Deutsche Bank, runs Rettungshelden and builds Wizard Party, an open-source card game.',
	location: 'Wiesbaden, Germany',
	email: 'developer@rabitem.de',
	xHandle: '@r_a_b_i_t_e_m',
	colors: {
		background: '#101110',
		foreground: '#f2f1e9',
		muted: '#a2a49d',
	},
} as const

export const employer = { name: 'Deutsche Bank', url: 'https://www.db.com' } as const

export const company = {
	name: 'Rettungshelden GmbH',
	url: 'https://rettungshelden.com',
	slogan: '… weil Du ein Held sein kannst',
	linkedIn: 'https://www.linkedin.com/company/rettungshelden',
} as const

// How the hero rabbit reacts while a link is hovered or focused (see .rabbit-scene in globals.css).
export type RabbitMood = 'hello' | 'medic' | 'wizard'

// Shown on the page, in this order.
export const contactLinks = [
	{ label: 'Say hello', href: `mailto:${site.email}`, mood: 'hello' },
	{ label: 'GitHub', href: 'https://github.com/rabitem', mood: 'hello' },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/felixhuisinga', mood: 'hello' },
] as const satisfies readonly { label: string, href: string, mood: RabbitMood }[]

// Every public profile, for structured data.
export const profiles = [
	'https://github.com/rabitem',
	'https://linkedin.com/in/felixhuisinga',
	'https://x.com/r_a_b_i_t_e_m',
] as const

export const projects = [
	{
		name: 'Rettungshelden',
		href: company.url,
		description: 'First aid. For everyone.',
		mood: 'medic',
	},
	{
		name: 'Wizard Party',
		href: 'https://wizardparty.fun',
		description: 'A card game with friends, online.',
		source: 'https://github.com/rabitem/wizard-party',
		mood: 'wizard',
	},
] as const satisfies readonly { name: string, href: string, description: string, mood: RabbitMood, source?: string }[]

export const legalPages = [
	{ path: '/imprint', title: 'Impressum' },
	{ path: '/privacy', title: 'Datenschutz' },
] as const
