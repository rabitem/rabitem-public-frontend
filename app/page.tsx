import Intro from '@/components/Intro'
import ProjectList from '@/components/ProjectList'
import RabbitJourney from '@/components/RabbitJourney'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'

export default function Home () {
	return (
		<div className='site-shell'>
			<SiteHeader />
			<main id='main'>
				<Intro />
				<ProjectList />
			</main>
			<SiteFooter />
			<RabbitJourney />
		</div>
	)
}
