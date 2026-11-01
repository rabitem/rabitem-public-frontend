// HTTP contract tests for a running production build:
//   npm run build && npm start      (in one terminal)
//   npm run test:site               (in another)
// SITE_ORIGIN points them at another server. Expected values are written out here on purpose,
// so a wrong value in lib/site.ts fails a test instead of being copied into it.
import assert from 'node:assert/strict'
import test from 'node:test'

const origin = process.env.SITE_ORIGIN ?? 'http://127.0.0.1:3000'
const publicUrl = 'https://rabitem.de'

async function get (path, init) {
	return fetch(new URL(path, origin), { redirect: 'manual', ...init })
}

async function html (path) {
	const response = await get(path)
	assert.equal(response.status, 200, path)
	return response.text()
}

function meta (page, key) {
	const tag = page.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`))
	return tag?.[1].replaceAll('&amp;', '&')
}

function link (page, rel) {
	return [...page.matchAll(new RegExp(`<link rel="${rel}"[^>]*>`, 'g'))].map(([tag]) => ({
		href: tag.match(/href="([^"]*)"/)[1],
		size: Number(tag.match(/sizes="(\d+)x\d+"/)?.[1]) || undefined,
	}))
}

// Width and height from the PNG header, plus a check that it is a PNG at all.
async function png (path) {
	const response = await get(path)
	assert.equal(response.status, 200, path)
	assert.equal(response.headers.get('content-type'), 'image/png', path)
	const bytes = Buffer.from(await response.arrayBuffer())
	assert.equal(bytes.subarray(1, 4).toString(), 'PNG', path)
	return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

// Image URLs in the metadata are absolute on the public domain; fetch them from the test server.
function local (url) {
	assert.ok(url.startsWith(publicUrl + '/'), `${url} is on ${publicUrl}`)
	return url.slice(publicUrl.length)
}

test('homepage metadata describes the site', async () => {
	const page = await html('/')
	assert.match(page, /<html lang="en"/)
	assert.match(page, /<title>Felix Huisinga · Somebunny has to ship it\.<\/title>/)
	assert.equal(meta(page, 'description'),
		'Felix Huisinga writes software at Deutsche Bank, runs Rettungshelden and builds Wizard Party, an open-source card game.')
	assert.deepEqual(link(page, 'canonical').map(l => l.href), [publicUrl])
	assert.equal(meta(page, 'og:type'), 'profile')
	assert.equal(meta(page, 'og:url'), publicUrl)
	assert.equal(meta(page, 'og:title'), 'Felix Huisinga · Somebunny has to ship it.')
	assert.equal(meta(page, 'twitter:card'), 'summary_large_image')
	assert.equal(meta(page, 'twitter:creator'), '@r_a_b_i_t_e_m')
})

test('share images are 1200x630 PNGs for Open Graph and X', async () => {
	const page = await html('/')
	for (const key of ['og:image', 'twitter:image']) {
		const url = meta(page, key)
		assert.ok(url, `${key} is set`)
		assert.deepEqual(await png(local(url)), { width: 1200, height: 630 }, key)
		assert.equal(meta(page, `${key}:alt`), 'Felix Huisinga: Somebunny has to ship it.')
	}
})

test('every declared icon exists at its declared size', async () => {
	const page = await html('/')
	const icons = [...link(page, 'icon'), ...link(page, 'apple-touch-icon')]
	assert.deepEqual(icons.map(icon => icon.size).sort((a, b) => a - b), [32, 180, 192, 512])
	for (const icon of icons) {
		assert.deepEqual(await png(icon.href), { width: icon.size, height: icon.size }, icon.href)
	}
})

test('the manifest offers 192 and 512 px icons for install prompts', async () => {
	const response = await get('/manifest.webmanifest')
	assert.equal(response.status, 200)
	const manifest = await response.json()
	assert.equal(manifest.name, 'Felix Huisinga')
	assert.equal(manifest.background_color, '#101110')
	for (const size of [192, 512]) {
		const icons = manifest.icons.filter(icon => icon.sizes === `${size}x${size}`)
		assert.deepEqual(icons.map(icon => icon.purpose).sort(), ['any', 'maskable'], `${size} px purposes`)
		assert.deepEqual(await png(icons[0].src), { width: size, height: size })
	}
})

test('structured data names the person, profiles and company', async () => {
	const page = await html('/')
	const scripts = [...page.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)]
	assert.equal(scripts.length, 1, 'one JSON-LD graph')
	const graph = JSON.parse(scripts[0][1])['@graph']
	const person = graph.find(node => node['@type'] === 'Person')
	assert.equal(person.name, 'Felix Huisinga')
	assert.deepEqual([...person.sameAs].sort(), [
		'https://github.com/rabitem',
		'https://linkedin.com/in/felixhuisinga',
		'https://x.com/r_a_b_i_t_e_m',
	])
	const company = graph.find(node => node['@type'] === 'Organization')
	assert.equal(company.name, 'Rettungshelden GmbH')
	assert.equal(company.url, 'https://rettungshelden.com')
	assert.ok(person.worksFor.some(employer => employer['@id'] === company['@id']), 'works for the company')
	assert.ok(graph.some(node => node['@type'] === 'WebSite' && node.url === publicUrl))
})

test('robots and sitemap list exactly the public pages', async () => {
	const robots = await (await get('/robots.txt')).text()
	assert.match(robots, /^Sitemap: https:\/\/rabitem\.de\/sitemap\.xml$/m)
	const sitemap = await (await get('/sitemap.xml')).text()
	const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
	assert.deepEqual(urls, [publicUrl, `${publicUrl}/imprint`, `${publicUrl}/privacy`])
})

for (const [path, title] of [['/imprint', 'Impressum'], ['/privacy', 'Datenschutz']]) {
	test(`${title} is German and canonical at ${path}`, async () => {
		const page = await html(path)
		assert.match(page, /<main class="legal-page" lang="de">/)
		assert.match(page, new RegExp(`<h1>${title}</h1>`))
		assert.match(page, new RegExp(`<title>${title} \\| Felix Huisinga</title>`))
		assert.deepEqual(link(page, 'canonical').map(l => l.href), [publicUrl + path])
		assert.equal(meta(page, 'og:url'), publicUrl + path)
	})
}

test('retired URLs redirect permanently to the homepage', async () => {
	for (const path of [
		'/research/order-certified-compilation',
		'/blog/order-certified-compilation',
		'/blog/order-certified-compilation-agent-harnesses',
	]) {
		const response = await get(path)
		assert.equal(response.status, 308, path)
		assert.equal(new URL(response.headers.get('location'), origin).pathname, '/', path)
	}
})

test('the withdrawn paper and unknown pages return 404', async () => {
	assert.equal((await get('/papers/order-certified-compilation-v2.1.pdf')).status, 404)
	const missing = await get('/missing-page')
	assert.equal(missing.status, 404)
	assert.match(await missing.text(), /Page not found\./)
})
