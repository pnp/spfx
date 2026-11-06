import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fetchBytes, mapLimit, readBlob, selectSourceFiles } from './collect-samples.mjs';
import { validateSnapshot } from './audit-samples.mjs';
import { auditSnapshot, compareBaseline, fingerprint, parseDate, parseGithubFile, reportMarkdown } from './sample-metadata.mjs';

const now = new Date('2026-11-06T12:00:00Z');
const repository = 'pnp/sp-dev-fx-webparts';
const metadataPath = 'samples/example/assets/sample.json';

function record() {
  return {
    name: 'example',
    source: 'pnp',
    title: 'Example',
    shortDescription: 'A useful sample.',
    longDescription: ['A longer explanation.'],
    url: `https://github.com/${repository}/tree/main/samples/example`,
    downloadUrl: 'https://pnp.github.io/download-partial/?url=example',
    creationDateTime: '2020-01-01',
    updateDateTime: '2024-01-01',
    products: ['SharePoint'],
    metadata: [{ key: 'SPFX-VERSION', value: '1.20.0' }, { key: 'CLIENT-SIDE-DEV', value: 'React' }],
    thumbnails: [{ type: 'image', order: 0, url: `https://raw.githubusercontent.com/${repository}/main/samples/example/assets/preview.png`, alt: 'The example web part displays a list of tasks.' }],
    authors: [{ name: 'Example contributor', gitHubAccount: 'example', pictureUrl: 'https://github.com/example.png' }],
    references: [{ name: 'SPFx documentation', description: 'Development guidance.', url: 'https://learn.microsoft.com/sharepoint/dev/spfx/' }],
  };
}

function snapshot(value = [record()]) {
  return {
    formatVersion: 1,
    collectionId: 'test-collection',
    collectedAt: now.toISOString(),
    sources: [{
      repository, commit: 'a'.repeat(40), family: 'Web parts', roots: ['samples'],
      folders: ['samples/example'],
      files: [{ path: 'samples/example/assets/preview.png', size: 100 }],
      documents: [{ path: metadataPath, text: JSON.stringify(value) }],
      packages: [{ path: 'samples/example/package.json', text: JSON.stringify({ dependencies: { '@microsoft/sp-core-library': '1.20.0' } }) }],
      manifests: [{ path: 'samples/example/src/webparts/example/ExampleWebPart.manifest.json', text: '{ /* SPFx uses JSONC */ "componentType": "WebPart", "supportedHosts": ["SharePointWebPart", "TeamsTab"], }' }],
    }],
  };
}

function inspect(value) {
  return auditSnapshot(value, { now });
}

test('valid legacy versions remain visible and JSONC manifests produce filter facets', () => {
  const { samples, report } = inspect(snapshot());
  assert.equal(report.issues.length, 0);
  assert.equal(samples.length, 1);
  assert.deepEqual(samples[0].gallery.componentTypes, ['Teams tab', 'Web part']);
  assert.equal(samples[0].gallery.spfxVersionGroup, '1.20');
  assert.equal(report.linkCoverage.repositoryAssetsVerified, 1);
  assert.equal(report.linkCoverage.externalUrlsNotProbed.length, 1);
});

test('invalid JSON is reported, not silently dropped as a successful metadata file', () => {
  const data = snapshot();
  data.sources[0].documents[0].text = '[invalid';
  const { samples, report } = inspect(data);
  assert.equal(samples.length, 0);
  assert.equal(report.issues[0].code, 'json.invalid');
});

test('legacy object roots and BOMs are accepted with explicit warnings', () => {
  const data = snapshot(record());
  data.sources[0].documents[0].text = `\uFEFF${data.sources[0].documents[0].text}`;
  const { samples, report } = inspect(data);
  assert.equal(samples.length, 1);
  assert.deepEqual(report.issues.map((issue) => issue.code).sort(), ['json.bom', 'json.object-root']);
});

test('nested arrays and primitive records are explicit errors', () => {
  for (const value of [[[record()]], [null], ['text'], []]) {
    assert.ok(inspect(snapshot(value)).report.issues.some((issue) => issue.severity === 'error'));
  }
});

test('folders without metadata are included in coverage and baseline gating', () => {
  const data = snapshot();
  data.sources[0].folders.push('samples/missing');
  const report = inspect(data).report;
  assert.equal(report.sources[0].missingMetadata, 1);
  assert.ok(report.issues.some((issue) => issue.code === 'metadata.missing'));
});

test('all source roots including ACE scenarios are discovered; aggregate feeds are not collected', () => {
  const source = { repository: 'pnp/sp-dev-fx-aces', roots: ['samples', 'scenarios'] };
  const tree = { truncated: false, tree: [
    { type: 'blob', path: 'samples/one/assets/sample.json' },
    { type: 'blob', path: 'scenarios/two/assets/sample.json' },
    { type: 'blob', path: 'scenarios/two/package.json' },
    { type: 'blob', path: 'samples/one/src/One.manifest.json' },
    { type: 'blob', path: 'samples/one/lib/One.manifest.json' },
    { type: 'blob', path: 'samples/one/release/One.manifest.json' },
    { type: 'blob', path: '.metadata/samples.json' },
  ] };
  const result = selectSourceFiles(tree, source);
  assert.equal(result.sampleFiles.length, 2);
  assert.deepEqual(result.folders, ['samples/one', 'scenarios/two']);
  assert.equal(result.manifests.length, 1);
  assert.equal(result.packageFiles.length, 1);
});

test('truncated trees and unexpectedly empty sources cannot pass collection', () => {
  const source = { repository, roots: ['samples'] };
  assert.throws(() => selectSourceFiles({ truncated: true }, source), /truncated/);
  assert.throws(() => selectSourceFiles({ tree: [] }, source), /no sample/);
});

test('reviewed support exclusions remain inventoried and cannot hide metadata or outlive their folder', () => {
  const source = {
    repository, roots: ['samples'],
    reviewedExclusions: [{ path: 'samples/support', reason: 'Reviewed build artifacts only.' }],
  };
  const tree = { tree: [
    { type: 'blob', path: 'samples/example/assets/sample.json' },
    { type: 'blob', path: 'samples/support/lib/generated.js' },
  ] };
  assert.deepEqual(selectSourceFiles(tree, source).folders, ['samples/example', 'samples/support']);
  tree.tree.push({ type: 'blob', path: 'samples/support/assets/sample.json' });
  assert.throws(() => selectSourceFiles(tree, source), /hide sample metadata/);
  assert.throws(() => selectSourceFiles({ tree: tree.tree.slice(0, 1) }, source), /stale/);
  const data = snapshot();
  data.sources[0].folders.push('samples/support');
  data.sources[0].reviewedExclusions = source.reviewedExclusions;
  const report = inspect(data).report;
  assert.equal(report.sources[0].folders, 2);
  assert.equal(report.sources[0].missingMetadata, 0);
  assert.equal(report.sources[0].excludedFolders[0].path, 'samples/support');
  assert.ok(reportMarkdown(report).includes('Reviewed build artifacts only.'));
});

test('reviewed non-SPFx samples retain accurate framework versions without invented SPFx declarations', () => {
  const value = record();
  value.metadata = [{ key: 'BOT-FRAMEWORK-VERSION', value: 'bot40' }, { key: 'CLIENT-SIDE-DEV', value: '.NET' }];
  const data = snapshot([value]);
  data.sources[0].packages = [];
  data.sources[0].frameworkOverrides = [{
    path: 'samples/example', framework: 'Bot Framework', versionKey: 'BOT-FRAMEWORK-VERSION', reason: 'Reviewed .NET bot project.',
  }];
  const result = inspect(data);
  assert.equal(result.report.issues.filter((issue) => issue.severity === 'error').length, 0);
  assert.equal(result.samples[0].gallery.spfxVersion, null);
  assert.equal(result.samples[0].gallery.framework, 'Bot Framework');
  assert.equal(result.samples[0].gallery.frameworkVersion, 'bot40');
  assert.equal(result.report.facets.framework['Bot Framework'], 1);
  value.metadata.shift();
  data.sources[0].documents[0].text = JSON.stringify([value]);
  assert.ok(inspect(data).report.issues.some((issue) => issue.code === 'framework.override-invalid'));
  data.sources[0].frameworkOverrides[0].path = 'samples/removed';
  const tree = { tree: [{ type: 'blob', path: metadataPath }] };
  assert.throws(() => selectSourceFiles(tree, data.sources[0]), /no sample metadata/);
});

test('component subtype comes from manifests, not misleading extension categories', () => {
  for (const [extensionType, expected] of [
    ['ApplicationCustomizer', 'Application customizer'],
    ['ListViewCommandSet', 'ListView command set'],
    ['FieldCustomizer', 'Field customizer'],
    ['FormCustomizer', 'Form customizer'],
  ]) {
    const data = snapshot();
    data.sources[0].family = 'Extensions';
    data.sources[0].manifests[0].text = JSON.stringify({ componentType: 'Extension', extensionType });
    assert.deepEqual(inspect(data).samples[0].gallery.componentTypes, [expected]);
  }
});

test('ACE and Copilot/reference source families are represented', () => {
  const data = snapshot();
  data.sources[0].family = 'Reference scenarios';
  data.sources[0].manifests[0].text = '{"componentType":"AdaptiveCardExtension"}';
  assert.deepEqual(inspect(data).samples[0].gallery.componentTypes, ['Adaptive Card Extension', 'Reference scenario']);
  data.sources[0].family = 'Copilot components';
  data.sources[0].manifests[0].text = '{"componentType":"CopilotComponent"}';
  assert.deepEqual(inspect(data).samples[0].gallery.componentTypes, ['Copilot component']);
  data.sources[0].family = 'Web parts';
  data.sources[0].manifests[0].text = '{"componentType":"Library"}';
  assert.deepEqual(inspect(data).samples[0].gallery.componentTypes, ['Library component']);
});

test('videos are valid supplementary media while an image preview remains required', () => {
  const value = record();
  value.thumbnails.push({ type: 'video', order: 1, url: 'https://www.youtube.com/watch?v=example', alt: 'Sample walkthrough video' });
  assert.equal(inspect(snapshot([value])).report.issues.length, 0);
  value.thumbnails.shift();
  assert.ok(inspect(snapshot([value])).report.issues.some((issue) => issue.code === 'preview.no-image'));
});
test('unclassified extensions are visible and flagged, never guessed from folder names', () => {
  const data = snapshot();
  data.sources[0].family = 'Extensions';
  data.sources[0].manifests = [];
  const result = inspect(data);
  assert.deepEqual(result.samples[0].gallery.componentTypes, ['Extension (unclassified)']);
  assert.ok(result.report.issues.some((issue) => issue.code === 'component.unclassified'));
});

test('version mismatches, malformed versions and conflicting metadata keys are errors', () => {
  const value = record();
  value.metadata[0].value = '1.21.0';
  assert.ok(inspect(snapshot([value])).report.issues.some((issue) => issue.code === 'version.package-mismatch'));
  value.metadata[0].value = 'not-a-version';
  assert.ok(inspect(snapshot([value])).report.issues.some((issue) => issue.code === 'version.invalid'));
  value.metadata.push({ key: 'spfx-version', value: '1.20.0' });
  assert.ok(inspect(snapshot([value])).report.issues.some((issue) => issue.code === 'metadata.duplicate-key' && issue.severity === 'error'));
});

test('legacy major.minor versions are warnings, not errors; version groups compare numerically', () => {
  const value = record();
  value.metadata[0].value = '1.20';
  const result = inspect(snapshot([value]));
  assert.equal(result.samples[0].gallery.spfxVersionGroup, '1.20');
  assert.ok(result.report.issues.some((issue) => issue.code === 'version.patch-unspecified' && issue.severity === 'warning'));
  assert.equal(result.report.issues.filter((issue) => issue.severity === 'error').length, 0);
  value.metadata[0].value = '1.10.0';
  assert.equal(inspect(snapshot([value])).samples[0].gallery.spfxVersionGroup, '1.10');
  value.metadata[0].value = '1.0.0';
  assert.equal(inspect(snapshot([value])).samples[0].gallery.spfxVersionGroup, '< 1.1');
});

test('multi-valued technology keys are combined without inventing a version conflict', () => {
  const value = record();
  value.metadata.push({ key: 'CLIENT-SIDE-DEV', value: 'TypeScript' });
  const result = inspect(snapshot([value]));
  assert.deepEqual(result.samples[0].gallery.technology, ['React', 'TypeScript']);
  assert.equal(result.report.issues.filter((issue) => issue.severity === 'error').length, 0);
});

test('package ranges are explicitly unverified rather than treated as installed versions', () => {
  const data = snapshot();
  data.sources[0].packages[0].text = '{"dependencies":{"@microsoft/sp-core-library":"^1.20.0"}}';
  assert.ok(inspect(data).report.issues.some((issue) => issue.code === 'version.range'));
});

test('technology aliases normalize without erasing unrecognized technology', () => {
  const value = record();
  value.metadata[1].value = 'Javascript; react.js; Svelte; TypeScript';
  assert.deepEqual(inspect(snapshot([value])).samples[0].gallery.technology, ['JavaScript', 'React', 'Svelte', 'TypeScript']);
});

test('asset audit verifies missing, empty and incorrectly cased paths', () => {
  const data = snapshot();
  data.sources[0].files[0].path = 'samples/example/assets/Preview.png';
  assert.ok(inspect(data).report.issues.some((issue) => issue.code === 'asset.case-mismatch'));
  data.sources[0].files = [];
  assert.ok(inspect(data).report.issues.some((issue) => issue.code === 'asset.missing'));
  data.sources[0].files = [{ path: 'samples/example/assets/preview.png', size: 0 }];
  assert.ok(inspect(data).report.issues.some((issue) => issue.code === 'asset.empty'));
});

test('GitHub blob/raw URL variants resolve encoded paths and refs/heads', () => {
  for (const url of [
    `https://github.com/${repository}/blob/main/samples/example/assets/my%20preview.png?raw=true`,
    `https://github.com/${repository}/raw/refs/heads/main/samples/example/assets/my%20preview.png`,
    `https://raw.githubusercontent.com/${repository}/refs/heads/main/samples/example/assets/my%20preview.png`,
    `https://raw.github.com/${repository}/main/samples/example/assets/my%20preview.png`,
  ]) {
    assert.deepEqual(parseGithubFile(url), { repository, ref: 'main', path: 'samples/example/assets/my preview.png' });
  }
});

test('malformed URL path encodings are reported without crashing the audit', () => {
  const value = record();
  value.thumbnails[0].url = `https://raw.githubusercontent.com/${repository}/main/%ZZ.png`;
  assert.ok(inspect(snapshot([value])).report.issues.some((issue) => issue.code === 'url.encoding'));
});

test('unsafe links, reversed/impossible dates and missing preview alt text are errors', () => {
  const value = record();
  value.url = 'javascript:alert(1)';
  value.creationDateTime = '2025-01-01';
  value.updateDateTime = '2024-01-01';
  value.thumbnails[0].alt = '';
  const codes = inspect(snapshot([value])).report.issues.map((issue) => issue.code);
  for (const code of ['url.unsafe', 'date.order', 'preview.alt-missing']) assert.ok(codes.includes(code));
  assert.equal(parseDate('2025-02-29'), null);
  assert.equal(parseDate('2024-13-01'), null);
  assert.ok(parseDate('2024-02-29'));
  assert.ok(parseDate('2024-01-01T12:00:00Z'));
});

test('wrong source links are errors and original source fields remain unchanged', () => {
  const value = record();
  value.url = 'https://github.com/pnp/another-repo/tree/main/samples/example';
  const { samples, report } = inspect(snapshot([value]));
  assert.equal(samples[0].url, value.url);
  assert.ok(report.issues.some((issue) => issue.code === 'url.source-mismatch'));
  assert.equal(samples[0].gallery.sourceUrl, `https://github.com/${repository}/tree/${'a'.repeat(40)}/samples/example`);
});

test('duplicate metadata names never silently discard samples or collide gallery IDs', () => {
  const { samples, report } = inspect(snapshot([record(), record()]));
  assert.equal(samples.length, 2);
  assert.notEqual(samples[0].gallery.id, samples[1].gallery.id);
  assert.ok(report.issues.some((issue) => issue.code === 'name.duplicate'));
});

test('broken package and manifest content does not conceal source quality errors', () => {
  const data = snapshot();
  data.sources[0].packages[0].text = 'not json';
  data.sources[0].manifests[0].text = 'not jsonc';
  const codes = inspect(data).report.issues.map((issue) => issue.code);
  assert.ok(codes.includes('package.invalid-json'));
  assert.ok(codes.includes('manifest.invalid-jsonc'));
});

test('baseline accepts existing errors and blocks new errors, not warnings', () => {
  const value = record();
  value.title = '';
  const issues = inspect(snapshot([value])).report.issues;
  const baseline = { issues: issues.map((issue) => ({ fingerprint: issue.fingerprint })) };
  assert.equal(compareBaseline(issues, baseline).length, 0);
  value.thumbnails[0].alt = '';
  const changedIssues = inspect(snapshot([value])).report.issues;
  assert.equal(compareBaseline(changedIssues, baseline).length, 1);
  const original = issues[0];
  assert.equal(fingerprint(original), fingerprint({ ...original, message: 'A revised diagnostic message.' }));
});

test('report escapes markdown table content and includes source revisions and boundaries', () => {
  const value = record();
  value.metadata[0].value = '1.20.0|bad';
  const markdown = reportMarkdown(inspect(snapshot([value])).report);
  assert.ok(markdown.includes('No external HTTP reachability'));
  assert.ok(markdown.includes('a'.repeat(40)));
  assert.ok(markdown.includes('version.invalid'));
});

test('bounded concurrency preserves input order', async () => {
  let running = 0;
  let maximum = 0;
  const result = await mapLimit([3, 1, 2, 0], 2, async (value) => {
    running++;
    maximum = Math.max(maximum, running);
    await new Promise((resolve) => setTimeout(resolve, value));
    running--;
    return value * 2;
  });
  assert.equal(maximum, 2);
  assert.deepEqual(result, [6, 2, 4, 0]);
  await assert.rejects(mapLimit([1], 0, () => 1), /positive integer/);
  await assert.rejects(mapLimit([1], 1, () => { throw new Error('incomplete'); }), /incomplete/);
});

test('GitHub API token is never forwarded to raw content hosts', async () => {
  for (const [url, expected] of [
    ['https://api.github.com/repos/pnp/spfx', 'Bearer test-token'],
    ['https://raw.githubusercontent.com/pnp/spfx/main/file', undefined],
  ]) {
    const bytes = await fetchBytes(url, {
      token: 'test-token',
      fetchImpl: async (target, options) => {
        assert.equal(target, url);
        assert.equal(options.headers.Authorization, expected);
        assert.equal(options.redirect, 'error');
        return new Response('content');
      },
    });
    assert.equal(bytes.toString(), 'content');
  }
});

test('HTTP failures fail collection explicitly', async () => {
  await assert.rejects(fetchBytes('https://api.github.com/missing', {
    fetchImpl: async () => new Response('not found', { status: 404 }),
  }), /HTTP 404.*incomplete/);
});

test('stale, incomplete, missing-source and changed-registry snapshots cannot pass the audit', () => {
  const data = snapshot();
  const status = { complete: true, collectionId: data.collectionId, sourceCount: 1 };
  const registry = { formatVersion: 1, sources: [{ repository, roots: ['samples'], family: 'Web parts' }] };
  assert.doesNotThrow(() => validateSnapshot(data, status, registry));
  assert.throws(() => validateSnapshot(data, { ...status, complete: false }, registry), /incomplete/);
  assert.throws(() => validateSnapshot(data, { ...status, collectionId: 'stale' }, registry), /incomplete/);
  assert.throws(() => validateSnapshot({ ...data, sources: [] }, status, registry), /incomplete/);
  assert.throws(() => validateSnapshot(data, status, {
    ...registry, sources: [{ ...registry.sources[0], roots: ['scenarios'] }],
  }), /incomplete/);
  assert.throws(() => validateSnapshot(data, status, {
    ...registry, sources: [{ ...registry.sources[0], reviewedExclusions: [{ path: 'samples/support', reason: 'Reviewed.' }] }],
  }), /incomplete/);
  assert.throws(() => validateSnapshot(data, status, {
    ...registry, sources: [{ ...registry.sources[0], frameworkOverrides: [{ path: 'samples/example', framework: 'Bot Framework' }] }],
  }), /incomplete/);
});

test('concurrent identical blobs are published atomically and cached reads never truncate content', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'spfx-gallery-cache-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const bytes = Buffer.from('A repeated component manifest.\n');
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  const entry = { sha, path: 'samples/example/src/Example.manifest.json' };
  const options = { directory, request: async () => bytes };
  const results = await mapLimit(Array.from({ length: 40 }), 8, () => readBlob(entry, repository, 'a'.repeat(40), options));
  assert.ok(results.every((result) => result.equals(bytes)));
  assert.deepEqual(await readFile(path.join(directory, sha)), bytes);
  await readBlob(entry, repository, 'a'.repeat(40), {
    directory,
    request: () => { throw new Error('A valid cached blob should not be downloaded again.'); },
  });
  await writeFile(path.join(directory, sha), 'corrupted');
  await assert.rejects(readBlob(entry, repository, 'a'.repeat(40), options), /checksum mismatch/);
});
