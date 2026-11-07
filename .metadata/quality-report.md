# SPFx sample metadata quality report

Collected: 2026-11-07T14:16:10.356Z. Audited: 2026-11-07T15:56:49.736Z.

This is a metadata/content audit, not a sample build or a visual review. Older SPFx versions are not defects.
Errors and warnings are retained; parseable records are not silently discarded or deduplicated.

| Repository | Commit | Folders | Metadata files | Records | Missing metadata | Errors | Warnings |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pnp/sp-dev-fx-webparts | 52e10a165aeaaacd73bd25ebdf0028d047843dc7 | 475 | 475 | 495 | 0 | 32 | 605 |
| pnp/sp-dev-fx-extensions | b3df920173cd6ad726b11367d754d1d846034252 | 148 | 147 | 147 | 0 | 6 | 282 |
| pnp/spfx-copilot-components | 7d9b4c0f7da67cfe54dc60be3da371ada2c2c81e | 47 | 47 | 47 | 0 | 0 | 0 |
| pnp/spfx-reference-scenarios | 746c2fcb69cec30e7a9182ed7dd99c09bb02a83f | 21 | 21 | 21 | 0 | 2 | 14 |
| pnp/sp-dev-fx-aces | 714a3eb9a0cb53a4c3973d10ad8f3c2608fca624 | 86 | 84 | 84 | 1 | 67 | 197 |

## Reviewed coverage exclusions

- pnp/sp-dev-fx-extensions/samples/react-teamschatnotifications-functions: Azure Functions backend linked by the react-teamschatNotifications application customizer. README, @azure/functions dependency, host.json and function.json identify supporting backend code, with no SPFx runtime dependency or component manifest.
- pnp/sp-dev-fx-aces/samples/ImageCard-ApplyLeave-OOF-Holiday: Artifact-only directory: all 142 tracked files are under lib, release, sharepoint or temp; no README, package.json or source exists (verified at 714a3eb9a0cb53a4c3973d10ad8f3c2608fca624).
Excluded folders remain in the candidate folder counts; no source metadata records are discarded.


## Findings by rule

| Severity | Rule | Count |
| --- | --- | ---: |
| error | array.invalid | 2 |
| error | asset.case-mismatch | 1 |
| error | asset.missing | 36 |
| error | date.order | 1 |
| error | metadata.missing | 1 |
| error | preview.missing | 6 |
| error | url.source-mismatch | 1 |
| error | version.invalid | 1 |
| error | version.package-mismatch | 58 |
| warning | author.account-format | 1 |
| warning | component.unclassified | 4 |
| warning | component.unverified | 25 |
| warning | download.missing | 240 |
| warning | metadata.duplicate-key | 18 |
| warning | metadata.location | 3 |
| warning | name.duplicate | 3 |
| warning | preview.alt-generic | 580 |
| warning | preview.duplicate-order | 36 |
| warning | technology.missing | 7 |
| warning | text.whitespace | 6 |
| warning | url.duplicate | 20 |
| warning | version.patch-unspecified | 35 |
| warning | version.range | 94 |
| warning | version.unverified | 26 |

## Filter inventory

### family

- Adaptive Card Extensions: 84
- Copilot components: 47
- Extensions: 147
- Reference scenarios: 21
- Web parts: 495

### componentTypes

- Adaptive Card Extension: 105
- Application customizer: 75
- Copilot component: 47
- Extension (unclassified): 4
- Field customizer: 15
- Form customizer: 5
- Library component: 4
- ListView command set: 56
- Reference scenario: 21
- Teams tab: 229
- Web part: 508

### technology

- Angular: 13
- JavaScript: 51
- jQuery: 7
- Knockout: 3
- Other: 2
- React: 691
- TypeScript: 23
- Vue.js: 2

### products

- AzureAD: 5
- Copilot: 23
- Get Subscriptions: 1
- Microsoft Copilot: 24
- Microsoft Graph: 9
- Microsoft Planner: 1
- Microsoft Teams: 15
- Office: 14
- Power Virtual Agents: 1
- SharePoint: 793
- SharePoint Online: 1
- Subscriptions: 1
- Teams: 7
- Update Subscriptions: 1
- Viva: 103
- WebHooks: 1

### framework

- Bot Framework: 2
- SharePoint Framework: 792

### spfxVersionGroup

- < 1.1: 34
- 1.1: 11
- 1.2: 5
- 1.3: 7
- 1.4: 38
- 1.5: 6
- 1.6: 9
- 1.7: 17
- 1.8: 24
- 1.9: 22
- 1.10: 67
- 1.11: 42
- 1.12: 27
- 1.13: 47
- 1.14: 28
- 1.15: 31
- 1.16: 34
- 1.17: 22
- 1.18: 39
- 1.19: 6
- 1.20: 88
- 1.21: 88
- 1.22: 26
- 1.23: 25
- 1.24: 48

## Link verification boundary

HTTPS syntax plus exact, case-sensitive repository-tree asset existence/size. No external HTTP reachability or image decoding checks.
Verified repository asset references: 1900.
Unique external URLs not probed: 204. See [machine report](./quality-report.json).

## Remediation backlog

| Severity | Repository / metadata path | Record | Field | Rule | Detail |
| --- | --- | ---: | --- | --- | --- |
| warning | pnp/sp-dev-fx-aces/samples/ace-cardgallery/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ace-cardgallery/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-CardComposition/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-CardComposition/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-CardComposition/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-Graph-UpcomingEvents/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-Graph-UpcomingEvents/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-Graph-UpcomingEvents/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HelpDesk/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-QuickView/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-QuickView/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-QuickView/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-React-QuickView/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-React-QuickView/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-HTML-React-QuickView/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-MonitorSecurity/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-MonitorSecurity/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-MonitorSecurity/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-Multiple-Forms-Apps/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-Multiple-Forms-Apps/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-Multiple-Forms-Apps/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-My-OneDrive-Info/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-My-OneDrive-Info/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-My-OneDrive-Info/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-OneDriveCarousel/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-OneDriveCarousel/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-PeopleSearch/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-PeopleSearch/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-PeopleSearch/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.15.0-rc.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-ShareGraphClient/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-SharePoint-CRUD/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-SharePoint-CRUD/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-SharePoint-CRUD/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-StatusMessage/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/BasicCard-StatusMessage/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-StatusMessage/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-StatusMessage/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BasicCard-StatusMessage/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-CollectFeedback/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-CollectFeedback/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-CollectFeedback/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-Tasks/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-Tasks/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-aces/samples/BotPowered-BasicAce-Tasks/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-DataVisualizationOptions/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-FilesByContentType/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ChartCard-FilesByContentType/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-FilesByContentType/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-FilesByContentType/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-FilesByContentType/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-PageCreation/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ChartCard-PageCreation/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-Plan-Tracker/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ChartCard-ThreeSeries/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ChartCard-ThreeSeries/assets/sample.json | 0 | metadata.SPFX-VERSION | version.invalid | Expected an SPFx version, optionally with prerelease/build suffix. |
| warning | pnp/sp-dev-fx-aces/samples/design-card/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/design-card/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/GenericCard-Graph-UserManager/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/GenericCard-Graph-UserManager/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-At-a-glance/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-At-a-glance/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-BookingSpaces/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-BookingSpaces/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-BookingSpaces/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-DynamicContentCard/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-DynamicContentCard/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-DynamicContentCard/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HideACE/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HideACE/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HideACE/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-OfficeLocator/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-OfficeLocator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-OfficeLocator/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-OfficeLocator/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-FAQs/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-FAQs/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-FAQs/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-FAQs/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-FAQs/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Search-FAQs/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Search-FAQs/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.20.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Service-Health/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Service-Health/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Service-Health/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Service-Health/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Service-Health/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Stock-Price-Chart/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Stock-Price-Chart/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HTML-React-Stock-Price-Chart/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-HybridWork-Checkin/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-HybridWork-Checkin/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Internships/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-Internships/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Internships/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-LibraryLoans/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-LibraryLoans/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-LibraryLoans/assets/sample.json | 0 | name | name.duplicate | Also used by pnp/sp-dev-fx-aces/samples/ImageCard-Internships/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-LibraryLoans/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-MostLikedPages/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-MostLikedPages/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-MostLikedPages/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-my-recent-files/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-my-recent-files/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-my-recent-files/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-MyLocation/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-MyLocation/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-MyLocation/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-OfficeLocations/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-OfficeLocations/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-OneDriveCarousel/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-OneDriveCarousel/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-OneDriveCarousel/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-PromotePages/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-PromotePages/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-PromotePages/assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/ImageCard-PropotePage/assets/card-preview.png |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-PublicHolidays/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-PublicHolidays/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Rss/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-Rss/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Rss/assets/sample.json | 0 | shortDescription | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Rss/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-sales-orders/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-sales-orders/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-sales-orders/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-sales-orders/assets/sample.json | 0 | thumbnails[0].url | asset.case-mismatch | Filename casing differs from samples/ImageCard-sales-orders/assets/SalesOrders.png. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-sales-orders/assets/sample.json | 0 | url | url.source-mismatch | Expected the sample directory in pnp/sp-dev-fx-aces: samples/ImageCard-sales-orders |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Scholarships/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-Scholarships/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Scholarships/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-TodaysLunch/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-TodaysLunch/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-TodaysLunch/assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/ImaceCard-TodaysLunch/assets/preview.gif |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Tuitions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-Tuitions/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Tuitions/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Weather/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-Weather/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| error | pnp/sp-dev-fx-aces/samples/ImageCard-WorldClock/assets/sample.json | 0 | updateDateTime | date.order | Update date is earlier than creation date. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Generic-NewItem/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/InputCard-Generic-NewItem/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Generic-NewItem/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-PeopleSearch/assets/sample.json | 0 | title | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Prompt-Survey/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Prompt-Survey/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Prompt-Survey/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Prompt-Survey/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Start-Chat/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Start-Chat/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-Start-Chat/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-StatusMessage/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/InputCard-StatusMessage/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/InputCard-StatusMessage/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ChatGPTDailyInsights/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ChatGPTDailyInsights/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ChatGPTDailyInsights/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ChatGPTDailyInsights/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Covid-Indicator/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Covid-Indicator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-CreateTeam/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-CreateTeam/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Dynamic-Announcements/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Dynamic-Announcements/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-EmailSummary/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-EmailSummary/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-EmailSummary/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-EmailSummary/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FlightTracker/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FlightTracker/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FlightTracker/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FlightTracker/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Follow-Documents/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Follow-Documents/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FootballStats/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FootballStats/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-FootballStats/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-JoinNewTeams/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-JoinNewTeams/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-JoinNewTeams/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-UnreadEmails/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-UnreadEmails/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Graph-UnreadEmails/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ManageTeam/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-ManageTeam/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-my-calendar-plan/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-my-calendar-plan/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.14.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-my-calendar-plan/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-my-calendar-plan/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-My-M365-Groups/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-My-M365-Groups/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-My-Notifications/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-My-Notifications/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyEmails/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyEmails/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyEmails/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyShifts/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyShifts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-MyShifts/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-NewsFeed | - | $ | metadata.missing | Sample folder has no sample.json; it cannot appear in the gallery yet. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-PeopleDetails/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-PeopleDetails/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-PeopleDetails/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-PlannerTasks/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-PlannerTasks/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.13.0-beta.20. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-RecentFiles/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-RecentFiles/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-RecentFiles/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Search/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Search/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Search/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Service-Health/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-Service-Health/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-SkillsOverview/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-StockBitcoinFeed/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-StockBitcoinFeed/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-TfL-Status/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-TfL-Status/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-WordOfTheDay/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-WordOfTheDay/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-WordOfTheDay/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-WorkIQ-TodaySummary/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/samples/PrimaryTextCard-WorkIQ-TodaySummary/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/SearchCard-SamplesGallerySearch/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/samples/SearchCard-SamplesGallerySearch/assets/sample.json | 0 | metadata.SPFX-VERSION | version.package-mismatch | Package dependencies declare 1.23.0. |
| warning | pnp/sp-dev-fx-aces/samples/SearchCard-SamplesGallerySearch/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/samples/SearchCard-SamplesGallerySearch/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/scenarios/ace-data-api-builder/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-aces/scenarios/ace-lob/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/scenarios/ace-lob/assets/sample.json | 0 | longDescription | array.invalid | Expected an array of non-empty strings. |
| warning | pnp/sp-dev-fx-aces/scenarios/ace-lob/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-aces/scenarios/ace-microsoftgraph/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-aces/scenarios/ace-microsoftgraph/assets/sample.json | 0 | longDescription | array.invalid | Expected an array of non-empty strings. |
| warning | pnp/sp-dev-fx-aces/scenarios/ace-microsoftgraph/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/jquery-application-toastr/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/jquery-field-itemorder/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-alert-message/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-analytics/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-appinsights-advanced/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-appinsights-advanced/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-appinsights/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-dynamically-importing-styles/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-graph-client/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-graph-client/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-gtm-injector/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-gtm-injector/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-header-toggler/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-intranet-searchbox/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-listdrivenplaceholders/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-listdrivenplaceholders/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-microsoft-clarity/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-microsoft-clarity/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json | 0 | gallery.componentTypes | component.unclassified | Extension subtype requires source metadata/manifest correction. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| error | pnp/sp-dev-fx-extensions/samples/js-application-redirect/assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/js-application-redirect/ext-redirects.png |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-run-once/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-application-run-once/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| error | pnp/sp-dev-fx-extensions/samples/js-application-run-once/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-clone/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-clone/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-convert-to-pdf/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-copy-classic-link/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-hide-commands/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-item-permissions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-item-permissions/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-lock-item/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-lock-item/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-selecteditems-export/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-command-selecteditems-export/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-animated-progress/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-animated-progress/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-animated-progress/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-conditionalformatting/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-conditionalformatting/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-taskpriority/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-taskpriority/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-weather/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-field-weather/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/js-guest-message/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[3].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/js-share-to-teams/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-aadtokenprovider-bot/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-access-lens/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-app-announcements/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-app-announcements/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alert-banner/Assets/sample.json | - | $ | metadata.location | Use the canonical assets/sample.json path and casing. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alert-banner/Assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alert-banner/Assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-extensions/samples/react-application-alert-banner/Assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/react-application-alert-banner/assets/preview.gif |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alerts/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alerts/assets/sample.json | 0 | gallery.componentTypes | component.unclassified | Extension subtype requires source metadata/manifest correction. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alerts/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-alerts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-announcements/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-botframework-chat/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-breadcrumb/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-chatbubble-copilot/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[8].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-collab-footer/assets/sample.json | 0 | thumbnails[9].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-copy-page/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-copy-page/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-copy-page/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-copy-page/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-copy-page/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-customizer-feedback-widget/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-customizer-feedback-widget/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-customizer-notification/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-duetasks/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-duetasks/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-festivals/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-grouplinks/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-grouplinks/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-injectcss/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-logo-festoon/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-m365-service-health/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-m365-service-health/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-m365-service-health/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-m365-service-health/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-machine-translations/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-messagebanner/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-flows-list/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-my-lists-notifications/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-myfavourites/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-myfollowedsites/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-nav-search-driven/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[10].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[8].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-navigation-header/assets/sample.json | 0 | thumbnails[9].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-news-ticker/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-office-groups-nav/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-office-groups-nav/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-page-comments-sentiment/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-page-related-bing-news/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-personal-assistant/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-portal-footer/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-portal-footer/assets/sample.json | 0 | gallery.componentTypes | component.unclassified | Extension subtype requires source metadata/manifest correction. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-portal-footer/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-portal-footer/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-pva-bot/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-pva-bot/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-qna-chat/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-qna-chat/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-quick-create/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-quick-create/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-quick-register-to-appointment/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-quick-register-to-appointment/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-regions-footer/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-regions-footer/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-search-dynamicdata/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-sitepagecoremetadata/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-sites-hubsite-switcher/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-sites-hubsite-switcher/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-smart-context/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-team-archived-notification/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-team-archived-notification/assets/sample.json | 0 | gallery.componentTypes | component.unclassified | Extension subtype requires source metadata/manifest correction. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-team-archived-notification/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-teams-chats-sharepoint/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-teams-chats-sharepoint/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-tenant-global-navbar/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-tenant-telemetry-listener/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-tfl-status/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-tfl-status/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-weather-widget/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-webhooks-notification/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-webhooks-notification/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-extensions/samples/react-application-webhooks-notification/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-bot-framework-secure/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-bot-framework-sso/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-addfolders/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-ai-document-assistant/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-ai-document-assistant/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-authenticated-flowtrigger/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-change-page-layouttype/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-change-page-layouttype/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-change-page-layouttype/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-convert-to-pdf/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-extensions/samples/react-command-convert-to-pdf/assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/react-command-convert-to-pdf/screenshot.gif |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-copy-move-items/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-copy-move-items/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-copy-pnp-search-webpart-settings/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-copy-pnp-search-webpart-settings/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-custom-command-bar/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-custom-command-bar/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-demote-news/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-dialog/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-direct-link/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-directions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-directions/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-discuss-now/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-discuss-now/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-document-translation/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-document-translation/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-documents-redaction/Assets/sample.json | - | $ | metadata.location | Use the canonical assets/sample.json path and casing. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-documents-redaction/Assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-documents-redaction/Assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-extensions/samples/react-command-documents-redaction/Assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/react-command-documents-redaction/assets/preview.gif |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-file-size-viewer/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-folder-select/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-follow-document/Assets/sample.json | - | $ | metadata.location | Use the canonical assets/sample.json path and casing. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-follow-document/Assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-follow-document/Assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-form-settings/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-get-thumbnail/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-image-editor/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-live-dashboard-sharepoint/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-live-dashboard-sharepoint/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-live-dashboard-sharepoint/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-mail-view-as-image/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-manage-list-subscriptions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-movedoc2blob/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-movedoc2blob/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-movedoc2blob/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-movedoc2blob/assets/sample.json | 0 | thumbnails[3].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-movedoc2blob/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-page-model-pnpjs/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-print/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-qrcode/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-share-pnpjs/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-share-to-teams/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-share-to-teams/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-singlepartapppage/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-task-mgmt/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-task-mgmt/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-command-vision-api/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-driveitem-properties/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-driveitem-properties/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-dynamic-form-with-location-picker/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-dynamic-site-form/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-attachment-info/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-pnp-field-renderer-helper/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-pnp-file-type-renderer/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-reporting/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-reporting/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-reporting/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-reporting/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-reporting/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-slider/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-slider/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-text-analytics-api/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-text-analytics-api/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-toggle/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-toggle/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-unique-permissions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-user-permission/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-votes/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-field-votes/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-formcustomizer-customers/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-hidefrom-externalusers/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-item-History/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-item-History/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-jump-to-folder/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-mega-menu/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-menu-footer-classic-modern/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-menu-footer-classic-modern/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-extensions/samples/react-modern-version-history/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-msal-bot/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-my-sites-hub/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-my-sites-hub/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-my-sites-hub/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-send-document/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-send-to-teams/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-share-via-teams-chat-extension/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-share-via-teams-chat-extension/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-share-via-teams-chat-extension/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-extensions/samples/react-site-content-ribbon-extension/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/sp-dev-fx-extensions/samples/react-site-content-ribbon-extension/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| warning | pnp/sp-dev-fx-extensions/samples/react-utility-extensions/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-extensions/samples/react-utility-extensions/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/aad-api-spo-cookie/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-aad-webapi/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-migration/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-msgraph/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-multipage/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-ngofficeuifabric-file-upload/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-ngofficeuifabric-todo/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-ngofficeuifabric-todo/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-search/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular-todo/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angular2-prototype/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angularelements-helloworld/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/angularelements-html-templatefile/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/bootstrap-slider/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/handlebarsjs-webpack-loader/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/jquery-cdn/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/jquery-photopile/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/js-applicationinsights-api-calls-tracking/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-applicationinsights-api-calls-tracking/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-applicationinsights-api-calls-tracking/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-demo-time/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-demo-time/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-demo-time/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-demo-time/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-demo-time/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-employee-spotlight/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/js-extend-gulp/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/js-extend-webpack/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/js-mermaid-diagram/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-mermaid-diagram/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/js-powerbi-embedded/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/js-smart-table-of-contents/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-webparts/samples/js-smart-table-of-contents/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-webparts/samples/js-solution-editions/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/js-theme-manager-2019/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/knockout-dependent-properties/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/knockout-taxonomy/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-3rd-party-api/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-aad-implicitflow/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-aad-webapi/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-accordion-with-richtext/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-adaptive-card-host-control/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-adaptive-card-host-control/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-adaptive-card-host-control/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-add-formcustomizer-to-list/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-add-formcustomizer-to-list/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json | 1 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json | 1 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json | 1 | name | name.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json | 1 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-advent-calendar/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-aggregated-calendar/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-animpage/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-animpage/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-animpage/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-apim-tablestorage/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-associated-sites-links/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[3].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-at-a-glance/assets/sample.json | 0 | thumbnails[5].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azfunc-vimeo/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azure-devops-tasks/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azure-openai-api-stream/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azure-openai-connector/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azurefunction-northwind2/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-azurefunction-northwind2/assets/sample.json | 0 | title | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-webparts/samples/react-banner/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-banner/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-banner/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-birthdays-per-month/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | name | name.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[1].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/ballonsBackgroud.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[10].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof14.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[11].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof14_1.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[12].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof17.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[13].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof18.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[14].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof181.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[15].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof19.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[16].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof2.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[17].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof20.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[18].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof21.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[19].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof22.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[2].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/baloons.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[20].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof24.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[21].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof28.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[22].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof29.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[23].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof3.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[24].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof30.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[25].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof4.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[26].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof5.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[27].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof6.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[28].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof7.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[29].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof8.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[30].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof9.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[4].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/birthdays2.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[5].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[6].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof1.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[7].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof10.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[8].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof11.png |
| error | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | thumbnails[9].url | asset.missing | Asset not found in collected repository tree: samples/react-birthdays/assets/cof12.png |
| warning | pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json | 1 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-birthdays/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-bookmark-hub/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-bookmark-hub/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-bookmark-hub/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-bubble-template/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-caml2table/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-carbon-footprint-calculator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cascadingdropdowns/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cascadingdropdowns/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cascadingdropdowns/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 0 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 1 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 1 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 2 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 2 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 3 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 3 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 4 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 4 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 5 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 5 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 6 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 6 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 7 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 7 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 8 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 8 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 9 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 9 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 10 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 10 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 11 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 11 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 12 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 12 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 13 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 13 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 14 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 14 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 15 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 15 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 16 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 16 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 17 | metadata[4] | metadata.duplicate-key | Repeated metadata key: PNPCONTROLS |
| warning | pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json | 17 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-chartcontrol/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-gpt/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-gpt/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-gpt/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-gpt/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-sk/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-sk/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-sk/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chat-sk/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chatgpt-app/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cherry-picked-content/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cherry-picked-content/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-chrome-built-in-ai-summarise-page-content/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-company-stories/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-company-stories/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-company-stories/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-connected-web-parts/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-connected-web-parts/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-connected-web-parts/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-connected-web-parts/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-content-query-onprem/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-content-rollup/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-apis-explorer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-apis-explorer/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-apis-explorer/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-apis-explorer/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-chat-api-demo/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-chatbubble-with-sso/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-chatbubble-with-sso/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-html-app-integrator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-html-app-integrator/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-html-app-integrator/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-html-app-integrator/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-prompt-gallery/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-retrieval-api/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-retrieval-api/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-copilot-retrieval-api/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-cross-device-data/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-csv-importer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-csv-importer/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-action-manager/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-action-manager/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-action-manager/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-action-manager/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-localization/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-localization/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-custom-localization/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dall-e-image-generation/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dashboards/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-data-access-options/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dataverse/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-delivery-plan/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-delivery-plan/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-delivery-plan/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-delivery-plan/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-designpatterns-typescript/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[8].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-directory/assets/sample.json | 0 | thumbnails[9].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-document-ai-chat/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-document-ai-chat/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-document-ai-chat/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-download-multiple-documents/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dragmatch-game/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dynamic-poll/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dynamic-poll/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dynamic-poll/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dynamic-poll/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-dynamic-poll/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-easter-egg-hunt-game/assets/sample.json | 0 | metadata.CLIENT-SIDE-DEV | technology.missing | Technology filter metadata is missing. |
| warning | pnp/sp-dev-fx-webparts/samples/react-employees-onboarding/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-employees-onboarding/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-employees-onboarding/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-employees-onboarding/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-engage-hub/assets/sample.json | 0 | authors[1].gitHubAccount | author.account-format | Check the GitHub account format. |
| warning | pnp/sp-dev-fx-webparts/samples/react-engage-hub/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-engage-hub/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-engage-hub/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-button/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-page-properties/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-enhanced-powerapps/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-environment-settings/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-events-aggregator/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-events/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-events/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-events/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-events/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-extension-manager/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-faqs/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-feature-framework/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-feedback-sidebar/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-feedback-sidebar/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-feedback-sidebar/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-file-type-distribution/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-file-type-distribution/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-file-upload/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-flag-template/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-flow-button/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-flow-dashboard/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-fluentui-9/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-fluentui-9/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-fluentui-9/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-fluentui-theme-variant/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-followed-drag-and-drop-grid/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-followedsites/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-followedsites/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-form-builder/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-form-builder/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-gantt/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-gantt/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-gantt/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-global-news-sp2019/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[10].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[11].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[12].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[13].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[14].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[15].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[16].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[17].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[18].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[19].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[8].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-governor-sharing/assets/sample.json | 0 | thumbnails[9].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-azureapps/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-azureapps/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-evalurl/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-groupviewer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-mgt-client/assets/sample.json | 0 | shortDescription | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-profile-awards/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-telephonedirectory/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-webpart-report/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-webpart-report/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-graph-webpart-report/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-group-members-webpart/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-group-members-webpart/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-webparts/samples/react-group-members/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| warning | pnp/sp-dev-fx-webparts/samples/react-group-membership-manager/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-group-membership-manager/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-groups-teams/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-groups-teams/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-groups-teams/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-groups-teams/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-heft-plugin/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero-webpart/assets/sample.json | 0 | shortDescription | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero-webpart/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hero/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-holidays-calendar/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-holidays-calendar/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hot-desk-booking/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hot-desk-booking/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-htm-templating/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hub-site-navigator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hub-site-navigator/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-hub-site-navigator/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-image-editor/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-image-editor/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-image-magnifier/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-instagram/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-interactive-map/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-interactive-map/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-interactive-map/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-interactive-map/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-interactive-map/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invitation-manager/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invoice-generator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invoice-generator/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invoice-generator/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invoice-generator/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-invoice-generator/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-item-History/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-json-form/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-knowledge-source-health/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-knowledge-source-health/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-legallens/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-legallens/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-legallens/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-links/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-links/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-links/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-items-menu-sp2019/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-view-metrics/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-view-metrics/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-view-metrics/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-view-metrics/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-list-view-metrics/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lists-hide/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lists-hide/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lists-hide/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lob-integration/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lob-integration/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-lob-integration/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-M365-Planner-Timeline/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-m365-services-health/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-manage-schema-extensions/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-manage-schema-extensions/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-manage-schema-extensions/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-manage-schema-extensions/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mcp-client/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mcp-client/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mcp-client/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mcs-hr-assistant/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mcs-hr-assistant/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-microsoft-learn-agent/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-microsoft-learn-agent/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-migrate-settings-approot/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-mobx/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-birthdays/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-birthdays/assets/sample.json | 1 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-birthdays/assets/sample.json | 1 | url | url.duplicate | Also used by pnp/sp-dev-fx-webparts/samples/react-modern-birthdays/assets/sample.json#0; records remain namespaced, not silently deduplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-calendar/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-carousel/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-link-presenter/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-modern-link-presenter/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-msal-msgraph/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-multilist-grid/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-multipage/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-approvals/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-dashboard/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-onedrive-info/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-onedrive-info/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-qr-code-generator/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-qr-code-generator/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-qr-code-generator/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-my-workspaces-hub/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-navigation-tabs/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-news-banner/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-news-banner/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-news-extension/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-nutrient-document-viewer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-nutrient-document-viewer/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-office-breakout/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-officegraph/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-offline-first/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-okr-tracker/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-openai-devops/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-openai-summarise-page-content/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-organisationchart/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-organization-chart/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-organization-chart/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-organization-chart/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-palette-picker/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-palette-picker/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-password-vault/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-password-vault/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-password-vault/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-password-vault/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-password-vault/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-people-directory/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-people-directory/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-people-directory/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-people-slick/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-people-slick/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-anniversary-counter/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-anniversary-counter/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-calendar/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-calendar/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-calendar/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-contacts/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-contacts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-contacts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-dashboard/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-dashboard/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-dashboard/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-email/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-email/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-email/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tasks/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tasks/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tasks/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[6].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[7].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-personal-tools-list/assets/sample.json | 0 | thumbnails[8].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-pnp-js-hooks/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-pnp-js-sample/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-pnpjs-http-client/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-pnpjs-spsite-er-diagram/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-pnpjs-spsite-er-diagram/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-poll/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerapps-power-palette/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerapps-power-palette/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerapps-power-palette/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerautomate-approvals/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerautomate-approvals/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerautomate-approvals/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerautomate-approvals/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-powerautomate-approvals/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ppp-pnp-controls/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ppp-pnp-controls/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ppw-html/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ppw-html/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-private-libraries/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-provision-assets/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-provision-assets/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-public-holidays-global/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-quick-links-grid/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-quick-links-grid/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-quick-links-grid/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-quick-links-grid/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-quick-links/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-real-time/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-realtime-incidentdashboard/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recent-contacts/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recent-contacts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recent-contacts/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-used-documents/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-used-documents/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-used-documents/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-visited-sites/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-visited-sites/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-recently-visited-sites/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-redux-async-immutablejs/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-redux/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-reduxform/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-rhythm-of-business-calendar/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-richtext-editor/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-roomchat/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-roomchat/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-rss-reader/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-rss-reader/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-rss-reader/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sales-orders/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sales-orders/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sales-orders/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sales-orders/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-save-to-onedrive-app-personal-folder/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-save-to-onedrive-app-personal-folder/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-save-to-onedrive-app-personal-folder/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-search/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-securitygrid/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-settings-approot/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-side-panel/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-site-content/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| error | pnp/sp-dev-fx-webparts/samples/react-site-content/assets/sample.json | 0 | thumbnails[0].url | asset.missing | Asset not found in collected repository tree: samples/react-site-content/assets/SiteContentWebpart.png |
| warning | pnp/sp-dev-fx-webparts/samples/react-site-information/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-site-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-site-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepage-migration/assets/sample.json | 0 | thumbnails[5].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sitepages-metadata/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-slide-swiper/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-bookmarks/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-countdown-timer/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-elevatedprivileges/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-emp-recognition/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-emp-recognition/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-org-chart/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-org-chart/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-permission-manager/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-permission-manager/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-permission-manager/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-permission-manager/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-permission-manager/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-pnp-js-property-decorators/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-secret-santa/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-sp-tinymce/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-spo-site-game/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-spo-site-game/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-spo-site-game/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-spupsproperty-sync/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-staff-directory-sp2019/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-stock-information/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-stock-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-stock-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-styled-list/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-styled-list/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-property-controls/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-property-controls/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-property-controls/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-to-json-converter/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-to-json-converter/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-to-json-converter/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-to-json-converter/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-svg-to-json-converter/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tabacordion/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tailwindcss3/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-taxonomypicker/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-team-randomiser/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-conversationview/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-conversationview/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-conversationview/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-graph-upload-as-pdf/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-meeting-app-questionnaire/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-my-webinars/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-my-webinars/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-my-webinars/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-teams-tabs-pnpjs/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ticket-mgnt/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ticket-mgnt/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-ticket-mgnt/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tiles-v2/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tiles-v2/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tiles/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tiles/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tiles/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-tinymce/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-todo-basic/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-training-checklist/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-uieditor/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-use-reducer-hook/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-use-reducer-hook/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-video-banner/assets/sample.json | 0 | shortDescription | text.whitespace | Trim leading and trailing whitespace. |
| warning | pnp/sp-dev-fx-webparts/samples/react-videolibrary/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-weather-information/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-weather-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-weather-information/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-webhooks-realtime/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-whos-in/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-world-time/assets/sample.json | 0 | gallery.componentTypes | component.unverified | Repository-family fallback used; no classifiable component manifest found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-world-time/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-world-time/assets/sample.json | 0 | metadata.SPFX-VERSION | version.unverified | No comparable SPFx package dependency found. |
| warning | pnp/sp-dev-fx-webparts/samples/react-yammer-api/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| warning | pnp/sp-dev-fx-webparts/samples/react-youtube/assets/sample.json | 0 | metadata.SPFX-VERSION | version.patch-unspecified | Legacy major.minor version accepted for filtering; supply a patch version for reproducibility. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[0].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[1].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[1].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[2].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[2].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[3].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[3].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[4].alt | preview.alt-generic | Replace generic alt text with a description of the sample. |
| warning | pnp/sp-dev-fx-webparts/samples/react-zod/assets/sample.json | 0 | thumbnails[4].order | preview.duplicate-order | Preview order is duplicated. |
| warning | pnp/sp-dev-fx-webparts/samples/riot-list/assets/sample.json | 0 | metadata.SPFX-VERSION | version.range | Package ranges cannot prove the installed SPFx version. |
| error | pnp/sp-dev-fx-webparts/samples/spfx-news/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| error | pnp/spfx-reference-scenarios/samples/ace-application-state/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| warning | pnp/spfx-reference-scenarios/samples/ace-basiccard/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-chat/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-companynews/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-designtemplate-gallery/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-expense-report/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-pnp-contoso-orders/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| error | pnp/spfx-reference-scenarios/samples/ace-shared-state/assets/sample.json | 0 | thumbnails | preview.missing | At least one image preview is required. |
| warning | pnp/spfx-reference-scenarios/samples/ace-teams-covid/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-teams-roomreservation/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-teams-worldclock/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/ace-wellbeing/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/spfx-formcustomizer-basics/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/spfx-middleware/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/spfx-obo/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
| warning | pnp/spfx-reference-scenarios/samples/spfx-productivity-dashboard/assets/sample.json | 0 | downloadUrl | download.missing | No download link; derive one explicitly in the future gallery. |
