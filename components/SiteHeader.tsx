import { site } from '@/lib/site'

export default function SiteHeader () {
	return (
		<header className='site-header'>
			<span className='wordmark'>rabitem<span aria-hidden='true'>.</span></span>
			<span className='location'>{site.location}</span>
		</header>
	)
}
