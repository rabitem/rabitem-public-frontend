import { ImageResponse } from 'next/og'
import AppIcon from '@/components/AppIcon'

export const contentType = 'image/png'

// Served at /icon/32, /icon/192 and /icon/512. The manifest uses the large ones.
export function generateImageMetadata () {
	return [32, 192, 512].map(size => ({ id: String(size), size: { width: size, height: size }, contentType }))
}

export default async function Icon ({ id }: { id: Promise<string> }) {
	const size = Number(await id)
	return new ImageResponse(<AppIcon size={size} />, { width: size, height: size })
}
