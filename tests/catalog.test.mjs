import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { auditSnapshot } from '../.github/scripts/sample-metadata.mjs';
import { buildCatalog, toSummary } from '../src/lib/catalog-model.ts';
import { ACCOUNT_PATTERN, assertCatalog, assertSearchIndex, FALLBACK_PREVIEW, isRecord } from '../src/lib/types.ts';
import { catalog, summaries, parseCatalog, sitePath, samplePath, formatDate, formatVersion } from '../src/lib/catalog.ts';
import { formatDate as presentationDate, formatVersion as presentationVersion } from '../src/lib/presentation.ts';
import { validateCollection } from '../scripts/generate-catalog.mjs';

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [rawSamples, snapshot, report, status, registry, publicCatalog, searchIndex, previewReport] = await Promise.all([
  '../.metadata/samples.json', '../.metadata/source-data.json', '../.metadata/quality-report.json',
  '../.metadata/collection-status.json', '../.metadata/sources.json', '../public/catalog.json',
  '../public/search-index.json',
  '../public/preview-report.json',
].map(read));
const SHA = 'a'.repeat(40);

function raw(changes = {}) {
  return {
    name: 'test-sample', source: 'pnp', title: 'A sample', shortDescription: 'Sample description',
    url: 'https://github.com/pnp/test-samples/tree/main/samples/demo',
    longDescription: ['First paragraph', 'Second paragraph'],
    products: ['SharePoint'], creationDateTime: '2024-01-02', updateDateTime: '2024-02-03',
    metadata: [{ key: 'SPFX-VERSION', value: '1.24.0' }, { key: 'CLIENT-SIDE-DEV', value: 'React' }],
    thumbnails: [{ type: 'image', order: 0, url: 'https://raw.github.com/pnp/test-samples/main/samples/demo/assets/screen shot.png', alt: 'Sample screen' }],
    authors: [{ name: 'Real Author', gitHubAccount: 'Real-Author', pictureUrl: 'https://github.com/real-author.png' }],
    references: [{ name: 'Documentation', url: 'https://example.com/docs', description: 'Useful documentation' }],
    ...changes,
  };
}

function fixture(records = [raw()], options = {}) {
  const groups = options.groups ?? [{ folder: 'samples/demo', records }];
  const source = {
    repository: 'pnp/test-samples', roots: ['samples'], family: options.family ?? 'Web parts', commit: SHA,
    folders: groups.map((group) => group.folder), documents: [], files: [], packages: [], manifests: [],
    reviewedExclusions: options.exclusions ?? [], frameworkOverrides: options.overrides ?? [],
  };
  for (const group of groups) {
    const path = `${group.folder}/assets/sample.json`;
    source.documents.push({ path, text: JSON.stringify(group.records) });
    source.files.push({ path, size: 100 }, { path: `${group.folder}/assets/screen shot.png`, size: 100 });
  }
  source.files.push(...(options.files ?? []));
  source.folders.push(...(options.missing ?? []));
  for (const [kind, entries] of [['packages', options.packages ?? []], ['manifests', options.manifests ?? []]]) {
    for (const entry of entries) {
      source[kind].push(entry);
      source.files.push({ path: entry.path, size: entry.text.length });
    }
  }
  const snapshot = { formatVersion: 1, collectionId: 'test-collection', collectedAt: '2026-11-06T12:00:00Z', sources: [source] };
  const { samples, report } = auditSnapshot(snapshot, { now: new Date('2026-11-06T12:00:00Z') });
  return { samples, snapshot, report };
}

function build(input) {
  return buildCatalog(input.samples, input.snapshot, input.report);
}

function hasIssue(sample, code, field) {
  return sample.issues.some((issue) => issue.code === code && (!field || field === issue.field));
}

test('the generated catalog reconciles every real parseable record across all registered pinned sources', () => {
  assert.ok(rawSamples.length > 0);
  assert.equal(catalog.samples.length, rawSamples.length);
  assert.deepEqual(catalog.samples.map((sample) => sample.id).sort(), rawSamples.map((sample) => sample.gallery.id).sort());
  assert.equal(catalog.sources.length, registry.sources.length);
  assert.deepEqual(catalog.sources, report.sources.map(({ repository, commit, samples, missingMetadata, errors, warnings }) => ({
    repository, commit, samples, missingMetadata, errors, warnings,
  })));
  const contributors = new Set(rawSamples.flatMap((sample) => {
    if (!Array.isArray(sample.authors)) return [];
    return sample.authors.flatMap((author) => {
      if (!isRecord(author)) return [];
      const account = typeof author.gitHubAccount === 'string' ? author.gitHubAccount.trim() : '';
      if (ACCOUNT_PATTERN.test(account)) return [`github:${account.toLowerCase()}`];
      const name = typeof author.name === 'string' ? author.name.trim() : '';
      return name ? [`name:${name}`] : [];
    });
  }));
  const candidateFolders = snapshot.sources.reduce((total, source) => total + source.folders.length, 0);
  const exclusions = snapshot.sources.reduce((total, source) => total + (source.reviewedExclusions?.length ?? 0), 0);
  assert.deepEqual(catalog.totals, {
    samples: rawSamples.length, contributors: contributors.size,
    metadataFiles: snapshot.sources.reduce((total, source) => total + source.documents.length, 0),
    candidateFolders, eligibleFolders: candidateFolders - exclusions,
    missingMetadata: report.issues.filter((issue) => issue.code === 'metadata.missing').length,
    errors: report.issues.filter((issue) => issue.severity === 'error').length,
    warnings: report.issues.filter((issue) => issue.severity === 'warning').length,
  });
  assert.equal(new Set(catalog.samples.map((sample) => sample.id)).size, rawSamples.length);
  assert.equal(new Set(catalog.samples.map((sample) => sample.slug)).size, rawSamples.length);
  assert.ok(catalog.samples.every((sample) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sample.slug)));
});

test('public outputs are synchronized, runtime-validated and contain summary-only search data', () => {
  assert.deepEqual(publicCatalog, catalog);
  assert.deepEqual(searchIndex, { schemaVersion: 1, generatedAt: catalog.generatedAt, samples: catalog.samples.map(toSummary) });
  assert.deepEqual(summaries, searchIndex.samples);
  assert.doesNotThrow(() => assertCatalog(publicCatalog));
  assert.doesNotThrow(() => assertSearchIndex(searchIndex));
  assert.ok(searchIndex.samples.every((sample) => !('issues' in sample) && !('descriptionParagraphs' in sample)));
  const summary = toSummary(catalog.samples[0]);
  summary.authors.push({ name: 'Separate copy', account: null, avatar: null });
  assert.notDeepEqual(summary.authors, catalog.samples[0].authors);
});

test('baseline findings remain visible and no metadata-missing sample is fabricated', () => {
  const byId = new Map(catalog.samples.map((sample) => [sample.id, sample]));
  for (const issue of report.issues) {
    if (issue.index !== undefined) {
      const sample = byId.get(`${issue.repository}:${issue.path}:${issue.index}`);
      if (sample) assert.ok(sample.issues.some((entry) => entry.code === issue.code && entry.field === issue.field && entry.message === issue.message));
    }
  }
  for (const missing of report.issues.filter((issue) => issue.code === 'metadata.missing')) {
    assert.ok(!catalog.samples.some((sample) => sample.id.startsWith(`${missing.repository}:${missing.path}/`)));
  }
  assert.ok(catalog.samples.every((sample) => sample.quality.issueCount === sample.issues.length && sample.quality.needsReview === sample.issues.some((issue) => issue.severity === 'error')));
});

test('every public download selects the canonical sample directory rather than a repository archive', () => {
  const inputs = new Map(rawSamples.map((record) => [record.gallery.id, record.gallery]));
  for (const sample of catalog.samples) {
    const gallery = inputs.get(sample.id);
    assert.ok(gallery);
    const download = new URL(sample.downloadUrl);
    assert.equal(download.origin, 'https://pnp.github.io');
    assert.equal(download.pathname, '/download-partial/');
    assert.equal(download.searchParams.size, 1);
    const selected = new URL(download.searchParams.get('url'));
    assert.equal(selected.origin, 'https://github.com');
    assert.equal(decodeURIComponent(selected.pathname), `/${gallery.repository}/tree/main/${gallery.samplePath}`);
    assert.equal(selected.search, '');
    assert.equal(selected.hash, '');
    assert.ok(!sample.downloadUrl.includes('/archive/'));
    assert.ok(!sample.downloadUrl.endsWith('.zip'));
  }
});

test('known GitHub previews are pinned, path-encoded and exist in the exact source tree', () => {
  const sources = new Map(snapshot.sources.map((source) => [source.repository, source]));
  const trees = new Map(snapshot.sources.map((source) => [
    source.repository, new Map(source.files.map((file) => [file.path, file.size])),
  ]));
  const optimizedSources = new Map(previewReport.previews.filter((preview) => preview.status === 'optimized')
    .map((preview) => [preview.localPath, preview.sourceUrl]));
  for (const sample of catalog.samples) {
    const source = sources.get(sample.repository);
    assert.ok(source);
    assert.ok(sample.sourceUrl.startsWith(`https://github.com/${source.repository}/tree/${source.commit}/`));
    assert.ok(sample.metadataUrl.startsWith(`https://github.com/${source.repository}/blob/${source.commit}/`));
    for (const preview of sample.previews) {
      if (preview.isFallback) {
        assert.deepEqual(preview, FALLBACK_PREVIEW);
      } else {
        const sourceUrl = optimizedSources.get(preview.src) ?? preview.src;
        if (preview.src.startsWith('/')) assert.ok(optimizedSources.has(preview.src));
        assert.equal(new URL(sourceUrl).protocol, 'https:');
        if (new URL(sourceUrl).hostname !== 'raw.githubusercontent.com') continue;
        const [owner, repo, commit, ...parts] = new URL(sourceUrl).pathname.slice(1).split('/');
        const target = sources.get(`${owner}/${repo}`);
        if (!target) continue;
        assert.equal(commit, target.commit);
        const size = trees.get(target.repository).get(parts.map(decodeURIComponent).join('/'));
        assert.ok(size > 0);
      }
    }
  }
});

test('optimized outputs exist, preserve URL provenance and change no source findings or other catalog fields', async () => {
  const original = buildCatalog(rawSamples, snapshot, report);
  const originals = new Map(original.samples.map((sample) => [sample.id, sample]));
  const entries = new Map(previewReport.previews.map((entry) => [entry.sourceUrl, entry]));
  const primaryUrls = new Set(original.samples.filter((sample) => !sample.preview.isFallback).map((sample) => sample.preview.src));
  assert.equal(previewReport.catalogGeneratedAt, catalog.generatedAt);
  assert.equal(previewReport.totals.attempted, primaryUrls.size);
  assert.equal(previewReport.totals.optimized + previewReport.totals.failed, primaryUrls.size);
  for (const sample of catalog.samples) {
    const source = originals.get(sample.id);
    assert.ok(source);
    const { preview: _preview, previews: _previews, ...other } = sample;
    const { preview: _sourcePreview, previews: _sourcePreviews, ...sourceOther } = source;
    assert.deepEqual(other, sourceOther);
    if (source.preview.isFallback) {
      assert.deepEqual(sample.preview, FALLBACK_PREVIEW);
      continue;
    }
    const entry = entries.get(source.preview.src);
    assert.ok(entry);
    assert.ok(entry.sampleIds.includes(sample.id));
    if (entry.status === 'optimized') {
      assert.equal(sample.preview.src, entry.localPath);
      assert.equal(sample.preview.alt, source.preview.alt);
      assert.equal(sample.preview.isFallback, false);
      assert.match(entry.localPath, /^\/images\/previews\/[a-f0-9]{64}\.webp$/);
      assert.ok(entry.width <= 960 && entry.height <= 540);
    } else {
      assert.equal(entry.status, 'failed');
      assert.ok(entry.reason);
      assert.deepEqual(sample.preview, FALLBACK_PREVIEW);
    }
  }
  await Promise.all(previewReport.previews.filter((entry) => entry.status === 'optimized').map(async (entry) => {
    const file = await stat(new URL(`../public${entry.localPath}`, import.meta.url));
    assert.equal(file.size, entry.bytesAfter);
    assert.ok(file.size > 0);
  }));
  assert.equal(previewReport.totals.bytesBefore, previewReport.previews.reduce((total, entry) => total + entry.bytesBefore, 0));
  assert.equal(previewReport.totals.bytesAfter, previewReport.previews.reduce((total, entry) => total + entry.bytesAfter, 0));
});

test('broken, wrong-case, empty and branding images are skipped in stable declared order', () => {
  const thumbnails = [
    { type: 'image', order: 0, url: 'https://raw.github.com/pnp/test-samples/main/samples/demo/assets/missing.png', alt: 'Missing' },
    { type: 'image', order: 1, url: 'https://raw.github.com/pnp/test-samples/main/samples/demo/assets/Empty.png', alt: 'Wrong case' },
    { type: 'image', order: 2, url: 'https://raw.github.com/pnp/test-samples/main/samples/demo/assets/empty.png', alt: 'Empty' },
    { type: 'image', order: 3, url: 'https://raw.github.com/pnp/test-samples/main/samples/demo/assets/pnp-samples.png', alt: 'Branding' },
    { type: 'image', order: 4, url: 'https://github.com/pnp/test-samples/blob/refs/heads/main/samples/demo/assets/screen%20shot.png?raw=1', alt: 'First valid' },
    { type: 'image', order: 4, url: 'https://raw.githubusercontent.com/pnp/test-samples/refs/heads/main/samples/demo/assets/second.png', alt: 'Second valid' },
  ];
  const sample = build(fixture([raw({ thumbnails })], { files: [
    { path: 'samples/demo/assets/empty.png', size: 0 },
    { path: 'samples/demo/assets/pnp-samples.png', size: 200 },
    { path: 'samples/demo/assets/second.png', size: 200 },
  ] })).samples[0];
  assert.deepEqual(sample.previews.map((preview) => preview.alt), ['First valid', 'Second valid']);
  assert.equal(sample.preview.src, `https://raw.githubusercontent.com/pnp/test-samples/${SHA}/samples/demo/assets/screen%20shot.png`);
  assert.ok(hasIssue(sample, 'preview.branding'));
  assert.ok(hasIssue(sample, 'asset.missing'));
  assert.ok(hasIssue(sample, 'asset.empty'));
});

test('all-unusable previews get the exact labelled fallback and external HTTPS images remain usable', () => {
  for (const thumbnails of [[], null, 'legacy string', [{ type: 'image', order: 1, url: 'javascript:alert(1)', alt: 'Unsafe' }]]) {
    const sample = build(fixture([raw({ thumbnails })])).samples[0];
    assert.deepEqual(sample.preview, FALLBACK_PREVIEW);
    assert.deepEqual(sample.previews, [FALLBACK_PREVIEW]);
    assert.equal(sample.quality.needsReview, true);
  }
  const sample = build(fixture([raw({
    thumbnails: [{ type: 'image', order: 0, url: 'https://cdn.example.com/image', alt: 'External screenshot' }],
  })])).samples[0];
  assert.equal(sample.preview.src, 'https://cdn.example.com/image');
  assert.equal(sample.preview.isFallback, false);
  assert.ok(hasIssue(sample, 'preview.external-unverified'));
});

test('safe links are derived from provenance rather than legacy URLs; unsafe references and avatars never escape', () => {
  const sample = build(fixture([raw({
    url: 'javascript:alert(1)', downloadUrl: 'data:text/html,unsafe',
    authors: [{ name: 'Actual Name', gitHubAccount: 'bad account', pictureUrl: 'https://user:password@example.com/a.png' }],
    references: [
      { name: 'Bad', description: 'Bad', url: 'javascript:alert(1)' },
      { name: 'HTTP', description: 'HTTP', url: 'http://example.com' },
      { name: 'Credentials', description: 'Bad', url: 'https://user:pass@example.com' },
      { name: 'Good', description: 'Actual documentation', url: 'https://example.com/docs' },
    ],
  })])).samples[0];
  for (const key of ['sourceUrl', 'revisionUrl', 'metadataUrl']) assert.ok(sample[key].startsWith('https://github.com/pnp/test-samples/'));
  assert.equal(new URL(sample.downloadUrl).searchParams.get('url'), 'https://github.com/pnp/test-samples/tree/main/samples/demo');
  assert.deepEqual(sample.authors, [{ name: 'Actual Name', account: null, avatar: null }]);
  assert.deepEqual(sample.references.map((reference) => reference.title), ['Good']);
  assert.ok(hasIssue(sample, 'url.unsafe'));
});

test('partial downloads encode the selected repository path and ignore unsafe raw URLs', () => {
  const folder = 'samples/A space & café #1';
  const catalog = build(fixture([], { groups: [{
    folder,
    records: [raw({ url: 'https://github.com/attacker/wrong/tree/main/elsewhere', downloadUrl: 'javascript:alert(1)' })],
  }] }));
  const download = new URL(catalog.samples[0].downloadUrl);
  assert.equal(download.origin, 'https://pnp.github.io');
  assert.equal(download.pathname, '/download-partial/');
  assert.equal(download.searchParams.size, 1);
  assert.equal(download.searchParams.get('url'), 'https://github.com/pnp/test-samples/tree/main/samples/A%20space%20%26%20caf%C3%A9%20%231');
  assert.equal(download.hash, '');
  assert.ok(download.search.includes('%2520'));
  assert.ok(!download.href.includes('/archive/'));
  assert.ok(!download.href.includes('attacker'));
  assert.ok(!download.href.includes('javascript'));
});

test('malformed legacy arrays are explicitly flagged while valid entries and XSS-like text remain text', () => {
  const payload = '<img src=x onerror=alert(1)>';
  const sample = build(fixture([raw({
    title: payload, shortDescription: '<script>alert(1)</script>',
    products: ['SharePoint', 10, ['Teams']],
    longDescription: ['Real paragraph', null, ['Nested data']],
    authors: [null, { name: payload, gitHubAccount: 'invalid account', pictureUrl: 'data:image/svg+xml,bad' }],
    references: [null, { name: payload, url: 'https://example.com', description: payload }],
    metadata: [null, { key: 'SPFX-VERSION', value: 'bad version' }],
  })])).samples[0];
  assert.equal(sample.title, payload);
  assert.equal(sample.description, '<script>alert(1)</script>');
  assert.deepEqual(sample.products, ['SharePoint']);
  assert.deepEqual(sample.descriptionParagraphs, ['Real paragraph']);
  assert.equal(sample.authors[0].name, payload);
  assert.equal(sample.authors[0].account, null);
  assert.equal(sample.references[0].title, payload);
  for (const code of ['array.invalid', 'array.entry-invalid', 'metadata.entry-invalid', 'author.invalid', 'reference.invalid', 'text.markup']) assert.ok(hasIssue(sample, code), code);
});

test('invalid calendar dates become null without inventing timestamps', () => {
  for (const value of ['2025-02-29', '2024-02-30', '2024-13-01', 'not-a-date', '2024-01-01T25:00:00Z', null, 1234]) {
    const sample = build(fixture([raw({ creationDateTime: value, updateDateTime: value })])).samples[0];
    assert.equal(sample.created, null);
    assert.equal(sample.updated, null);
    assert.ok(hasIssue(sample, 'date.invalid', 'creationDateTime'));
    assert.equal(formatDate(sample.created), 'Date not recorded');
  }
  assert.equal(build(fixture([raw({ creationDateTime: '2024-02-29' })])).samples[0].created, '2024-02-29');
});

test('partial versions remain declared, malformed versions become Unknown, mismatches remain flagged', () => {
  const partial = build(fixture([raw({ metadata: [{ key: 'SPFX-VERSION', value: '1.20' }] })])).samples[0];
  assert.equal(partial.version, '1.20');
  assert.equal(partial.versionGroup, '1.20');
  assert.ok(hasIssue(partial, 'version.patch-unspecified'));
  const invalid = build(fixture([raw({ metadata: [{ key: 'SPFX-VERSION', value: '1.20.0,1.21.0' }] })]));
  assert.equal(invalid.samples[0].version, null);
  assert.equal(invalid.samples[0].versionGroup, null);
  assert.equal(invalid.samples[0].frameworkVersion, null);
  assert.ok(invalid.facets.versions.some((facet) => facet.value === 'Unknown'));
  assert.ok(hasIssue(invalid.samples[0], 'version.invalid'));
  for (const value of ['01.20.0', '1.020.0', '1.20.0-01', '1.20.0-beta..1', '^1.20.0']) {
    const sample = build(fixture([raw({ metadata: [{ key: 'SPFX-VERSION', value }] })])).samples[0];
    assert.equal(sample.version, null, value);
    assert.ok(hasIssue(sample, 'version.invalid'));
  }
  const mismatch = build(fixture([raw()], { packages: [{
    path: 'samples/demo/package.json', text: JSON.stringify({ dependencies: { '@microsoft/sp-core-library': '1.23.0' } }),
  }] })).samples[0];
  assert.ok(hasIssue(mismatch, 'version.package-mismatch'));
  assert.equal(mismatch.version, '1.24.0');
});

test('Bot Framework overrides retain their declaration and never acquire an SPFx version', () => {
  const sample = build(fixture([raw({
    metadata: [{ key: 'BOT-FRAMEWORK-VERSION', value: 'bot40' }],
  })], {
    family: 'Adaptive Card Extensions',
    overrides: [{ path: 'samples/demo', framework: 'Bot Framework', versionKey: 'BOT-FRAMEWORK-VERSION' }],
  })).samples[0];
  assert.equal(sample.framework, 'Bot Framework');
  assert.equal(sample.frameworkVersion, 'bot40');
  assert.equal(sample.version, null);
  assert.equal(sample.versionGroup, 'Not applicable');
  assert.deepEqual(sample.experiences, ['Connections']);
  assert.equal(formatVersion(sample), 'Bot Framework');
  assert.equal(formatVersion(toSummary(sample)), 'Bot Framework');
  const bots = catalog.samples.filter((sample) => sample.framework === 'Bot Framework');
  const rawBots = rawSamples.filter((sample) => sample.gallery.framework === 'Bot Framework');
  assert.equal(bots.length, rawBots.length);
  for (const rawBot of rawBots) {
    const bot = bots.find((sample) => sample.id === rawBot.gallery.id);
    assert.ok(bot);
    assert.equal(bot.version, null);
    assert.equal(bot.frameworkVersion, rawBot.gallery.frameworkVersion);
    assert.equal(bot.versionGroup, 'Not applicable');
  }
});

test('Copilot experience does not imply SharePoint support from the generic product label', () => {
  const copilot = build(fixture([raw()], { family: 'Copilot components' })).samples[0];
  assert.deepEqual(copilot.experiences, ['Copilot']);
  const manifests = [{
    path: 'samples/demo/src/component.manifest.json',
    text: '{"componentType":"CopilotComponent","supportedHosts":["TeamsTab","SharePointWebPart"]}',
  }];
  const multi = build(fixture([raw()], { family: 'Copilot components', manifests })).samples[0];
  assert.ok(multi.experiences.includes('Teams'));
  assert.ok(multi.experiences.includes('SharePoint'));
});

test('duplicate names and multi-record metadata yield deterministic collision-free slugs without deduplication', () => {
  const input = fixture([raw({ name: 'Same' }), raw({ name: 'same' }), raw({ name: 'sáme' })]);
  const first = build(input);
  const second = build({ ...input, samples: [...input.samples].reverse() });
  assert.equal(first.samples.length, 3);
  assert.equal(new Set(first.samples.map((sample) => sample.id)).size, 3);
  assert.equal(new Set(first.samples.map((sample) => sample.slug)).size, 3);
  assert.deepEqual(first.samples.map((sample) => sample.slug), second.samples.map((sample) => sample.slug));
  assert.ok(first.samples.every((sample) => sample.slug.startsWith('pnp-test-samples-same-')));
  assert.ok(first.samples.every((sample) => sample.slug.length < 200));
});

test('natural names cannot collide with digest-suffixed slugs from duplicate names', () => {
  const id = 'pnp/test-samples:samples/demo/assets/sample.json:0';
  const hash = createHash('sha256').update(id).digest('hex').slice(0, 16);
  const catalog = build(fixture([raw({ name: 'same' }), raw({ name: 'same' }), raw({ name: `same-${hash}` })]));
  assert.equal(new Set(catalog.samples.map((sample) => sample.slug)).size, 3);
  assert.equal(catalog.samples[2].slug, `pnp-test-samples-same-${hash}`);
  assert.notEqual(catalog.samples[0].slug, catalog.samples[2].slug);
});

test('ordinary warnings are retained without review badges, while known errors require review', () => {
  const warningOnly = build(fixture()).samples[0];
  assert.ok(warningOnly.issues.length > 0);
  assert.ok(warningOnly.issues.every((issue) => issue.severity === 'warning'));
  assert.equal(warningOnly.quality.needsReview, false);
  const error = build(fixture([raw({ creationDateTime: 'not-a-date' })])).samples[0];
  assert.equal(error.quality.needsReview, true);
});

test('contributors merge account casing, count once per sample and retain invalid-account names', () => {
  const input = fixture([
    raw({ authors: [
      { name: 'Actual Name', gitHubAccount: 'Valid-User' },
      { name: 'Actual Name', gitHubAccount: 'VALID-USER' },
      { name: 'Not Invented', gitHubAccount: 'not valid' },
    ] }),
    raw({ authors: [{ name: 'Actual Name', gitHubAccount: 'valid-user' }] }),
  ]);
  const contributors = build(input).contributors;
  assert.equal(contributors.length, 2);
  assert.deepEqual(contributors.find((contributor) => contributor.account !== null), {
    id: 'github:valid-user', name: 'Actual Name', account: 'valid-user', avatar: null, count: 2,
  });
  assert.equal(contributors.find((contributor) => contributor.account === null).name, 'Not Invented');
});

test('snapshot, registry, status, provenance and source counts must reconcile; count loss is fatal', () => {
  assert.doesNotThrow(() => validateCollection(snapshot, report, status, registry));
  for (const complete of [false, undefined, 'true']) assert.throws(() => validateCollection(snapshot, report, { ...status, complete }, registry), /incomplete/);
  assert.throws(() => validateCollection(snapshot, report, { ...status, collectionId: 'other' }, registry), /mismatched/);
  const staleRegistry = structuredClone(registry);
  staleRegistry.sources[0].family = 'Fake clean data';
  assert.throws(() => validateCollection(snapshot, report, status, staleRegistry), /registry/);
  const mutations = [
    (input) => { input.samples.length = 0; },
    (input) => { input.samples.push(input.samples[0]); },
    (input) => { input.samples[0].title = 'Not the pinned raw record'; },
    (input) => { input.samples[0].gallery.commit = 'b'.repeat(40); },
    (input) => { input.samples[0].gallery.id = 'invented-id'; },
    (input) => { input.samples[0].gallery.spfxVersion = '1.99.0'; },
    (input) => { input.snapshot.collectionId = 'other'; },
    (input) => { input.report.sources[0].samples++; },
    (input) => { input.report.sources[0].errors++; },
    (input) => { input.report.sources[0].commit = 'b'.repeat(40); },
    (input) => { input.snapshot.sources[0].files.push(input.snapshot.sources[0].files[0]); },
  ];
  for (const mutate of mutations) {
    const input = fixture();
    mutate(input);
    assert.throws(() => build(input), TypeError);
  }
});

test('document-level findings apply to each record and a missing folder remains source-only', () => {
  const input = fixture([raw(), raw()], { missing: ['samples/missing'] });
  input.report.issues.push({
    repository: 'pnp/test-samples', path: 'samples/demo/assets/sample.json',
    severity: 'warning', code: 'json.object-root', field: '$', message: 'Legacy source finding',
  });
  input.report.sources[0].warnings++;
  const catalog = build(input);
  assert.equal(catalog.samples.length, 2);
  assert.equal(catalog.totals.missingMetadata, 1);
  assert.ok(catalog.samples.every((sample) => hasIssue(sample, 'json.object-root')));
  assert.ok(catalog.samples.every((sample) => !hasIssue(sample, 'metadata.missing')));
});

test('runtime guards reject unsafe or malformed nested JSON rather than asserting a cast', () => {
  const valid = build(fixture());
  const mutations = [
    (value) => { value.schemaVersion = 2; },
    (value) => { value.samples[0].preview.src = 'javascript:alert(1)'; },
    (value) => { value.samples[0].authors[0].avatar = 'data:image/png;base64,abc'; },
    (value) => { value.samples[0].created = '2024-02-30'; },
    (value) => { value.samples[0].references[0].url = 'http://example.com'; },
    (value) => { value.samples[0].quality.issueCount = -1; },
    (value) => { value.samples[0].sourceUrl = 'https://name:password@example.com'; },
    (value) => { value.samples.push(value.samples[0]); },
    (value) => { value.sources[0].samples++; },
    (value) => { value.contributors[0].count = Number.MAX_SAFE_INTEGER; },
  ];
  for (const mutate of mutations) {
    const value = structuredClone(valid);
    mutate(value);
    assert.throws(() => parseCatalog(value), TypeError);
  }
});

test('site-aware paths and English formatting work without exposing local path traversal', () => {
  assert.equal(formatDate, presentationDate);
  assert.equal(formatVersion, presentationVersion);
  assert.equal(sitePath('/catalog.json'), '/spfx/catalog.json');
  assert.equal(sitePath('catalog.json'), '/spfx/catalog.json');
  assert.equal(sitePath(''), '/spfx/');
  assert.equal(samplePath('safe-slug'), '/spfx/samples/safe-slug/');
  for (const value of ['https://evil.example', '//evil.example', '../escape', '%2e%2e/escape', '%2fescape', 'a\\b', 'a/%zz']) assert.throws(() => sitePath(value), TypeError);
  assert.throws(() => samplePath('../bad'), TypeError);
  assert.equal(formatDate(null), 'Date not recorded');
  assert.equal(formatDate('2024-02-03'), 'Feb 3, 2024');
  const summary = toSummary(build(fixture()).samples[0]);
  assert.equal(formatVersion({ ...summary, version: '1.24.0' }), 'SPFx 1.24.0');
  assert.equal(formatVersion({ ...summary, version: null }), 'Version not recorded');
});
