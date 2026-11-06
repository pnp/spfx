# SPFx Samples

**Copilot, SharePoint, Teams and more.** A community-built Microsoft 365 sample
gallery, powered by SPFx, with a distinctive Parker/blue identity and shared
Microsoft 365 & Power Platform Community navigation.

**[Open the live gallery](https://pnp.github.io/spfx/)**

[![Gallery build and deployment](https://github.com/pnp/spfx/actions/workflows/refresh-metadata.yml/badge.svg?branch=main)](https://github.com/pnp/spfx/actions/workflows/refresh-metadata.yml)

The Astro gallery is published from `main` through GitHub Actions and GitHub
Pages. Use the gallery link above or the repository's About link to test it.

## Run locally

Use **Node.js 22.23.4+** and **npm 11**. To use the supported npm without changing
a shared machine's global installation:

```powershell
npm exec --yes --package=npm@11.21.1 -- npm ci
npm run samples:refresh
npm run dev
```

Open **http://localhost:4321/spfx/**. The first generation prepares local screenshot
previews; later runs reuse the cache. Development and production builds do not
install or execute any source sample projects.

```powershell
npm test
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview -- --port 4321
```

Astro requires the stated Node version. TypeScript 6 is intentional: the current
Astro checker supports TypeScript 5/6, not TypeScript 7. npm 11 avoids the npm 10
peer-resolution failure encountered when installing the Astro toolchain.
Browser tests start a production preview on port 4321, or reuse an existing local
preview there; Astro permits only one preview process per project.
`npm test` first generates its public catalog inputs from the audited metadata,
so the same command works after a clean checkout and source refresh.

## The experience

- Microsoft 365-first, with **Copilot, SharePoint, Teams and Connections** visibly
  represented in the story, artwork and discovery tabs.
- Search across sample text, technology, source and contributors.
- Combined component, technology, SPFx-version and source filters: OR within a
  group, AND between groups; dynamic counts and shareable URL state.
- Newest, updated and alphabetical sorting, pagination, reset and empty states.
- A browser-local saved collection, without accounts or analytics.
- Sample details, source-specific documentation/download/issue links,
  contributor recognition, getting started and What's new.
- Persistent light/dark themes, responsive navigation and a complete
  no-JavaScript [sample directory](./src/pages/browse.astro).

SharePoint remains an important, explicit part of the gallery. It is not the
exclusive portal brand, and original sample titles, screenshots and attribution
are not rewritten to hide their product context.

## Data flow and quality

The [source registry](./.metadata/sources.json) configures the five upstream
repositories. [Collection](./.github/scripts/collect-samples.mjs) pins each
revision and reads original metadata/package/component manifests. It does not
import merged feeds that would duplicate extensions.

1. `npm run samples:refresh` updates local `.metadata/samples.json` and the audit.
2. `npm run catalog:generate` creates the typed public catalog, compact discovery
   index and cached primary screenshot previews.
3. Astro generates the gallery and every sample's static detail page.

Generated snapshots, public catalog files, previews and build output are ignored
by Git. The refresh workflow recreates them from source.

Known source defects remain visible in sample details and
[catalog health](./src/pages/catalog-health.astro). Missing descriptions or
versions are not fabricated, and package mismatches are not silently advertised
as verified compatibility. Reviewed support folders stay inventoried without
becoming fake samples. The two verified Bot Framework ACEs keep their real
framework rather than an invented SPFx version.

Existing errors are recorded in the reviewed
[quality baseline](./.metadata/quality-baseline.json). Incomplete collection and
new errors fail explicitly. `npm run samples:baseline` is a deliberate review
operation, never an automatic CI repair. Source metadata quality is separate
from sample build/runtime validation.

Primary previews are resized to WebP, cached locally and accompanied by a public
processing/provenance report. Missing, oversized or undecodable images use the
clearly labeled [generic fallback](./assets/images/sample-preview-fallback.png).
Original media and author attribution stay in their source repositories.

## Publishing

The [gallery workflow](./.github/workflows/refresh-metadata.yml) runs daily at
**04:17 UTC**, manually, and on relevant central-repository changes:

**Collect -> audit -> unit tests -> type check -> build -> browser/accessibility
tests -> upload Pages artifact -> deploy.**

Pull requests validate but do not deploy. Only the separate `github-pages`
deployment job receives Pages/OIDC write permissions. A failed collection,
quality gate or build cannot replace the last successful deployment.

Pages is configured with **Source: GitHub Actions**, HTTPS and a `github-pages`
environment restricted to `main`. The [verified deployment](https://github.com/pnp/spfx/actions/runs/42277784440)
passed the Linux build, 90 unit tests and 22 browser checks. All 22 desktop/mobile
checks were also run successfully against the public site, including discovery,
saved collections, themes, source actions, fallbacks and accessibility.

For an on-demand refresh, open **Actions -> Refresh and publish gallery -> Run
workflow** and select `main`. Daily refresh remains scheduled for 04:17 UTC;
GitHub schedules are best-effort.

## Tracking and credits

- [Implementation plan and acceptance criteria](./todo.md)
- [Source repairs, PRs and deferred preview backlog](./sample-tracking.md)
- [Current metadata quality report](./.metadata/quality-report.md)

The Parker artwork and fonts are reused from the community Script Samples
redesign under its MIT license; the [asset notice](./public/asset-license.txt)
preserves attribution. Screenshot rights remain with their original sample
owners. The gallery adds no visitor tracking.
