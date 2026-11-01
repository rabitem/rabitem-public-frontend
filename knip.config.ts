import type { KnipConfig } from 'knip'

const config: KnipConfig = {
	project: ['{app,components,lib}/**/*.{css,ts,tsx}', '*.config.{ts,mts,mjs}'],
}

export default config
