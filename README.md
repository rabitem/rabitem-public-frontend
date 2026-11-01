# rabitem.de

The source of [rabitem.de](https://rabitem.de), the personal one-page website of Felix Huisinga.

It is one page: a short introduction, contact and profile links, two project links and an
animated low-poly rabbit. Impressum and Datenschutz are separate pages. There are no analytics
scripts, cookies or browser storage.

## Run it locally

You need the Node.js version in [`.node-version`](.node-version). No environment variables are
required.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serves the production build |
| `npm test` | Unit tests for the CI automation scripts |
| `npm run test:site` | HTTP tests against a running production build (start one with `npm start`) |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript without emitting |
| `npm run knip` | Finds unused files, exports and dependencies |

## How it is built

Next.js App Router, React and TypeScript, with plain CSS in [`app/globals.css`](app/globals.css)
on top of Tailwind's base layer. Every route is prerendered as static content; the only client
component is the rabbit journey below.

| Path | Purpose |
| --- | --- |
| [`lib/site.ts`](lib/site.ts) | Single source for names, links, projects and colours. Change content here. |
| [`lib/structured-data.ts`](lib/structured-data.ts) | The schema.org graph (website, person, company) built from `lib/site.ts` |
| `app/` | Routes only: the homepage, the legal pages, metadata, icons, share images, sitemap, robots and manifest |
| `components/` | The page sections, the rabbit logo, and the share image and app icon rendered by `next/og` |
| [`lib/rabbit.ts`](lib/rabbit.ts) | The rabbit's triangles, shared by the logo, the icons, the share image and the hero animation |
| `next.config.ts` | Permanent redirects for retired URLs |
| `tests/` | HTTP tests for a running build |

Icons (32, 180, 192 and 512 px) and the Open Graph and X share images are generated at build
time from [`components/RabbitLogo.tsx`](components/RabbitLogo.tsx), so the logo has one source.

The rabbit comes in two versions:

- [`components/RabbitScene.tsx`](components/RabbitScene.tsx) is an inline SVG in the hero,
  animated with CSS only: it hops in, eats a carrot, pops into its triangles and starts over.
  Visitors get this one without JavaScript, below 1024 px, or with reduced motion (then it sits
  still beside its carrot).
- [`components/RabbitJourney.tsx`](components/RabbitJourney.tsx) takes over on wider screens. It
  measures the page and tours it: it eats the carrot in the hero, jumps down to the Rettungshelden
  row to bandage an injured friend, and plays a round of Wizard with that friend on the Wizard
  Party row, always beside the text, never on it.

Links carry a `data-rabbit-mood` attribute, and hovering or focusing one dresses either rabbit up:
a wizard hat for Wizard Party, the Rettungshelden logo for Rettungshelden, a greeting for the
contact links.

Merging into `main` deploys to production on Vercel. [docs/checks.md](docs/checks.md) explains
the CI checks, the browser QA and the Dependabot automation.

## Contributing and security

Fixes for bugs, accessibility and typos are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).
Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Licence

The code is released under the [MIT License](LICENSE).

The personal content is not covered by that licence: the texts, the legal pages, the name
Felix Huisinga, and the rabbit logo and artwork. Please replace them with your own if you build
on this site.
