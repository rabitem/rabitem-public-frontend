'use client'

import { useEffect, useRef } from 'react'
import RabbitLogo from './RabbitLogo'
import RettungsheldenLogo from './RettungsheldenLogo'

// On wide screens the hero rabbit leaves its scene and tours the page: it eats the carrot in the
// hero, jumps down to the Rettungshelden row to bandage an injured friend, and plays Wizard with
// that friend on the Wizard Party row. Positions come from the real page, so the rabbits always
// land on the row lines beside the text.
//
// The CSS scene (RabbitScene) stays the fallback: without JavaScript, below 1024 px, or with
// reduced motion, this layer is hidden and the scene's own rabbit plays in the hero.

const wideScreen = '(min-width: 1024px)'
const reducedMotion = '(prefers-reduced-motion: reduce)'

type Point = { x: number, y: number }

class Stopped extends Error {}

function journey (layer: HTMLElement, shell: HTMLElement) {
	const part = (name: string) => layer.querySelector<HTMLElement>(`[data-part='${name}']`)!
	const rabbit = part('rabbit')
	const rabbitBody = part('rabbit-body')
	const friend = part('friend')
	const friendBody = part('friend-body')
	const carrot = part('carrot')
	const heart = part('heart')
	const cards = part('cards')
	const say = part('say')
	let stopped = false
	const positions = new Map<HTMLElement, Point>()

	function check () {
		if (stopped) throw new Stopped()
	}

	function wait (ms: number) {
		return new Promise<void>(resolve => setTimeout(resolve, ms)).then(check)
	}

	function place (element: HTMLElement, point: Point) {
		positions.set(element, point)
		element.style.transform = `translate(${point.x}px, ${point.y}px)`
	}

	function face (body: HTMLElement, from: number, to: number) {
		// The rabbit faces left in its artwork.
		if (to !== from) body.style.setProperty('--facing', to < from ? '1' : '-1')
	}

	// One hop along a parabola, sampled so the arc stays a true curve between different heights.
	async function hop (element: HTMLElement, body: HTMLElement, to: Point, height: number) {
		const from = positions.get(element)!
		face(body, from.x, to.x)
		const frames = Array.from({ length: 13 }, (_, step) => {
			const t = step / 12
			const x = from.x + (to.x - from.x) * t
			const y = from.y + (to.y - from.y) * t - 4 * height * t * (1 - t)
			return { transform: `translate(${x}px, ${y}px)` }
		})
		const flight = element.animate(frames, { duration: 380 + Math.abs(to.y - from.y) * .6, easing: 'linear' })
		await flight.finished
		place(element, to)
		body.animate([
			{ scale: '1 1' }, { scale: '1.12 .84', offset: .3 }, { scale: '1 1' },
		], { duration: 220, easing: 'ease-out' })
		check()
	}

	async function travel (element: HTMLElement, body: HTMLElement, to: Point) {
		const from = positions.get(element)!
		const hops = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 170))
		for (let step = 1; step <= hops; step++) {
			const t = step / hops
			await hop(element, body, {
				x: from.x + (to.x - from.x) * t,
				y: from.y + (to.y - from.y) * t,
			}, step === 1 && to.y > from.y ? 70 : 42)
		}
	}

	async function speak (text: string, ms: number) {
		say.textContent = text
		say.classList.add('is-on')
		await wait(ms)
		say.classList.remove('is-on')
	}

	// Stretch the layer across the whole window, then measure every stop in its coordinates:
	// x from the window's left edge, y from the top of the page content.
	function measure () {
		const shellBox = shell.getBoundingClientRect()
		const windowWidth = document.documentElement.clientWidth
		layer.style.left = `${-shellBox.left}px`
		layer.style.width = `${windowWidth}px`
		const offset = (box: DOMRect) => ({
			left: box.left, right: box.right,
			top: box.top - shellBox.top, bottom: box.bottom - shellBox.top,
		})
		// The free stretch of a row: from the end of its description to its arrow.
		const row = (mood: string) => {
			const link = shell.querySelector(`.project-link[data-rabbit-mood='${mood}']`)!
			const text = document.createRange()
			text.selectNodeContents(link.querySelector('.project-description')!)
			const arrow = offset(link.querySelector(':scope > svg')!.getBoundingClientRect())
			return {
				line: offset(link.getBoundingClientRect()).bottom,
				start: offset(text.getBoundingClientRect()).right + 20,
				end: arrow.left - 12,
				arrowTop: arrow.top,
			}
		}
		// Where a group of a given width starts: centred in the free stretch, never on the text.
		const groupStart = (stretch: ReturnType<typeof row>, width: number) =>
			Math.max(stretch.start, stretch.start + (stretch.end - stretch.start - width) / 2)

		const rabbitWidth = rabbit.offsetWidth
		const rabbitHeight = rabbit.offsetHeight
		const friendWidth = friend.offsetWidth
		const friendLength = friend.offsetHeight // lying down, the friend is as long as it is tall
		const cardsWidth = cards.offsetWidth
		const gap = 8

		const contentRight = shellBox.right
		const offscreen = windowWidth + 60
		const ground = offset(shell.querySelector('.scene-ground')!.getBoundingClientRect()).top
		const carrotX = contentRight - 300

		// Rettungshelden: the friend lies on its side, the rabbit stands to its right.
		const medic = row('medic')
		const patient = groupStart(medic, friendLength + gap + rabbitWidth) + friendLength
		const medicX = patient + gap + rabbitWidth / 2

		// Wizard Party: opponent, cards, player, from left to right.
		const wizard = row('wizard')
		const opponent = groupStart(wizard, friendWidth + gap + cardsWidth + gap + rabbitWidth) + friendWidth / 2
		const table = opponent + friendWidth / 2 + gap + cardsWidth / 2
		const player = table + cardsWidth / 2 + gap + rabbitWidth / 2

		return {
			entry: { x: offscreen, y: ground },
			carrot: { x: carrotX, y: ground },
			eat: { x: carrotX + 12 + rabbitWidth * .4, y: ground },
			patient: { x: patient, y: medic.line },
			medic: { x: medicX, y: medic.line },
			heart: { x: (patient - friendLength / 2 + medicX) / 2, y: medic.line - rabbitHeight * .7 },
			cards: { x: table, y: wizard.line },
			player: { x: player, y: wizard.line },
			opponent: { x: opponent, y: wizard.line },
			// Leaving: a jump straight up beside the cards, then away to the right with the feet
			// above the upper row's arrow, so the rabbits pass over both arrows.
			lift: medic.arrowTop - 8,
			exit: { x: offscreen, y: medic.arrowTop - 8 },
		}
	}

	async function loop () {
		while (!stopped) {
			const at = measure()
			for (const element of [carrot, friend, heart, cards, rabbit, rabbitBody, friendBody]) element.className = element.className.replace(/ is-\S+/g, '')
			carrot.dataset.bites = '0'
			place(carrot, at.carrot)
			place(heart, at.heart)
			place(cards, at.cards)
			place(friend, at.patient)
			friend.classList.add('is-hurt')
			place(rabbit, at.entry)
			face(rabbitBody, 1, 0)

			// Hero: hop in and eat the carrot.
			await travel(rabbit, rabbitBody, at.eat)
			for (const bite of [1, 2, 3]) {
				rabbitBody.animate([{ rotate: '0deg' }, { rotate: '-12deg', offset: .5 }, { rotate: '0deg' }], { duration: 300 })
				carrot.dataset.bites = String(bite)
				await speak(bite === 3 ? 'NOM!' : 'nom', 330)
			}
			await wait(350)

			// Rettungshelden: help the injured friend up.
			await travel(rabbit, rabbitBody, at.medic)
			await speak('hold on!', 900)
			friend.classList.add('is-bandaged')
			await wait(500)
			friend.classList.remove('is-hurt')
			heart.classList.add('is-on')
			await speak('all good ♥', 900)
			await wait(300)

			// Wizard Party: both hop down for a round of cards.
			await Promise.all([
				travel(rabbit, rabbitBody, at.player),
				travel(friend, friendBody, at.opponent),
			])
			face(friendBody, 0, 1)
			face(rabbitBody, 1, 0)
			cards.classList.add('is-dealt')
			await wait(900)
			cards.classList.add('is-flipped')
			await speak('Wizard!', 1100)
			await wait(500)

			// Both leave; a new carrot drops in the hero for the next round.
			const leave = async (element: HTMLElement, body: HTMLElement) => {
				await hop(element, body, { x: positions.get(element)!.x, y: at.lift }, 30)
				await travel(element, body, at.exit)
			}
			await Promise.all([
				leave(rabbit, rabbitBody),
				wait(250).then(() => leave(friend, friendBody)),
			])
			carrot.dataset.bites = '0'
			carrot.classList.add('is-dropping')
			await wait(1200)
		}
	}

	loop().catch(error => {
		if (!(error instanceof Stopped) && !(error instanceof DOMException && error.name === 'AbortError')) throw error
	})

	return () => {
		stopped = true
		for (const animation of layer.getAnimations({ subtree: true })) animation.cancel()
	}
}

export default function RabbitJourney () {
	const layer = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const element = layer.current
		const shell = element?.closest<HTMLElement>('.site-shell')
		if (!element || !shell) return
		const wide = matchMedia(wideScreen)
		const calm = matchMedia(reducedMotion)
		let stop: (() => void) | undefined
		let width = document.documentElement.clientWidth

		function restart () {
			stop?.()
			stop = undefined
			const active = wide.matches && !calm.matches
			shell!.classList.toggle('has-journey', active)
			if (active) stop = journey(element!, shell!)
		}

		// Start right away: ResizeObserver only reports during rendering, which a background tab
		// skips. Afterwards, restart whenever the window width changes, so every stop is measured
		// again.
		restart()
		const resize = new ResizeObserver(() => {
			const current = document.documentElement.clientWidth
			if (current === width) return
			width = current
			restart()
		})
		resize.observe(document.documentElement)
		wide.addEventListener('change', restart)
		calm.addEventListener('change', restart)
		return () => {
			resize.disconnect()
			wide.removeEventListener('change', restart)
			calm.removeEventListener('change', restart)
			stop?.()
			shell.classList.remove('has-journey')
		}
	}, [])

	return (
		<div ref={layer} className='journey' aria-hidden='true'>
			<div className='journey-carrot' data-part='carrot' data-bites='0'>
				<svg viewBox='-16 -96 32 100'>
					<path className='journey-carrot-leaves' d='M -8 -58 L -16 -86 L -1 -58 Z M -3 -58 L 0 -96 L 4 -58 Z M 2 -58 L 15 -84 L 9 -58 Z' />
					<path className='journey-carrot-root' d='M -13 -62 L 13 -62 L 0 4 Z' />
				</svg>
			</div>
			<div className='journey-heart' data-part='heart'>♥</div>
			<div className='journey-cards' data-part='cards'>
				<span /><span /><span className='journey-wizard-card'>W</span>
			</div>
			<div className='journey-rabbit journey-friend' data-part='friend'>
				<div className='journey-body' data-part='friend-body'>
					<RabbitLogo />
					<span className='journey-bandage' />
				</div>
			</div>
			<div className='journey-rabbit' data-part='rabbit'>
				<div className='journey-body' data-part='rabbit-body'>
					<RabbitLogo />
					<svg className='journey-accessory journey-hat' data-accessory='hat' viewBox='200 60 260 350'>
						<path d='M 215 372 L 425 340 L 330 70 Z' fill='#5b3fc4' />
						<path d='M 330 70 L 425 340 L 372 334 Z' fill='#43309a' />
						<path d='M 200 380 Q 320 330 445 335 L 450 360 Q 320 360 205 405 Z' fill='#43309a' />
						<path d='M 318 170 l 10 22 24 3 -18 16 5 24 -21 -12 -21 12 5 -24 -18 -16 24 -3 Z' fill='#f2c94c' />
					</svg>
					<span className='journey-accessory journey-medic' data-accessory='medic'><RettungsheldenLogo /></span>
				</div>
				<span className='journey-say' data-part='say' />
				<span className='journey-accessory journey-hello' data-accessory='hello'>hi!</span>
			</div>
		</div>
	)
}
