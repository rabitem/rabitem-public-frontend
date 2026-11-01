import Link from 'next/link'

export default function NotFound () {
	return (
		<main className='status-page'>
			<p className='eyebrow'>404</p>
			<h1>Page not found.</h1>
			<p>The page may have moved. You can find my projects on the homepage.</p>
			<Link href='/'>Back to home</Link>
		</main>
	)
}
