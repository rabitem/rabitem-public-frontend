import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	async redirects () {
		return [
			'/research/order-certified-compilation',
			'/blog/order-certified-compilation',
			'/blog/order-certified-compilation-agent-harnesses',
		].map(source => ({
			source,
			destination: '/',
			permanent: true,
		}))
	},
}

export default nextConfig
