# Contributing

This is a personal website, so the content and design stay as they are. Fixes are welcome:

- bugs and broken links
- accessibility problems
- typos
- build, CI or dependency problems

For anything larger, open an issue first.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Run the checks that CI runs:

   ```bash
   npm ci
   npm test
   npm run lint
   npm run type-check
   npm run knip
   npm run build
   ```

   Then start the build with `npm start` and, in a second terminal, run `npm run test:site`.

3. Open a pull request that says what changed and why.

CI and the browser QA run on every pull request; see [docs/checks.md](docs/checks.md).

By contributing, you agree that your contribution is licensed under the [MIT License](LICENSE).
