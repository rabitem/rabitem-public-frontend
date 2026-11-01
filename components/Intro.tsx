import { ArrowUpRight } from 'lucide-react'
import { company, contactLinks, employer } from '@/lib/site'
import RabbitScene from './RabbitScene'

export default function Intro () {
	return (
		<section className='intro' aria-labelledby='name'>
			<div className='intro-copy'>
				<p className='eyebrow'>Hello, I’m Felix.</p>
				<h1 id='name'>Felix<br />Huisinga<span aria-hidden='true'>.</span></h1>
				<p className='about'>
					I write software at <a href={employer.url}>{employer.name}</a>
					{' '}and build <a href={company.url} data-rabbit-mood='medic'>Rettungshelden</a>.
				</p>
				<nav className='social-links' aria-label='Contact and profiles'>
					{contactLinks.map(link => (
						<a key={link.href} href={link.href} data-rabbit-mood={link.mood}>
							{link.label} <ArrowUpRight aria-hidden='true' />
						</a>
					))}
				</nav>
			</div>
			<RabbitScene />
		</section>
	)
}
