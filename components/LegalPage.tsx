import Link from 'next/link'
import type { ReactNode } from 'react'

// The frame shared by the German legal pages; the legal text itself stays in each page.
export default function LegalPage ({ title, children }: { title: string, children: ReactNode }) {
	return (
		<main className='legal-page' lang='de'>
			<Link href='/' className='legal-back'>← Zurück</Link>
			<h1>{title}</h1>
			{children}
		</main>
	)
}
