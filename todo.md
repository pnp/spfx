# SPFx Samples: centralized gallery plan

## Confirmed objectives

- [x] Publish one community-branded **SPFx Samples** gallery from `pnp/spfx` at **https://pnp.github.io/spfx/**.
- [x] Use Astro for the static gallery. The local site, source tooling and publishing workflow are implemented; a local build is **not a live deployment**.
- [x] Keep samples, code, authorship and contribution ownership in the five source repositories. Do not copy projects here or upgrade them as part of this work.
- [x] Aggregate web parts, extensions, Copilot components, reference scenarios and Adaptive Card Extensions (ACEs).
- [x] Refresh daily at **04:17 UTC** and on demand. GitHub schedules are best-effort, not an exact-time SLA.
- [x] Adopt a **blue** primary palette and **Parker** logo, not a SharePoint or Copilot product logo.
- [x] Keep Microsoft 365 as the umbrella, with **"Copilot, SharePoint, Teams and more."** SharePoint stays explicit in copy, artwork, source screenshots and discovery, without becoming the exclusive portal brand.
- [x] Align the community spectrum strip, navigation and light/dark control with the reference galleries.
- [x] Retain Component type, Technology and SPFx version filters; extend types for every source family.
- [x] Baseline existing quality errors; block incomplete collection and newly introduced errors. Track warnings and existing defects visibly rather than hiding them.
- [x] Keep older SPFx versions discoverable. Sample modernization starts separately next week; derive version options from current metadata rather than hardcoding a shrinking list.

## Source of truth and collection

| Repository | Sample roots | Family |
| --- | --- | --- |
| [pnp/sp-dev-fx-webparts](https://github.com/pnp/sp-dev-fx-webparts) | `samples/` | Web parts |
| [pnp/sp-dev-fx-extensions](https://github.com/pnp/sp-dev-fx-extensions) | `samples/` | Extensions |
| [pnp/spfx-copilot-components](https://github.com/pnp/spfx-copilot-components) | `samples/` | Copilot components |
| [pnp/spfx-reference-scenarios](https://github.com/pnp/spfx-reference-scenarios) | `samples/` | Reference scenarios |
| [pnp/sp-dev-fx-aces](https://github.com/pnp/sp-dev-fx-aces) | `samples/`, **`scenarios/`** | Adaptive Card Extensions |

- [x] Inspect the existing web-parts [merge script](https://github.com/pnp/sp-dev-fx-webparts/blob/main/.github/scripts/merge-samples/index.js) and active [combine workflow](https://github.com/pnp/sp-dev-fx-webparts/blob/main/.github/workflows/combine-samples.yaml).
- [x] Avoid importing merged feeds: web-parts aggregation already imports extensions, which would otherwise be duplicated.
- [x] Discover source `sample.json` files directly, including nested metadata, and inventory sample folders with no metadata.
- [x] Pin each repository to a commit **before** listing/downloading files; reject truncated trees, missing sources, HTTP failures and checksum mismatches.
- [x] Fetch metadata, package manifests and JSONC component manifests without downloading or installing sample projects.
- [x] Exclude generated `lib`, `lib-commonjs`, `release`, `dist` and `temp` package/component manifests so stale build artifacts do not define current component types.
- [x] Use bounded requests, timeouts, limited retries and content-addressed local caching.
- [x] Preserve source fields verbatim. Add a namespaced `gallery` projection for identity, source revision/path/link, normalized facets, component hosts and error counts.
- [x] Report duplicates, invalid JSON and missing metadata explicitly. Never silently flatten malformed records, discard duplicates or fabricate missing descriptions/authors.
- [x] Keep the source registry in [.metadata/sources.json](./.metadata/sources.json).

### Generated data contract

| Output | Purpose | Version-control policy |
| --- | --- | --- |
| `.metadata/source-data.json` | Complete raw snapshot, tree paths/sizes, source commits, metadata, packages and component manifests | Generated/ignored; retained in CI artifacts |
| `.metadata/collection-status.json` | Completion marker; failed/in-progress collection must not authorize stale data | Generated/ignored; retained in CI artifacts |
| `.metadata/samples.json` | Flat array of all parseable records plus `gallery`; this is **not yet a publication-ready catalog** | Generated/ignored |
| `.metadata/quality-report.json` | Every finding, field/path/rule/fingerprint, per-source counts, facet inventory and link verification scope | Generated/ignored; retained in CI artifacts |
| [.metadata/quality-report.md](./.metadata/quality-report.md) | Human-readable baseline and source remediation backlog | Track the initial report; future runs refresh artifacts |
| [.metadata/quality-baseline.json](./.metadata/quality-baseline.json) | Reviewed existing error fingerprints and source revisions | Tracked; never automatically expanded |

Important: collected records can still contain baseline errors. The next implementation phase must validate the public catalog separately, explicitly identify incomplete records and provide designed missing-preview states. A green baseline audit does not mean every legacy record is complete.

## Initial quality audit

### Source remediation before gallery implementation

Detailed progress, upstream PRs, evidence and deferred screenshots are tracked in
[sample-tracking.md](./sample-tracking.md) to keep this plan concise.

- [ ] Create validated metadata for genuine sample coverage gaps and merge source PRs.
- [ ] Correct malformed declarations and metadata/package mismatches; merge source PRs without bypassing checks.
- [x] Generate a generic blue preview placeholder for the future gallery.
- [x] Recollect merged sources, remove resolved baseline entries and record remaining preview work.
- [x] Proceed with the gallery against the reviewed baseline, as subsequently requested; expose known source metadata issues and keep the ACE PR unmerged until its checks pass.

Merge policy confirmed during remediation: leave PRs open if any check fails,
including unrelated/pre-existing failures. Track those PRs as pending, not completed.
Reviewed artifact-only folders and non-SPFx Bot Framework samples are explicitly
classified in the source registry; never fabricate metadata or SPFx versions for them.

Current checkpoint: **13 PRs merged**, **16 missing sample records added**;
the ACE repair PR remains open under the confirmed CI policy. The actual merged
snapshot has **794 records and 107 errors**, down from 253. Applying the validated
ACE patch would leave **40 deferred preview findings and zero non-preview errors**.
The [repair tracker](./sample-tracking.md) distinguishes landed fixes from this projection.

### Local gallery checkpoint (2026-11-06)

- Implemented **794 sample records**, **248 contributors** and **802 static HTML pages**.
- Verified a clean npm 11 install, **90 unit tests**, **22 desktop/mobile browser checks** and an Astro type check with **zero diagnostics**.
- Verified **25,350 internal link/asset references** and layouts at **375px, 768px and 1440px**, including light/dark and explicit SharePoint artwork/discovery.
- Optimized **759 primary previews** to about **12.08 MB**; **14 oversized originals** use the labeled fallback with a public processing report.
- Live gallery: **https://pnp.github.io/spfx/**. A local preview can be started at **http://127.0.0.1:4321/spfx/**; no source merge policy was bypassed.
- [Verified GitHub Pages deployment](https://github.com/pnp/spfx/actions/runs/42277784440): Linux CI passed the build, 90 unit tests and 22 browser checks; all 22 browser checks also passed against the public site.
- Public checks confirmed 794 directory links, a sample detail route, optimized image/font delivery, catalog/search JSON, sitemap, robots and the branded 404. The first failed build did not deploy; missing clean-checkout catalog inputs were fixed before the successful release.

### Community refinement (2026-11-07)

- [x] Use the supplied official Copilot, SharePoint and Teams logos with Parker; keep artwork proportional and optimized.
- [x] Remove Connections from hero/promotional logos, while retaining its filtering tab, classifications, relevant text and original source screenshots.
- [x] Add the supplied contributor badge with opt-in recognition guidance, community-call promotion and demo signup based on availability.
- [x] Celebrate the customer/partner SPFx ecosystem's tens of millions of daily active users as maintainer-approved context, not fabricated live telemetry.
- [x] Derive sample, contributor, source and filter counts from each refreshed catalog; add exact-count and Connections-preservation regression checks.
- [x] Add the reference gallery's abstract side artwork, real-site README/social previews and root contributor guidance with source and asset attribution.
- [x] Verify 90 unit tests, 28 desktop/mobile checks and a type check with zero diagnostics; local Lighthouse mobile scores remain **99 performance / 100 accessibility / 100 best practices / 100 SEO**.
- [x] Publish this refinement: [successful release](https://github.com/pnp/spfx/actions/runs/42382536653). All 28 desktop/mobile checks also passed against the live Pages site, including official assets, community invitations, data-derived counts and preserved Connections filtering.

The hero story is limited to Copilot, SharePoint and Teams with Parker; Power
Automate is not promoted as part of the SPFx story. The contributor badge is
capped at 500px intrinsic height while retaining its smaller responsive display sizes.

- [x] Check JSON parsing/root shapes, required text, dates, products, key/value metadata, authors, previews and references.
- [x] Check names/URLs for duplicates and verify sample links belong to the correct repository and sample directory.
- [x] Check HTTPS/URL syntax, preview ordering and useful alt text.
- [x] Verify GitHub-hosted previews against the exact, case-sensitive collected repository tree, including zero-byte files.
- [x] Compare declared SPFx versions with source package dependencies; distinguish exact versions from unverified dependency ranges.
- [x] Accept legacy major.minor declarations with an explicit unspecified-patch warning; do not fabricate a patch number.
- [x] Derive actual component subtypes and supported hosts from JSONC manifests, not unreliable historical category labels.
- [x] Accept legacy object-root metadata/BOMs with warnings; do not silently accept malformed JSON or nested arrays.
- [x] Generate source-specific, field-level cleanup work rather than modifying upstream samples.
- [ ] Run a separate live external-link/image-decoding sweep before launch. The initial audit verifies syntax and repository asset existence, **not** external HTTP availability, image resolution, screenshot relevance or sample build/runtime behavior.
- [x] Review all missing-metadata folders to distinguish real samples from shared/support directories; add reviewed exclusions only if justified.
- [ ] Re-run the audit after next week's upgrades; remove fixed entries from the baseline in the same reviewed changes.

The latest measured results and complete backlog are in the [quality report](./.metadata/quality-report.md). The machine report is reproducible with the commands below.

### Measured baseline (2026-11-06)

Refreshed from all five default branches at **17:34 UTC (19:34 EET)**.
These are actual merged-source counts, not the projection for the open ACE PR.

| Source family | Metadata files | Sample records | Folders missing metadata | Errors | Warnings |
| --- | ---: | ---: | ---: | ---: | ---: |
| Web parts | 475 | 495 | 0 | 32 | 605 |
| Extensions | 147 | 147 | 0 | 6 | 282 |
| Copilot components | 47 | 47 | 0 | 0 | 0 |
| Reference scenarios | 21 | 21 | 0 | 2 | 14 |
| Adaptive Card Extensions | 84 | 84 | 1 | 67 | 197 |
| **Total** | **774** | **794** | **1** | **107** | **1,098** |

- Starting comparison: 760 metadata files, 778 records, 19 raw coverage gaps, 253 errors and 1,136 warnings. There are now **146 fewer errors** and **16 additional sample records**.
- Coverage: 777 candidate folders; two reviewed support/artifact folders are explicitly excluded, leaving 775 eligible sample folders. Only the ACE NewsFeed sample still lacks merged metadata.
- Some files describe multiple samples; metadata-file, folder and sample-record counts are intentionally different.
- Remaining errors: **64 non-preview metadata errors**, all covered by the unmerged [ACE repair PR](https://github.com/pnp/sp-dev-fx-aces/pull/282), and **43 preview findings**. The largest rule groups are 58 version mismatches, 36 missing asset references and six missing preview declarations.
- The ACE PR also corrects three preview references. After it merges, the validated projection is **775 metadata files, 795 records, zero metadata gaps, zero non-preview errors and 40 deferred preview findings**.
- Verified 1,900 repository asset references. **204 unique external URLs were not HTTP-probed** by the central audit; live link checks and image/visual review remain pre-launch work.
- The current baseline gate passes with **zero new errors**, not zero existing errors. The ACE PR remains open because seven checks still fail; no bypass or duplicate repair PR is planned.
- The metadata tooling has **32 passing tests**. This refresh also passed source collection and the baseline audit. See [remaining cleanup candidates and blockers](./sample-tracking.md#remaining-work-review-2026-11-06) before choosing further fixes.

### Quality gate

1. Any collection/network/truncated-tree failure stops the run, regardless of baseline.
2. Any new metadata error stops the audit. Existing error fingerprints remain visible in reports.
3. Warnings are reported, not silently defaulted away.
4. Baseline changes require an explicit local command and review; CI never approves new errors.
5. Before launch, resolve blocking display/identity/link errors or approve a specific, visible legacy treatment. Do not confuse baselining with permission to render unsafe/invalid data.

## Visual direction and navigation

References inspected:

- [Community Script Samples Astro redesign, pnp/script-samples#1038](https://github.com/pnp/script-samples/pull/1038), head `eac633e4ffe734b6e34c7d038dcd63fc9767eb6d`.
- [Copilot UX components](https://pnp.github.io/spfx-copilot-components/).
- [Copilot Prompt Gallery](https://pnp.github.io/copilot-prompts/).
- [Current SPFx gallery](https://pnp.github.io/sp-dev-fx-webparts/).

Design requirements for the next phase:

- [x] Use **SPFx Samples**, with Microsoft 365 & Power Platform Community attribution and the inclusive Copilot/SharePoint/Teams/Connections story.
- [x] Use the existing Parker artwork and fonts with their MIT attribution preserved in the public asset notice.
- [x] Adopt the community blue direction, with accessible light/dark colors; automated contrast checks pass in both themes.
- [x] Adopt the shared 4px spectrum strip: blue, green, magenta and coral at the reference percentages.
- [x] Use community typography, a distinctive connected-experiences hero, consistent cards and responsive screenshot-led discovery.
- [x] Implement this desktop navigation order, mirrored on mobile:

| Order | Label/control | Destination |
| ---: | --- | --- |
| 1 | Community + outward arrow | `https://aka.ms/community/home` |
| 2 | Samples | `/spfx/` |
| 3 | Getting started | `/spfx/getting-started/` |
| 4 | Contributors | `/spfx/contributors/` |
| 5 | Contributing | `/spfx/contributing/` |
| 6 | What's new | `/spfx/whats-new/` |
| 7 | GitHub | `https://github.com/pnp/spfx` |
| 8 | Light/dark switch | Final desktop action; accessible state/label, same visual treatment as the reference sites |

- [x] Provide active-page state, skip link, visible keyboard focus, accessible mobile menu and persisted light/dark choice.
- [x] Keep source contribution/issue links contextual to the originating repository.
- [x] Do not add analytics or visitor tracking. Saved collections and theme preferences stay in browser storage, with explicit storage-failure notifications.

## Discovery, taxonomy and content experience

### Existing filter baseline, inspected 2026-11-06

- **Component type** (currently called Category): Application customizer, ListView command set, Field customizer, Form customizer, Web part.
- **Technology**: AngularJS, JavaScript, jQuery, Knockout, React, Vue.js, Other.
- **SPFx version**: All; 1.24 through 1.1; `< 1.1`.
- Also preserve search, clear-all and useful sort controls. Current sorts are New and Popular.

### Extended experience

- [x] Include all supported component types and multi-valued host/experience classification, retaining honest "unclassified" values.
- [x] Keep Bot Framework ACEs discoverable without invented SPFx versions.
- [x] Keep source/family separate from component type; provide source filtering.
- [x] Normalize established technology aliases while retaining meaningful distinctions.
- [x] Derive version facets/counts from current data; preserve patch/prerelease details and `< 1.1` without an age cutoff.
- [x] Provide shareable URL state, back/forward navigation, multi-select facets, reset, result counts, pagination and designed empty states.
- [x] Test OR within facets, AND across facets and dynamic counts.
- [x] Search sample text, technology, source and contributors with stable ordering.
- [x] Support newest, metadata-updated and alphabetical sorts; defer Popular rather than fabricate a signal.
- [x] Show attribution, technical context, dates and previews on cards/details.
- [x] Build sample detail pages, canonical source/download/issue links, contributor recognition, guides and What's new.
- [x] Render metadata as escaped text; link to original README content rather than introduce unsanitized rendering.
- [x] Generate cached local WebP primary previews, with dimensions, lazy loading and honest fallback states; keep old samples visible.
- [x] Add a private browser-local collection and a no-JavaScript A–Z directory.

## Publishing architecture

- [x] Add a daily/manual **collection + audit** workflow with read-only permissions, tests, baseline gate, run summary and downloadable artifacts.
- [x] Create the Astro project and typed public-catalog adapter against the accepted baseline.
- [x] Configure `site: 'https://pnp.github.io'`, `base: '/spfx'` and static output.
- [x] Extend the workflow through source collection, audit, catalog/previews, unit/type/build/browser checks, Pages artifact and deployment.
- [x] Configure daily 04:17 UTC, manual and relevant `main` publishing triggers; PRs validate without deployment.
- [x] Keep Pages/OIDC write permissions only in the separate `github-pages` deployment job.
- [x] Serialize deployments and require successful validation before a new Pages artifact can deploy.
- [x] Expose collected source commits, refresh time, source-quality notes and preview processing/provenance.
- [x] Configure GitHub Pages to use Actions with HTTPS and a main-only environment; verify the public `/spfx/` URL.
- [ ] Decide redirects/canonical links for legacy galleries with their maintainers. Do not switch off existing sites before parity and link compatibility are verified.

## Step-by-step delivery and acceptance

### Step 1: discovery, metadata baseline and scripts

- [x] Confirm scope, title, schedule, navigation and baseline policy.
- [x] Supply collection/audit scripts, source registry, tests and a scheduled/manual audit workflow.
- [x] Verify the complete five-repository live audit and record its measured results.
- [x] Review the plan/coverage/baseline and proceed under the explicit known-issue policy.

Acceptance: each configured source is represented by a pinned revision; sample/folder counts reconcile; a failed source cannot authorize partial/stale input; malformed metadata and new errors are demonstrated by tests; scripts reproduce the reports on Windows and CI.

### Step 2: Astro foundation and visual shell

- [x] Scaffold Astro, define the public catalog schema/build adapter and base-path-safe links.
- [x] Implement Parker/blue branding, spectrum strip, aligned navigation, shared footer and responsive themes.
- [x] Review desktop/mobile/light/dark screenshots at the target viewport sizes.

Acceptance: working static build under `/spfx/`; no console or broken internal-link errors; correct navigation order, logo and theme behavior at 375px, 768px and 1440px.

### Step 3: gallery and detail experience

- [x] Implement searchable/filterable cards, sample details, contributor pages, guides and What's new.
- [x] Implement tested facet semantics, URL state, sorting, previews and explicit legacy-quality treatment.

Acceptance: all eligible source records reconcile with the public catalog; no duplicate cards from imported aggregate feeds; every required component type can be found; filtered counts, version transitions and zero-result states have automated tests.

### Step 4: quality hardening, launch and migration

- [ ] Resolve or explicitly disposition baseline defects; finish external link/image checks and manually review screenshot relevance.
- [ ] Finish a full manual accessibility/keyboard review; automated WCAG AA/theme checks and reduced-motion support are implemented, not a conformance certification.
- [x] Add desktop/mobile Playwright tests and automated accessibility checks, including SharePoint discovery and sample details.
- [x] Measure the production preview with Lighthouse mobile simulated throttling: **performance 99, accessibility 100, best practices 100, SEO 100**; LCP 1.1s, CLS 0 in this local run. These are measurements, not guaranteed production scores.
- [x] Verify SEO/canonicals, social metadata, sitemap, robots, 404 handling, all five source families and built internal links/assets.
- [x] Enable Pages deployment, verify the live site and demonstrate that failed validation prevents deployment. Expose manual refresh in GitHub Actions.
- [x] Observe an actual scheduled refresh: [2026-11-07 scheduled run](https://github.com/pnp/spfx/actions/runs/42366683246) succeeded and refreshed the public catalog.
- [ ] Coordinate legacy-site links with their maintainers.

Acceptance: live `https://pnp.github.io/spfx/`, successful manual deployment and subsequent scheduled refresh, observable failure behavior, accepted visual/accessibility/performance checks.

## Running locally

Requires Node.js 22.23.4+ and npm 11; no sample-project dependencies or builds are needed.

```powershell
npm exec --yes --package=npm@11.21.1 -- npm ci
npm run samples:refresh
npm test
npm run check
npm run build
npm run dev
```

`GITHUB_TOKEN` or `GH_TOKEN` can authenticate GitHub API requests. Tokens are never sent to raw-content hosts. Collection uses public raw files; API rate-limit/network failures are explicit.

To deliberately approve the initial baseline, or review updates after source fixes:

```powershell
npm run samples:baseline
npm run samples:audit
```

Review the baseline/report changes; do not use baseline regeneration as an automatic way to make CI green. Auditing can be repeated offline against the saved complete source snapshot. Run collection again to refresh sources.

## Remaining review and migration decisions

- [ ] Review the deployed visual experience; Parker asset provenance and MIT attribution have been verified.
- [ ] Review missing-metadata coverage and decide any justified support-folder exclusions.
- [x] Render incomplete legacy metadata with explicit review notes, canonical source links and honest preview fallbacks; retain source remediation tracking.
- [ ] Define a genuine cross-repository Popular signal, or explicitly defer that sort.
- [ ] Agree migration/redirect ownership, analytics/consent policy and the launch performance test profile.
