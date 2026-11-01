import type { SVGProps } from 'react'
import { rabbitTriangles, rabbitViewBox, trianglePath } from '@/lib/rabbit'

const { x, y, width, height } = rabbitViewBox

export default function RabbitLogo (props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox={`${x} ${y} ${width} ${height}`} width={width} height={height}
			fill='currentColor' stroke='#101110' strokeWidth={6}
			aria-hidden={props['aria-label'] ? undefined : true}
			focusable='false' {...props}>
			{rabbitTriangles.map(triangle => (
				<path key={trianglePath(triangle)} d={trianglePath(triangle)} opacity={triangle[6]} />
			))}
		</svg>
	)
}
