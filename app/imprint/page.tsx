import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
	title: 'Impressum',
	alternates: { canonical: '/imprint' },
	openGraph: { title: 'Impressum', url: '/imprint' },
}

export default function Imprint () {
	return (
		<LegalPage title='Impressum'>
			<section>
            <h2>
              Anbieter gemäß § 5 DDG
            </h2>
            <div>
              <p>Felix Huisinga</p>
              <p>Mannstaedtstraße 16</p>
              <p>65187 Wiesbaden</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2>
              Kontakt
            </h2>
            <div>
              <p>E-Mail: developer@rabitem.de</p>
              <p>Web: https://rabitem.de</p>
            </div>
          </section>

          <section>
            <h2>
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <div>
              <p>USt-IdNr. gemäß § 27a Umsatzsteuergesetz: DE454965673</p>
            </div>
          </section>

          <section>
            <h2>
              Redaktionell verantwortlich gemäß § 18 Abs. 2 MStV
            </h2>
            <div>
              <p>Felix Huisinga</p>
              <p>Mannstaedtstraße 16</p>
              <p>65187 Wiesbaden</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2>
              Zentrale Kontaktstelle (Art. 12 DSA)
            </h2>
            <p>
              Zentrale Kontaktstelle für Behörden, die Kommission und das Gremium
              sowie für Nutzerinnen und Nutzer gemäß Art. 11 und Art. 12 der
              Verordnung (EU) 2022/2065 (Digital Services Act):
              developer@rabitem.de. Die Kommunikation ist in deutscher und
              englischer Sprache möglich.
            </p>
          </section>

          <section>
            <h2>
              Streitbeilegung
            </h2>
            <p>
              Hinweis: Die Plattform der Europäischen Kommission zur
              Online-Streitbeilegung (OS) gemäß Art. 14 Abs. 1 ODR-VO wurde zum
              20. Juli 2025 eingestellt. Eine Verlinkung ist daher nicht mehr
              erforderlich. Ich bin nicht bereit und nicht verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle im Sinne des § 36
              Verbraucherstreitbeilegungsgesetz (VSBG) teilzunehmen.
            </p>
          </section>

          <section>
            <h2>
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf dieser Website nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG bin ich als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
              Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt.
            </p>
          </section>

          <section>
            <h2>
              Haftung für Links
            </h2>
            <p>
              Diese Website enthält Links zu externen Websites Dritter, auf
              deren Inhalte ich keinen Einfluss habe. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder
              Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine
              permanente inhaltliche Kontrolle der verlinkten Seiten ist
              ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden
              derartige Links umgehend entfernt.
            </p>
          </section>

          <section>
            <h2>
              Urheberrecht
            </h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
              dieser Website unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
              der schriftlichen Zustimmung des jeweiligen Autors bzw.
              Erstellers. Downloads und Kopien dieser Seite sind nur für den
              privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
          </section>
		</LegalPage>
	)
}
