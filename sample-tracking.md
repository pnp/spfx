# Source metadata remediation

## Scope and policy

- Fix source metadata before building the central gallery.
- Add missing metadata only when descriptions, authors, dates, versions and links can be validated against source files/history.
- Correct malformed declarations and package-version mismatches without upgrading sample dependencies.
- Submit focused upstream PRs and merge through normal repository checks; do not bypass protections.
- Defer genuinely missing preview assets. A generic placeholder must never be represented as a real screenshot.
- Preserve remaining defects in the audit/baseline until corrected; do not weaken validation to manufacture a clean result.

## Repository progress

| Repository | Status | PR | Notes |
| --- | --- | --- | --- |
| pnp/sp-dev-fx-webparts | Merged; source files verified | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) | Six additions, 87 corrected version declarations, missing video alt fixed; 102 metadata documents validated and all 106 changed paths verified; current audit has zero non-preview errors |
| pnp/sp-dev-fx-extensions | Merged; source files verified; CI caveats below | [pnp/sp-dev-fx-extensions#2066](https://github.com/pnp/sp-dev-fx-extensions/pull/2066) | Four metadata additions and declaration/link corrections across 46 JSON paths; source collection confirms merged contents |
| pnp/sp-dev-fx-aces | Open; CI-blocked, not merged | [pnp/sp-dev-fx-aces#282](https://github.com/pnp/sp-dev-fx-aces/pull/282) | 64 validated metadata files, including one new NewsFeed record and 59 corrected SPFx declarations; unchanged sample builds and remote URL validation block merging |
| pnp/spfx-reference-scenarios | Merged; source files verified | [pnp/spfx-reference-scenarios#48](https://github.com/pnp/spfx-reference-scenarios/pull/48) through [pnp/spfx-reference-scenarios#57](https://github.com/pnp/spfx-reference-scenarios/pull/57) | Six metadata additions, four corrections; one sample per PR as required by contribution guidance |
| pnp/spfx-copilot-components | Merged; source files verified | [pnp/spfx-copilot-components#84](https://github.com/pnp/spfx-copilot-components/pull/84) | Corrected Planner prerelease and canonical source/download/preview links; full gallery/browser validation passed |

### Reference-scenario evidence and PRs

| Sample | PR | Validated data / outcome |
| --- | --- | --- |
| ace-application-state | [pnp/spfx-reference-scenarios#48](https://github.com/pnp/spfx-reference-scenarios/pull/48) | README, package 1.13.1 and original Patrick Rodgers source commit; no real screenshot exists |
| ace-chart | [pnp/spfx-reference-scenarios#49](https://github.com/pnp/spfx-reference-scenarios/pull/49) | Package 1.15.2, existing card/quick-view images; first source commit dates creation to 2022-08-11 rather than copied 2021 README-template dates |
| ace-dynamic-card | [pnp/spfx-reference-scenarios#50](https://github.com/pnp/spfx-reference-scenarios/pull/50) | README, package 1.13.1, original source author and existing cards-in-action screenshot |
| ace-mymail | [pnp/spfx-reference-scenarios#51](https://github.com/pnp/spfx-reference-scenarios/pull/51) | README credits Derek Cash-Peterson; package 1.14.0; three existing screenshots |
| ace-shared-state | [pnp/spfx-reference-scenarios#52](https://github.com/pnp/spfx-reference-scenarios/pull/52) | Root README and original Patrick Rodgers source commit; actual ACE package 1.13.1, not the README's 1.14 badge; no real screenshot exists |
| spfx-formcustomizer-saleslead | [pnp/spfx-reference-scenarios#53](https://github.com/pnp/spfx-reference-scenarios/pull/53) | README credits verified Sympraxis Consulting organization; package 1.23.2 and existing Demo.gif |
| ace-designtemplate-gallery | [pnp/spfx-reference-scenarios#54](https://github.com/pnp/spfx-reference-scenarios/pull/54) | ACE/core dependencies are 1.14.0; legacy web-part dependency remains 1.13.1; corrected metadata update date without changing dependencies |
| ace-wellbeing | [pnp/spfx-reference-scenarios#55](https://github.com/pnp/spfx-reference-scenarios/pull/55) | Dated this actual metadata correction instead of retaining an update-before-creation date; fixed duplicate preview ordering |
| ace-teams-covid | [pnp/spfx-reference-scenarios#56](https://github.com/pnp/spfx-reference-scenarios/pull/56) | Corrected missing `samples/` segment in source link |
| spfx-formcustomizer-basics | [pnp/spfx-reference-scenarios#57](https://github.com/pnp/spfx-reference-scenarios/pull/57) | Nested package declares 1.15.0-rc.0, not GA |

All ten reference PRs passed the normal `validate` check before squash merge.
Default-branch file contents were compared with the validated changes after each merge.
The two new empty preview arrays are deliberate, tracked deferrals, not fake screenshots.

### Merge policy and blockers

- The user explicitly chose **leave affected PRs open until every check is green**.
- Do not use an administrator override or treat an unmerged PR as a landed baseline fix.
- **Timing caveat:** the extensions PR was already merged at **2026-11-06 17:11:21 UTC**, before the stricter leave-open decision reached that repair worker. Its PnP URL-probe check was not green. This is a real merged change, not a queued PR, and must not be reported as an all-green merge.
- The extensions closed-PR distribution job also failed because `github-actions[bot]` could not push (HTTP 403). The source metadata is merged and collected directly here, but the upstream distribution job needs maintainer attention. No further merge overrides or workflow/permission changes were made.
- Web-parts PR initially remained open after the PnP action reported unchanged-thumbnail reachability failures. A README-supported video alt correction was then pushed; all applicable new **pre-merge** checks passed. The PR merged normally at **2026-11-06 17:21:53 UTC**, commit `a1c4ad00c5b0cf3475fa95efb4c8eb1886b5fe39`, without a bypass.
- Web-parts default-branch source contents were verified against all 106 changed paths. The subsequent push-triggered **Merge and Distribute Samples** run succeeded; a separate closed-PR distribution run failed after merging because `github-actions[bot]` was denied push access (HTTP 403). This is not misrepresented as a pre-merge check.
- ACE changes pass local source-schema validation for all 64 changed files and all 85 proposed aggregate records. The remote action's first-page pagination is not claimed as full-file coverage.
- ACE CI: 58 passing checks and seven failures. The validator was retried once and still reported unchanged-URL reachability failures, although all nine reported URLs returned HTTP 200 on independent checks. No patch-specific validation error was reported.
- Six ACE build failures have unchanged build inputs:
  - `BasicCard-ShareGraphClient`: no sample-root `package.json`.
  - `PrimaryTextCard-CreateTeam` and `PrimaryTextCard-ManageTeam`: ESLint 9.37.0 conflicts with the compiler peer requirement `^8.57.0`.
  - `PrimaryTextCard-PlannerTasks` and `PrimaryTextCard-my-calendar-plan`: legacy node-sass/node-gyp uses Python 2 syntax under Python 3.
  - `PrimaryTextCard-Service-Health`: stale gulpfile selects unavailable gulp while the package uses Heft.
- These are not fixed by changing declared metadata versions. Dependency/build modernization is separate work; the PR stays open under the confirmed merge policy.

### Reviewed coverage and framework corrections

- `pnp/sp-dev-fx-extensions/samples/react-teamschatnotifications-functions` is the documented Azure Functions backend for `react-teamschatNotifications`, not another SPFx extension. The parent README links it; the backend declares `@azure/functions`, `host.json` and `function.json`, with no SPFx runtime or component manifest. It is an explicit coverage exclusion, not fabricated standalone sample metadata.
- `pnp/sp-dev-fx-aces/samples/ImageCard-ApplyLeave-OOF-Holiday` is a build-artifact-only directory: 142 files under `lib`, `release`, `sharepoint` or `temp`, with no README, package or source. It is explicitly recorded as a coverage exclusion, not assigned fabricated sample metadata. It remains counted in the folder inventory.
- `BotPowered-BasicAce-CollectFeedback` and `BotPowered-BasicAce-Tasks` are documented .NET 6 Bot Framework ACEs, not SPFx projects. Their `.csproj` files use Bot Builder 4.21.2 and their metadata already declares `BOT-FRAMEWORK-VERSION=bot40`.
- The central registry now records these two non-SPFx classifications. They remain discoverable with `framework: Bot Framework`, `frameworkVersion: bot40` and no invented SPFx version.
- Exclusions cannot hide existing metadata. Changed framework evidence or registry settings invalidate the snapshot/override and require revalidation.

## Missing-metadata coverage

The original 19 coverage gaps consist of 17 genuine samples and the two reviewed
support/artifact exclusions above. Sixteen sample records are merged; one remains
in the blocked ACE PR. The reference additions are individually linked in the table above.

| Sample(s) | State | PR |
| --- | --- | --- |
| react-adal-bot; react-command-document-preview; react-command-generate-documents; react-teamschatNotifications | Four validated additions merged | [pnp/sp-dev-fx-extensions#2066](https://github.com/pnp/sp-dev-fx-extensions/pull/2066) |
| ace-strategy-pattern | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| js-teams-meeting-app | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| react-group-members | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| react-spfx-room-booking | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| react-staff-directory-sp2019 | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| react-wellbeing-tracker | Merged | [pnp/sp-dev-fx-webparts#6661](https://github.com/pnp/sp-dev-fx-webparts/pull/6661) |
| PrimaryTextCard-NewsFeed | Prepared; not merged | [pnp/sp-dev-fx-aces#282](https://github.com/pnp/sp-dev-fx-aces/pull/282) |

## Remaining work review (2026-11-06)

Rechecked at **17:34 UTC (19:34 EET)**: the current default-branch audit still
contains **107 errors and 1,098 warnings**. No new errors were introduced.

| Work | Current count | Next action |
| --- | ---: | --- |
| Non-preview metadata errors, all in ACEs | 64 | Already fixed in [pnp/sp-dev-fx-aces#282](https://github.com/pnp/sp-dev-fx-aces/pull/282); do not duplicate the pending work |
| ACE preview references with validated corrections | 3 | Included in the same open PR; these are URL/path fixes, not newly generated screenshots |
| Preview findings remaining after that PR | 40 | Still deferred; use the clearly labeled generic gallery fallback where needed |
| Duplicate preview-order warnings | 36 | Candidate metadata-only cleanup: preserve existing visible order while assigning unique order values |
| Leading/trailing text-whitespace warnings | 6 | Candidate surgical cleanup, with field-by-field validation |
| Generic preview alt-text warnings | 580 | Requires actual screenshot/context review; do not fabricate image descriptions |
| Missing download-link warnings | 240 | Future gallery can derive links from validated sample URLs; decide whether upstream backfill is also needed |
| Version-evidence warnings | 94 ranges, 35 unspecified patches, 26 unverified | Compare actual package/lock evidence; do not guess installed versions or upgrade dependencies merely to clear warnings |
| Missing technology / unclassified extension warnings | 7 / 4 | Inspect real source/manifests before adding filter metadata |

The immediate blocker is **ACE CI**, not another batch of unknown metadata
errors: six existing sample-build failures plus the remote URL-probe check.
The metadata check has already been retried once. Dependency/build modernization
would be a separate scope from metadata-only cleanup; failed checks must not be bypassed.
The 36 order and six whitespace warnings are the clearest low-risk follow-up
candidates, but no additional source PRs were created during this counts refresh.

## Preview fallback

- [x] Generate a neutral, blue community-style placeholder without product branding or fake UI.
- [x] Save [sample-preview-fallback.png](./assets/images/sample-preview-fallback.png): 1672 x 941 PNG.
- [x] Use this asset only for absent/unusable previews and label it **Preview unavailable**.
- [x] Keep original screenshot defects in this tracker; do not rewrite upstream metadata to point to a central placeholder.
- [x] Verify runtime failed-image handling as well as metadata-known missing assets on desktop and mobile.

The local gallery now includes all 794 collected records and 248 contributors,
with explicit source-quality notes. It does not apply the unmerged ACE patch.
Primary preview preparation converts 759 unique images to local WebP assets
(about 12.08 MB versus 1.24 GB of source media). Fourteen oversized originals
currently use the labeled fallback; the generated public `preview-report.json`
records their URLs and reasons separately from the source audit's preview backlog.

## Deferred preview backlog

**40 preview findings across 12 sample records** remain in the validated combined PR projection.
This list includes pending-PR metadata so newly discovered screenshot gaps are not lost. It does not claim the ACE PR is merged.
The missing video alt declaration was corrected from README evidence; every remaining projected error is an asset/preview-availability defect.

| Repository | Current metadata files | Current records | Current errors | Proposed errors after the ACE PR |
| --- | ---: | ---: | ---: | ---: |
| pnp/sp-dev-fx-webparts | 475 | 495 | 32 | 32 |
| pnp/sp-dev-fx-extensions | 147 | 147 | 6 | 6 |
| pnp/spfx-copilot-components | 47 | 47 | 0 | 0 |
| pnp/spfx-reference-scenarios | 21 | 21 | 2 | 2 |
| pnp/sp-dev-fx-aces | 84 | 84 | 67 | 0 |

| Sample metadata (repository / path) | Record | Deferred finding(s) |
| --- | ---: | --- |
| [pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/js-application-redirect/assets/sample.json) | 0 | asset.missing (thumbnails[0].url): Asset not found in collected repository tree: samples/js-application-redirect/ext-redirects.png |
| [pnp/sp-dev-fx-extensions/samples/js-application-run-once/assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/js-application-run-once/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |
| [pnp/sp-dev-fx-extensions/samples/react-application-alert-banner/Assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/react-application-alert-banner/Assets/sample.json) | 0 | asset.missing (thumbnails[0].url): Asset not found in collected repository tree: samples/react-application-alert-banner/assets/preview.gif |
| [pnp/sp-dev-fx-extensions/samples/react-command-convert-to-pdf/assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/react-command-convert-to-pdf/assets/sample.json) | 0 | asset.missing (thumbnails[0].url): Asset not found in collected repository tree: samples/react-command-convert-to-pdf/screenshot.gif |
| [pnp/sp-dev-fx-extensions/samples/react-command-documents-redaction/Assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/react-command-documents-redaction/Assets/sample.json) | 0 | asset.missing (thumbnails[0].url): Asset not found in collected repository tree: samples/react-command-documents-redaction/assets/preview.gif |
| [pnp/sp-dev-fx-extensions/samples/react-site-content-ribbon-extension/assets/sample.json](https://github.com/pnp/sp-dev-fx-extensions/blob/b3df920173cd6ad726b11367d754d1d846034252/samples/react-site-content-ribbon-extension/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |
| [pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json](https://github.com/pnp/sp-dev-fx-webparts/blob/61d6542e0ff5964004fa4dbd001ec52f3f7b495b/samples/react-birthdays/assets/sample.json) | 1 | asset.missing (thumbnails[1].url): Asset not found in collected repository tree: samples/react-birthdays/assets/ballonsBackgroud.png<br>asset.missing (thumbnails[10].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof14.png<br>asset.missing (thumbnails[11].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof14_1.png<br>asset.missing (thumbnails[12].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof17.png<br>asset.missing (thumbnails[13].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof18.png<br>asset.missing (thumbnails[14].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof181.png<br>asset.missing (thumbnails[15].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof19.png<br>asset.missing (thumbnails[16].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof2.png<br>asset.missing (thumbnails[17].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof20.png<br>asset.missing (thumbnails[18].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof21.png<br>asset.missing (thumbnails[19].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof22.png<br>asset.missing (thumbnails[2].url): Asset not found in collected repository tree: samples/react-birthdays/assets/baloons.png<br>asset.missing (thumbnails[20].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof24.png<br>asset.missing (thumbnails[21].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof28.png<br>asset.missing (thumbnails[22].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof29.png<br>asset.missing (thumbnails[23].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof3.png<br>asset.missing (thumbnails[24].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof30.png<br>asset.missing (thumbnails[25].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof4.png<br>asset.missing (thumbnails[26].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof5.png<br>asset.missing (thumbnails[27].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof6.png<br>asset.missing (thumbnails[28].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof7.png<br>asset.missing (thumbnails[29].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof8.png<br>asset.missing (thumbnails[30].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof9.png<br>asset.missing (thumbnails[4].url): Asset not found in collected repository tree: samples/react-birthdays/assets/birthdays2.png<br>asset.missing (thumbnails[5].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof.png<br>asset.missing (thumbnails[6].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof1.png<br>asset.missing (thumbnails[7].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof10.png<br>asset.missing (thumbnails[8].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof11.png<br>asset.missing (thumbnails[9].url): Asset not found in collected repository tree: samples/react-birthdays/assets/cof12.png |
| [pnp/sp-dev-fx-webparts/samples/react-group-members/assets/sample.json](https://github.com/pnp/sp-dev-fx-webparts/blob/61d6542e0ff5964004fa4dbd001ec52f3f7b495b/samples/react-group-members/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |
| [pnp/sp-dev-fx-webparts/samples/react-site-content/assets/sample.json](https://github.com/pnp/sp-dev-fx-webparts/blob/61d6542e0ff5964004fa4dbd001ec52f3f7b495b/samples/react-site-content/assets/sample.json) | 0 | asset.missing (thumbnails[0].url): Asset not found in collected repository tree: samples/react-site-content/assets/SiteContentWebpart.png |
| [pnp/sp-dev-fx-webparts/samples/spfx-news/assets/sample.json](https://github.com/pnp/sp-dev-fx-webparts/blob/61d6542e0ff5964004fa4dbd001ec52f3f7b495b/samples/spfx-news/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |
| [pnp/spfx-reference-scenarios/samples/ace-application-state/assets/sample.json](https://github.com/pnp/spfx-reference-scenarios/blob/746c2fcb69cec30e7a9182ed7dd99c09bb02a83f/samples/ace-application-state/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |
| [pnp/spfx-reference-scenarios/samples/ace-shared-state/assets/sample.json](https://github.com/pnp/spfx-reference-scenarios/blob/746c2fcb69cec30e7a9182ed7dd99c09bb02a83f/samples/ace-shared-state/assets/sample.json) | 0 | preview.missing (thumbnails): At least one image preview is required. |

## Verification

- Starting baseline: 760 metadata files, 778 sample records, 19 metadata coverage gaps, 253 errors and 1,136 warnings.
- **Current merged/default-branch snapshot, refreshed 2026-11-06 17:34 UTC:** 774 metadata files, 794 records, 1 genuine metadata gap, 107 errors and 1,098 warnings.
- **Validated projection including the open ACE PR, not yet deployed:** 775 metadata files, 795 records, zero metadata gaps, zero non-preview errors and 40 deferred preview errors.
- Candidate folder inventory remains 777; two reviewed support/artifact folders are explicitly excluded from standalone sample coverage.
- Sixteen missing metadata records are already merged (six web parts, four extensions, six reference scenarios); one more is prepared in the blocked ACE PR.
- Thirteen PRs are merged (ten reference scenarios, Copilot, extensions, web parts); ACE remains open. No open-PR fixes are counted as landed.
- Source collection, unique IDs, full record/file counts, combined PR audit, PNG signature/dimensions and 32 focused tests are verified.
- The baseline is updated only to actual merged/default-branch findings. Newly fingerprinted preview errors from created/moved metadata match the previously validated deferred-preview projection; fixed fingerprints are removed. No malformed/version errors are newly approved.
- The complete source backlog remains in [.metadata/quality-report.md](./.metadata/quality-report.md). The local gallery exposes these accepted findings explicitly; source cleanup is still incomplete while the ACE PR is unmerged.
