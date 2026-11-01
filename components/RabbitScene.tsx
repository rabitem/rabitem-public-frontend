import type { CSSProperties } from 'react'
import { rabbitFeet, rabbitTriangles, trianglePath } from '@/lib/rabbit'
import RettungsheldenLogo from './RettungsheldenLogo'

// The hero's animated background: the rabbit hops in, eats the carrot, puffs up and pops into its
// triangles, and a new carrot drops. The motion is CSS in app/globals.css (.rabbit-scene); without
// it, or with reduced motion, the rabbit sits beside its carrot. Links reach it through
// data-rabbit-mood: a wizard hat, a first-aid cross or a greeting.
//
// The scene is 1000 x 200 units and anchored to the bottom right, so narrow screens crop the empty
// left side and always keep the rabbit and carrot in view.

const ground = 190
const rabbitX = 880
const carrotX = 815
const rabbitScale = 0.16

// Fixed pseudo-random values, so server and client render the same markup.
function seeded (seed: number) {
	return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

const random = seeded(7)
const shards = rabbitTriangles.map(triangle => {
	const centerX = (triangle[0] + triangle[2] + triangle[4]) / 3
	const centerY = (triangle[1] + triangle[3] + triangle[5]) / 3
	const distance = 500 + random() * 500
	const angle = Math.atan2(centerY - 520, centerX - rabbitFeet.x) + (random() - 0.5)
	return {
		'--dx': `${Math.round(Math.cos(angle) * distance)}px`,
		'--dy': `${Math.round(Math.sin(angle) * distance - 300)}px`,
		'--spin': `${Math.round((random() - 0.5) * 720)}deg`,
	} as CSSProperties
})

// The two ear triangles, grouped so they can wiggle.
const earTriangles = new Set([2, 3])

function shard (index: number) {
	const triangle = rabbitTriangles[index]
	return (
		<path key={trianglePath(triangle)} className='scene-shard' d={trianglePath(triangle)}
			fillOpacity={triangle[6]} style={shards[index]} />
	)
}

const randomStar = seeded(3)
const stars = Array.from({ length: 34 }, () => ({
	x: Math.round(randomStar() * 1000),
	y: Math.round(10 + randomStar() * 150),
	delay: `${(randomStar() * 4).toFixed(1)}s`,
}))

export default function RabbitScene () {
	return (
		<svg className='rabbit-scene' viewBox='0 0 1000 200' preserveAspectRatio='xMaxYMax slice'
			aria-hidden='true' focusable='false'>
			<g className='scene-stars'>
				{stars.map(star => (
					<rect key={`${star.x}-${star.y}`} x={star.x} y={star.y} width={2} height={2}
						style={{ animationDelay: star.delay }} />
				))}
			</g>
			<line className='scene-ground' x1={0} y1={ground} x2={1000} y2={ground} />

			<g transform={`translate(${carrotX} ${ground})`}>
				<g className='scene-carrot-drop'>
					<g className='scene-carrot'>
						<g transform='scale(0.7)'>
							<path className='scene-carrot-leaves' d='M -8 -58 L -16 -86 L -1 -58 Z M -3 -58 L 0 -96 L 4 -58 Z M 2 -58 L 15 -84 L 9 -58 Z' />
							<path className='scene-carrot-root' d='M -13 -62 L 13 -62 L 0 4 Z' />
							<path className='scene-carrot-shade' d='M 0 -62 L 13 -62 L 0 4 Z' />
						</g>
					</g>
				</g>
			</g>

			<g className='scene-words'>
				<text x={760} y={92}>nom</text>
				<text x={742} y={80}>nom</text>
				<text x={722} y={66} className='scene-word-loud'>NOM!</text>
				<text x={872} y={56} className='scene-word-loud scene-word-pop'>POP</text>
			</g>

			<g transform={`translate(${rabbitX} ${ground})`}>
				<g className='scene-rabbit'>
					<g className='scene-rabbit-body'>
						<g transform={`scale(${rabbitScale}) translate(${-rabbitFeet.x} ${-rabbitFeet.y})`}>
							{rabbitTriangles.map((_, index) => earTriangles.has(index) ? null : shard(index))}
							<g className='scene-ears'>{[...earTriangles].map(shard)}</g>

							{/* Shown while a link with a matching data-rabbit-mood is hovered or focused. */}
							<g className='scene-accessory scene-hat' data-accessory='hat'>
								<path d='M 215 372 L 425 340 L 330 70 Z' fill='#5b3fc4' />
								<path d='M 330 70 L 425 340 L 372 334 Z' fill='#43309a' />
								<path d='M 200 380 Q 320 330 445 335 L 450 360 Q 320 360 205 405 Z' fill='#43309a' />
								<path d='M 318 170 l 10 22 24 3 -18 16 5 24 -21 -12 -21 12 5 -24 -18 -16 24 -3 Z' fill='#f2c94c' />
							</g>
							<g className='scene-accessory scene-medic' data-accessory='medic'>
								<RettungsheldenLogo x={210} y={-60} width={180} height={180} />
							</g>
							<text className='scene-accessory scene-say scene-say-hello' data-accessory='hello' x={20} y={300}>hi!</text>
							<text className='scene-accessory scene-say scene-say-hey' data-accessory='hey' x={0} y={300}>hey!</text>
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}
