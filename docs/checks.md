# Checks and automation

What runs on a pull request, what runs after a merge, and how dependency updates are handled.
The workflows live in [`.github/workflows`](../.github/workflows).

## CI

[`ci.yml`](../.github/workflows/ci.yml) runs on every pull request and on pushes to `main`.

The `validate` job runs on the Node.js version in [`.node-version`](../.node-version), the same
major version as the Docker image and the `engines` field:

1. `npm ci`
2. `npm test`: unit tests for the Dependabot merge script
3. `npm run lint`
4. `npm run type-check`
5. `npm run knip`
6. `npm audit --omit=dev --audit-level=moderate` for the dependencies that ship, then
   `npm audit --audit-level=high` for everything including build and lint tooling
7. `npm run build`
8. Starts the production build and runs `npm run test:site` against it
9. On pull requests: the browser QA below

The `docker` job builds the production image from the [`Dockerfile`](../Dockerfile).

## Site tests

[`tests/site.test.mjs`](../tests/site.test.mjs) sends plain HTTP requests to a running production
build. It checks the title, description, canonical URLs, Open Graph and X metadata, that every
share image and icon exists at its declared size, the manifest icons, the JSON-LD graph, robots
and sitemap, the legal pages, the permanent redirects for retired URLs, and the 404 responses.

Run it locally against `npm start`, or against another server with `SITE_ORIGIN`:

```bash
npm run build
npm start
```

```bash
npm run test:site
```

## Browser QA

[`visual-qa.mjs`](../.github/scripts/visual-qa.mjs) drives Playwright Chromium. It checks:

- five viewports from 1440 px down to 320 px, with reduced motion: no horizontal overflow,
  visible links with 44 px touch targets, visible keyboard focus, no client errors, no cookies
  and no browser storage
- the hero rabbit: at rest with reduced motion, inside the viewport and clear of the hero text
  at every width, and animated at 768 px without reduced motion
- the rabbit journey at 1280 px: one full loop reaches the carrot, the rescue and the card game,
  and no rabbit, card or carrot ever covers text, a row arrow or a project illustration, or
  widens the page
- the matching accessory, and only that one, on hovering or tabbing to the Rettungshelden,
  GitHub and Wizard Party links
- that the generated icons show a light logo, not one in the background colour
- the page without JavaScript, the back links on the legal pages, and the 404 page

Screenshots are uploaded as the `portfolio-visuals` artifact for seven days.

The script only runs inside GitHub Actions; it reads Playwright from the runner's temporary
directory. Locally, `npm run test:site` covers everything except layout and rendering.

## Deployment

Vercel deploys every pull request as a preview and every merge into `main` to production.

## Dependency updates

[`dependabot.yml`](../.github/dependabot.yml) checks npm packages, GitHub Actions and the Docker
base image every Monday at 07:00 Berlin time. Minor and patch updates are grouped.

[`dependabot-auto-merge.yml`](../.github/workflows/dependabot-auto-merge.yml) merges minor and
patch updates once CI has passed for the same commit. It uses `pull_request_target`, so it only
runs for pull requests opened by Dependabot from this repository, and it only checks out the
merge script from `main`, never code from the pull request. Major updates wait for manual
review.
