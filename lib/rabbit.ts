// The rabbit logo as data: each triangle is [x1, y1, x2, y2, x3, y3, shade]. The logo, the icons,
// the share image and the hero animation all draw from this list.

type Triangle = readonly [number, number, number, number, number, number, number]

export const rabbitViewBox = { x: 175, y: 95, width: 700, height: 730 } as const

// The point between the feet, which the hero scene stands on the ground.
export const rabbitFeet = { x: 525, y: 800 } as const

export const rabbitTriangles: readonly Triangle[] = [
	[200, 450, 300, 350, 350, 450, 0.9],
	[300, 350, 380, 350, 350, 450, 0.7],
	[300, 350, 250, 150, 340, 350, 0.8],
	[340, 350, 300, 120, 380, 350, 0.6],
	[380, 350, 450, 400, 350, 450, 0.5],
	[350, 450, 450, 400, 450, 550, 0.85],
	[350, 450, 450, 550, 300, 550, 0.75],
	[300, 550, 450, 550, 400, 700, 0.65],
	[300, 550, 400, 700, 300, 800, 0.9],
	[300, 800, 400, 700, 400, 800, 0.55],
	[450, 550, 450, 700, 400, 700, 0.45],
	[450, 400, 650, 450, 450, 550, 0.95],
	[450, 550, 650, 450, 600, 650, 0.8],
	[450, 550, 600, 650, 450, 700, 0.6],
	[600, 650, 550, 800, 450, 700, 0.5],
	[650, 450, 750, 600, 600, 650, 0.85],
	[750, 600, 730, 650, 600, 650, 0.7],
	[600, 650, 750, 600, 700, 800, 0.9],
	[600, 650, 700, 800, 550, 800, 0.65],
	[750, 600, 850, 580, 820, 650, 0.8],
	[750, 600, 820, 650, 730, 650, 0.55],
]

export function trianglePath ([x1, y1, x2, y2, x3, y3]: Triangle) {
	return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`
}
