import Link from 'next/link'
import { legalPages, site } from '@/lib/site'

export default function SiteFooter () {
	return (
		<footer className='site-footer'>
			<span>© {new Date().getFullYear()} {site.name}</span>
			<nav aria-label='Legal'>
				{legalPages.map(page => <Link key={page.path} href={page.path}>{page.title}</Link>)}
			</nav>
		</footer>
	)
}
