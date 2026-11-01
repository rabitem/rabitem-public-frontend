# AGENTS.md

The source of rabitem.de, a personal one-page website. Read [README.md](README.md) for the layout
and commands, and [docs/checks.md](docs/checks.md) for CI and tests.

- Content (names, links, projects, slogan, colours) lives in `lib/site.ts`. Change it there, not
  in components or metadata. `tests/site.test.mjs` spells the expected values out separately, so
  update it in the same change.
- `app/` holds routes and Next.js file conventions only; sections and image templates go in
  `components/`.
- Server components, except `components/RabbitJourney.tsx`, which has to measure the page. Keep
  the site static: no analytics, cookies, browser storage or client-side data fetching. The
  privacy page states this, so a change here also needs a change there.
- Two rabbits, one at a time. `RabbitScene` is CSS only and is what visitors get without
  JavaScript, below 1024 px or with reduced motion; keep its resting frame meaningful. On wider
  screens `RabbitJourney` replaces it and tours the page: carrot in the hero, a rescue on the
  Rettungshelden row, cards on the Wizard Party row. Its stops come from the rendered rows, so a
  layout change there needs a look at the journey and its browser QA check.
- Links reach both rabbits through `data-rabbit-mood` and `:has()`. The rabbit's shape lives in
  `lib/rabbit.ts`.
- Icons and share images are rendered by `next/og` from `components/RabbitLogo.tsx`. In those
  templates, set the logo colour with the parent's CSS `color`; the SVG `color` attribute is
  ignored there.
- Styles live in `app/globals.css` as plain classes. Match the existing tokens on `:root`.
- Keep every interactive element at least 44 px tall and keep visible keyboard focus.
- The Impressum and Datenschutz pages are legal texts. Do not reword them.
- Retired URLs redirect permanently in `next.config.ts`; keep those redirects.
- Before opening a pull request, run `npm test`, `npm run lint`, `npm run type-check`,
  `npm run knip`, `npm run build`, then `npm start` and `npm run test:site`.
