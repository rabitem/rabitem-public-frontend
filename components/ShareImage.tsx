import { site } from '@/lib/site'
import RabbitLogo from './RabbitLogo'

export const shareImageSize = { width: 1200, height: 630 }
export const shareImageAlt = `${site.name}: ${site.tagline}`

const { background, foreground, muted } = site.colors
const ground = 520

// Fixed positions so every build renders the same image.
const stars = [
	[64, 80], [190, 210], [330, 60], [470, 150], [610, 40], [700, 250], [820, 120], [960, 70],
	[1080, 190], [1140, 40], [120, 380], [540, 330], [880, 300], [1010, 360], [260, 470],
]

// The Open Graph and X preview: the rabbit from the site's banner beside a carrot, plus the slogan.
// Rendered by next/og, which supports a subset of CSS: every element with children needs a display.
export default function ShareImage () {
	return (
		<div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background, color: foreground }}>
			{stars.map(([x, y]) => (
				<div key={`${x}-${y}`} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, background: foreground, opacity: 0.3 }} />
			))}
			<div style={{ position: 'absolute', left: 0, top: ground, width: '100%', height: 3, background: foreground, opacity: 0.1 }} />
			<div style={{ display: 'flex', flexDirection: 'column', padding: '96px 0 0 80px', width: 640 }}>
				<div style={{ fontSize: 26, color: muted, letterSpacing: 4 }}>RABITEM.DE</div>
				<div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1, marginTop: 28 }}>{site.name}</div>
				<div style={{ fontSize: 42, marginTop: 32 }}>{site.tagline}</div>
			</div>
			<svg width={56} height={150} viewBox='-14 -96 28 100' style={{ position: 'absolute', left: 700, top: ground - 146 }}>
				<path d='M -8 -58 L -16 -86 L -1 -58 Z M -3 -58 L 0 -96 L 4 -58 Z M 2 -58 L 15 -84 L 9 -58 Z' fill='#5fbf4a' stroke={background} strokeWidth={1.5} />
				<path d='M -13 -62 L 13 -62 L 0 4 Z' fill='#ff8a2a' stroke={background} strokeWidth={2} />
				<path d='M 0 -62 L 13 -62 L 0 4 Z' fill={background} opacity={0.25} />
			</svg>
			<div style={{ position: 'absolute', left: 760, top: ground - 300, display: 'flex' }}>
				<RabbitLogo width={300} height={313} />
			</div>
		</div>
	)
}
