'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error ({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => { console.error(error) }, [error])

	return (
		<main className='status-page'>
			<h1>Something went wrong.</h1>
			<p>Please try again, or return to the homepage.</p>
			<button onClick={reset}>Try again</button>
			{' · '}
			<Link href='/'>Back to home</Link>
		</main>
	)
}
