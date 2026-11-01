import { site } from '@/lib/site'
import RabbitLogo from './RabbitLogo'

// The rabbit on the page background. The logo fills two thirds of the square, which keeps it
// inside the safe zone when a platform masks the icon to a circle. next/og resolves the logo's
// currentColor from the parent's CSS color, not from the SVG's color attribute.
export default function AppIcon ({ size }: { size: number }) {
	const logo = Math.round(size * 2 / 3)
	return (
		<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: site.colors.background, color: site.colors.foreground }}>
			<RabbitLogo width={logo} height={logo} />
		</div>
	)
}
