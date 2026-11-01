import { company, employer, profiles, site } from './site'

const personId = `${site.url}/#person`
const companyId = `${site.url}/#rettungshelden`

// One schema.org graph for the whole site: the website, its author and the companies he works for.
export function siteGraph () {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${site.url}/#website`,
				url: site.url,
				name: site.name,
				description: site.description,
				inLanguage: 'en',
				author: { '@id': personId },
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: site.name,
				url: site.url,
				email: `mailto:${site.email}`,
				description: site.description,
				jobTitle: ['Geschäftsführer', 'Senior Software Engineer'],
				worksFor: [
					{ '@id': companyId },
					{ '@type': 'Organization', name: employer.name, url: employer.url },
				],
				homeLocation: { '@type': 'Place', name: site.location },
				sameAs: [...profiles],
			},
			{
				'@type': 'Organization',
				'@id': companyId,
				name: company.name,
				url: company.url,
				slogan: company.slogan,
				sameAs: [company.linkedIn],
				founder: { '@id': personId },
			},
		],
	}
}

// JSON for an inline <script>. Escaping "<" keeps any string from closing the script element.
export function serializeJsonLd (data: unknown) {
	return JSON.stringify(data).replace(/</g, '\\u003c')
}
