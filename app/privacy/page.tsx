import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
	title: 'Datenschutz',
	alternates: { canonical: '/privacy' },
	openGraph: { title: 'Datenschutz', url: '/privacy' },
}

export default function Privacy () {
	return (
		<LegalPage title='Datenschutz'>
			<section>
            <h2>
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlicher im Sinne des Art. 4 Nr. 7 DSGVO für die
              Datenverarbeitung auf dieser Website ist:
            </p>
            <div>
              <p>Felix Huisinga</p>
              <p>Mannstaedtstraße 16</p>
              <p>65187 Wiesbaden, Deutschland</p>
              <p>E-Mail: developer@rabitem.de</p>
            </div>
            <p>
              Ein Datenschutzbeauftragter ist nicht bestellt, da die
              gesetzlichen Voraussetzungen (§ 38 BDSG) nicht erfüllt sind.
            </p>
          </section>

          <section>
            <h2>
              2. Datenschutz auf einen Blick
            </h2>
            <div>
              <h3>Allgemeiner Hinweis</h3>
              <p>
                Diese Datenschutzerklärung informiert Sie gemäß Art. 13 und
                Art. 14 DSGVO sowie nach § 25 TDDDG (Telekommunikation-
                Digitale-Dienste-Datenschutz-Gesetz) über Art, Umfang und
                Zweck der Verarbeitung personenbezogener Daten auf dieser
                Website. Personenbezogene Daten sind alle Informationen,
                die sich auf eine identifizierte oder identifizierbare
                natürliche Person beziehen (Art. 4 Nr. 1 DSGVO).
              </p>
              <h3>Grundsatz der Datenminimierung</h3>
              <p>
                Diese Website ist als statische Portfolio-Seite konzipiert.
                Es werden weder Formulare noch Nutzerkonten angeboten;
                eine aktive Eingabe personenbezogener Daten durch Sie
                findet nicht statt. Die Verarbeitung beschränkt sich auf
                technisch erforderliche Verbindungsdaten beim Hosting-Anbieter.
              </p>
            </div>
          </section>

          <section>
            <h2>
              3. Hosting (Vercel)
            </h2>
            <p>
              Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, USA (&bdquo;Vercel&ldquo;) gehostet. Beim
              Aufruf der Seite werden technisch notwendige
              Verbindungsdaten (u. a. IP-Adresse, Zeitpunkt der Anfrage,
              User-Agent, angeforderte Ressource, Referrer) an Vercel
              übermittelt und in Server-Logfiles verarbeitet. Die
              Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f
              DSGVO (berechtigtes Interesse an einer sicheren, stabilen
              und leistungsfähigen Bereitstellung des Online-Angebots).
            </p>
            <p>
              Mit Vercel wurde ein Auftragsverarbeitungsvertrag (Data
              Processing Addendum) gemäß Art. 28 DSGVO abgeschlossen.
              Soweit Daten in die USA übermittelt werden, erfolgt dies
              auf Grundlage der EU-Standardvertragsklauseln (Art. 46
              Abs. 2 lit. c DSGVO). Vercel ist unter dem EU-US Data
              Privacy Framework zertifiziert, soweit anwendbar.
            </p>
          </section>

          <section>
            <h2>
              4. Server-Logfiles
            </h2>
            <p>
              Der Hosting-Provider erhebt und speichert automatisch
              Informationen in &bdquo;Server-Logfiles&ldquo;, die Ihr
              Browser übermittelt: IP-Adresse, Datum und Uhrzeit der
              Anfrage, Zeitzonendifferenz, Inhalt der Anforderung,
              HTTP-Statuscode, übertragene Datenmenge, Referrer-URL und
              User-Agent. Diese Daten werden nicht mit anderen
              Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO. Die Speicherdauer richtet sich nach
              den Vorgaben des Hosters und ist auf das für den
              Betriebszweck Erforderliche begrenzt.
            </p>
          </section>

          <section><h2>5. Reichweitenmessung</h2><p>Diese Website bindet keine Vercel Analytics, Speed Insights oder andere Analyse-Skripte ein. Es findet keine clientseitige Reichweitenmessung statt. Die technisch erforderliche Verarbeitung von Verbindungsdaten durch den Hosting-Anbieter ist oben beschrieben.</p></section>

          <section><h2>6. Cookies &amp; lokaler Speicher</h2><p>Die Website setzt selbst keine Cookies und speichert keine Einstellungen oder Kennungen im lokalen Speicher Ihres Browsers.</p></section>

          <section>
            <h2>
              7. Verschlüsselung (TLS)
            </h2>
            <p>
              Diese Website nutzt eine TLS-Verschlüsselung aus
              Sicherheitsgründen und zum Schutz der Übertragung
              vertraulicher Inhalte. Eine verschlüsselte Verbindung
              erkennen Sie am &bdquo;https://&ldquo;-Präfix und am
              Schloss-Symbol in der Adresszeile Ihres Browsers.
            </p>
          </section>

          <section>
            <h2>
              8. Ihre Rechte als betroffene Person
            </h2>
            <p>
              Sie haben nach der DSGVO jederzeit folgende Rechte:
            </p>
            <ul>
              <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>
                Löschung (&bdquo;Recht auf Vergessenwerden&ldquo;,
                Art. 17 DSGVO)
              </li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>
                Widerspruch gegen Verarbeitungen, die auf Art. 6 Abs. 1
                lit. f DSGVO beruhen (Art. 21 DSGVO)
              </li>
              <li>
                Widerruf einer erteilten Einwilligung mit Wirkung für die
                Zukunft (Art. 7 Abs. 3 DSGVO)
              </li>
              <li>
                Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO),
                insbesondere beim Hessischen Beauftragten für Datenschutz
                und Informationsfreiheit
              </li>
            </ul>
            <p>
              Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung
              an developer@rabitem.de.
            </p>
          </section>

          <section>
            <h2>
              9. Speicherdauer
            </h2>
            <p>
              Personenbezogene Daten werden nur so lange gespeichert,
              wie es für die genannten Zwecke erforderlich ist oder wie
              es gesetzliche Aufbewahrungspflichten (u. a. HGB, AO)
              vorschreiben. Server-Logfiles werden in kurzer Frist
              gelöscht oder anonymisiert.
            </p>
          </section>

          <section>
            <h2>
              10. Automatisierte Entscheidungen / Profiling
            </h2>
            <p>
              Eine automatisierte Entscheidungsfindung einschließlich
              Profiling gemäß Art. 22 DSGVO findet auf dieser Website
              nicht statt.
            </p>
          </section>

          <section>
            <h2>
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Diese Datenschutzerklärung wird regelmäßig an geänderte
              Rechtslagen oder an Anpassungen der Dienste angepasst.
              Stand: Oktober 2026.
            </p>
          </section>
		</LegalPage>
	)
}
