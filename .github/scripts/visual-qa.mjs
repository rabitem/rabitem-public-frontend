import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

// Keep browser QA in CI alongside the production build.
const runnerDirectory = process.env.RUNNER_TEMP
assert.ok(runnerDirectory, 'Visual QA must run in GitHub Actions')
const { chromium } = await import(pathToFileURL(join(
	runnerDirectory, 'portfolio-browser/node_modules/playwright/index.mjs',
)).href)
const outputDirectory = join(runnerDirectory, 'portfolio-visuals')
await mkdir(outputDirectory, { recursive: true })
const origin = 'http://127.0.0.1:3000'

// The hero scene's state: whether the rabbit animates, whether the rabbit or carrot overlaps any
// hero text, and whether both stay inside the viewport.
async function scene (page) {
	return page.evaluate(() => {
		const union = elements => elements.map(element => element.getBoundingClientRect()).reduce((a, r) => ({
			left: Math.min(a.left, r.left), top: Math.min(a.top, r.top),
			right: Math.max(a.right, r.right), bottom: Math.max(a.bottom, r.bottom),
		}), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity })
		const rabbit = union([...document.querySelectorAll('.scene-shard')])
		const carrot = union([document.querySelector('.scene-carrot')])
		const text = [...document.querySelectorAll('.intro-copy > *')].map(element => element.getBoundingClientRect())
		const hits = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
		return {
			animation: getComputedStyle(document.querySelector('.scene-rabbit')).animationName,
			overlapsText: text.some(box => hits(rabbit, box) || hits(carrot, box)),
			inView: [rabbit, carrot].every(box => box.left >= 0 && box.right <= innerWidth),
		}
	})
}

// Which accessories are showing on the visible rabbit (the scene's or the journey's), read once
// their transitions have finished.
async function accessories (page) {
	await page.waitForTimeout(400)
	return page.evaluate(() => {
		// The journey replaces the scene's rabbit while it runs; read only the active rabbit.
		const active = document.querySelector('.has-journey') ? '.journey' : '.scene-rabbit'
		return [...document.querySelectorAll(`${active} [data-accessory]`)]
			.filter(element => getComputedStyle(element).opacity === '1')
			.map(element => element.dataset.accessory)
	})
}

// Watches one full journey loop: which stations it reached, and whether any rabbit, the cards or
// the carrot ever covered text, a row arrow or a project illustration, or widened the page.
async function journeyLoop (page) {
	return page.evaluate(() => new Promise(resolve => {
		const part = name => document.querySelector(`[data-part='${name}']`)
		const range = document.createRange()
		const box = element => {
			if (!element.matches('.project-name, .project-description, .projects h2')) return element.getBoundingClientRect()
			range.selectNodeContents(element)
			return range.getBoundingClientRect()
		}
		const hits = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1
		const blockers = [...document.querySelectorAll(
			'.intro-copy > *, .projects h2, .project-name, .project-description, .project-link > svg, .wizard-card-hand, .rettungshelden-mark',
		)]
		const reached = new Set()
		const overlaps = new Set()
		let overflow = false
		const started = performance.now()
		const timer = setInterval(() => {
			const fixed = blockers.map(box)
			const movers = [
				['rabbit', part('rabbit-body').querySelector('svg')],
				['friend', part('friend-body').querySelector('svg')],
				['cards', part('cards').classList.contains('is-dealt') ? part('cards') : null],
			]
			for (const [name, element] of movers) {
				if (element && fixed.some(other => hits(element.getBoundingClientRect(), other))) overlaps.add(name)
			}
			if (part('carrot').dataset.bites === '3') reached.add('carrot')
			if (part('friend').classList.contains('is-bandaged')) reached.add('rescue')
			if (part('cards').classList.contains('is-flipped')) reached.add('cards')
			if (document.documentElement.scrollWidth > document.documentElement.clientWidth) overflow = true
			if (performance.now() - started > 14000) {
				clearInterval(timer)
				resolve({ reached: [...reached].sort(), overlaps: [...overlaps], overflow })
			}
		}, 50)
	}))
}

// The highest red, green or blue value in a generated image, read through a canvas.
async function brightestPixel (page, path) {
	return page.evaluate(async src => {
		const img = new Image()
		img.src = src
		await img.decode()
		const canvas = Object.assign(document.createElement('canvas'), { width: img.naturalWidth, height: img.naturalHeight })
		const context = canvas.getContext('2d')
		context.drawImage(img, 0, 0)
		const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
		let max = 0
		for (let i = 0; i < pixels.length; i += 4) max = Math.max(max, pixels[i], pixels[i + 1], pixels[i + 2])
		return max
	}, path)
}
const browser = await chromium.launch()

try {
	for (const viewport of [
		{ name: 'desktop', width: 1440, height: 900 },
		{ name: 'laptop', width: 1280, height: 800 },
		{ name: 'tablet', width: 768, height: 1024 },
		{ name: 'mobile', width: 390, height: 844 },
		{ name: 'compact', width: 320, height: 640 },
	]) {
		const context = await browser.newContext({
			viewport: { width: viewport.width, height: viewport.height },
			reducedMotion: 'reduce',
		})
		const page = await context.newPage()
		const errors = []
		page.on('pageerror', error => errors.push(error.message))
		await page.goto(origin, { waitUntil: 'networkidle' })
		await page.evaluate(() => document.fonts.ready)
		assert.match(await page.title(), /Felix Huisinga/)
		assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
		assert.deepEqual(await scene(page), { animation: 'none', overlapsText: false, inView: true },
			'With reduced motion the rabbit rests beside the carrot, clear of the text')

		for (const [name, href] of [
			['Say hello', 'mailto:developer@rabitem.de'],
			['GitHub', 'https://github.com/rabitem'],
			['LinkedIn', 'https://linkedin.com/in/felixhuisinga'],
			['Wizard Party', 'https://wizardparty.fun'],
		]) {
			const link = page.getByRole('link', { name: new RegExp(name) })
			assert.ok(await link.isVisible(), name + ' must be visible')
			assert.equal(await link.getAttribute('href'), href)
			assert.ok((await link.boundingBox()).height >= 44, name + ' needs a touch target')
		}
		assert.ok(await page.evaluate(() =>
			document.documentElement.scrollWidth <= document.documentElement.clientWidth,
		), 'No horizontal overflow')
		assert.equal(await page.locator('#paper, a[download], a[href$=".pdf"]').count(), 0)
		assert.equal(await page.locator('a[href^="/blog"], a[href^="/research"]').count(), 0)
		assert.equal(await page.locator('button').count(), 0, 'No cookie or scroll controls')
		assert.equal(await page.evaluate(() => localStorage.length), 0)
		assert.equal((await context.cookies()).length, 0)

		await page.keyboard.press('Tab')
		assert.ok(await page.getByRole('link', { name: 'Deutsche Bank' }).evaluate(
			link => link === document.activeElement && getComputedStyle(link).outlineWidth !== '0px',
		), 'Keyboard focus is visible')
		await page.screenshot({
			path: join(outputDirectory, 'portfolio-home-' + viewport.name + '.png'),
			fullPage: true,
		})
		assert.deepEqual(errors, [], 'No client errors')
		console.log('One-page QA passed: ' + viewport.name)
		await context.close()
	}

	// Below 1024 px the journey stays off and the hero scene's own rabbit plays.
	const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 }, reducedMotion: 'no-preference' })
	const tabletPage = await tabletContext.newPage()
	await tabletPage.goto(origin)
	assert.equal(await tabletPage.locator('.site-shell.has-journey').count(), 0, 'No journey on a tablet')
	assert.equal((await scene(tabletPage)).animation, 'scene-hop', 'The hero rabbit animates on a tablet')
	await tabletContext.close()

	const motionContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
	const motionPage = await motionContext.newPage()
	await motionPage.goto(origin)
	await motionPage.locator('.site-shell.has-journey').waitFor()
	assert.deepEqual(await journeyLoop(motionPage), {
		reached: ['cards', 'carrot', 'rescue'],
		overlaps: [],
		overflow: false,
	}, 'One journey loop visits every station without covering text or widening the page')
	assert.deepEqual(await accessories(motionPage), [], 'No accessory before any interaction')
	const reactions = [
		[motionPage.locator('.about').getByRole('link', { name: 'Rettungshelden' }), 'medic'],
		[motionPage.getByRole('link', { name: /GitHub/ }), 'hello'],
		[motionPage.getByRole('link', { name: /Wizard Party/ }), 'hat'],
	]
	for (const [link, accessory] of reactions) {
		await link.hover()
		assert.deepEqual(await accessories(motionPage), [accessory], accessory + ' shows on hover')
	}
	await motionPage.mouse.move(0, 0)
	// Keyboard users get the same reactions; :focus-visible needs real Tab presses, not focus().
	for (const [link, accessory] of reactions) {
		for (let presses = 0; presses < 12 && !await link.evaluate(element => element === document.activeElement); presses++) {
			await motionPage.keyboard.press('Tab')
		}
		assert.deepEqual(await accessories(motionPage), [accessory], accessory + ' shows on keyboard focus')
	}
	// Generated images can render the logo in the background colour; check it is actually visible.
	for (const icon of ['/icon/512', '/apple-icon']) {
		assert.ok(await brightestPixel(motionPage, icon) > 200, icon + ' shows a light logo')
	}
	await motionContext.close()

	// HTTP-level checks (metadata, redirects, sitemap, status codes) live in tests/site.test.mjs.
	const context = await browser.newContext({ javaScriptEnabled: false })
	const page = await context.newPage()
	await page.goto(origin)
	assert.ok(await page.getByRole('link', { name: 'GitHub' }).isVisible(),
		'Core page works without JavaScript')
	for (const [route, title] of [['imprint', 'Impressum'], ['privacy', 'Datenschutz']]) {
		await page.goto(origin + '/' + route)
		assert.ok(await page.getByRole('heading', { name: title, exact: true }).isVisible())
		await page.getByRole('link', { name: 'Zurück' }).click()
		assert.equal(new URL(page.url()).pathname, '/')
	}
	await page.goto(origin + '/missing-page')
	assert.ok(await page.getByRole('heading', { name: 'Page not found.' }).isVisible())
	await context.close()
} finally {
	await browser.close()
}
