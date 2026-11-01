import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { projects } from '@/lib/site'
import RettungsheldenLogo from './RettungsheldenLogo'
import WizardCardHand from './WizardCardHand'

// Projects with a small illustration beside their name.
const illustrations: Partial<Record<(typeof projects)[number]['name'], ReactNode>> = {
	'Rettungshelden': <RettungsheldenLogo className='rettungshelden-mark' />,
	'Wizard Party': <WizardCardHand />,
}

export default function ProjectList () {
	return (
		<section className='projects' aria-labelledby='projects-title'>
			<h2 id='projects-title' className='eyebrow'>A few things I build</h2>
			{projects.map(project => {
				const illustration = illustrations[project.name]
				return (
					<a key={project.href} className='project-link' href={project.href} data-rabbit-mood={project.mood}>
						{illustration
							? (
								<span className='project-identity'>
									<span className='project-name'>{project.name}</span>
									{illustration}
								</span>
							)
							: <span className='project-name'>{project.name}</span>}
						<span className='project-description'>{project.description}</span>
						<ArrowUpRight aria-hidden='true' />
					</a>
				)
			})}
		</section>
	)
}
