import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import {
  CACHE_VERSION, MAX_IMAGE_BYTES, preparePreviews, previewKey,
} from '../scripts/prepare-previews.mjs';
import { assertCatalog, assertSearchIndex, FALLBACK_PREVIEW } from '../src/lib/types.ts';
import { toSummary } from '../src/lib/catalog-model.ts';

const original = 'https://raw.githubusercontent.com/pnp/test-samples/main/samples/demo/first.png';
const second = 'https://raw.githubusercontent.com/pnp/test-samples/main/samples/demo/second.png';
const detail = 'https://raw.githubusercontent.com/pnp/test-samples/main/samples/demo/detail.png';
const tiny = await sharp({ create: { width: 20, height: 10, channels: 3, background: '#4488cc' } }).png().toBuffer();
const image = (src) => ({ src, alt: 'Actual screenshot description', isFallback: false });
const response = (bytes = tiny, status = 200, headers = {}) => new Response(bytes, {
  status, headers: { 'Content-Type': 'image/png', ...headers },
});

function catalog(urls = [original]) {
  const samples = urls.map((url, index) => {
    const preview = url === null ? { ...FALLBACK_PREVIEW } : image(url);
    return {
      id: `sample:${index}`, slug: `sample-${index}`, title: 'Actual sample', description: 'Actual description',
      repository: 'pnp/test-samples', family: 'Web parts', experiences: ['SharePoint'],
      componentTypes: ['Web part'], technologies: ['React'], version: '1.24.0', versionGroup: '1.24',
      created: '2024-01-01', updated: null, authors: [], preview, previews: [{ ...preview }],
      sourceUrl: 'https://github.com/pnp/test-samples/tree/main/samples/demo',
      revisionUrl: `https://github.com/pnp/test-samples/commit/${'a'.repeat(40)}`,
      metadataUrl: 'https://github.com/pnp/test-samples/blob/main/samples/demo/assets/sample.json',
      downloadUrl: 'https://pnp.github.io/download-partial/?url=https%3A%2F%2Fgithub.com%2Fpnp%2Ftest-samples%2Ftree%2Fmain%2Fsamples%2Fdemo',
      descriptionParagraphs: ['Actual description'], references: [], products: ['SharePoint'],
      supportedHosts: ['SharePointWebPart'], framework: 'SharePoint Framework', frameworkVersion: '1.24.0',
      issues: [{ code: 'preview.alt-generic', field: 'thumbnails[0].alt', message: 'Original source finding', severity: 'warning' }],
      quality: { needsReview: false, issueCount: 1 },
    };
  });
  return {
    schemaVersion: 1, generatedAt: '2026-11-06T12:00:00Z', refreshedAt: '2026-11-06T12:00:00Z', samples,
    sources: [{ repository: 'pnp/test-samples', commit: 'a'.repeat(40), samples: samples.length, missingMetadata: 0, errors: 0, warnings: samples.length }],
    contributors: [], facets: { experiences: [], types: [], technologies: [], versions: [], sources: [] },
    totals: { samples: samples.length, contributors: 0, metadataFiles: samples.length, candidateFolders: samples.length, eligibleFolders: samples.length, missingMetadata: 0, errors: 0, warnings: samples.length },
  };
}

function harness(fetchImpl = async () => response()) {
  const cached = new Map();
  const copied = new Map();
  const reports = [];
  const logs = [];
  const delays = [];
  const storage = {
    async readCache(key) { return cached.get(key) ?? null; },
    async writeCache(key, value) { cached.set(key, value); },
    async writePreview(key, bytes) { copied.set(key, bytes); },
    async prunePreviews(keys) { for (const key of copied.keys()) if (!keys.has(key)) copied.delete(key); },
    async writeReport(value) { reports.push(value); },
  };
  return {
    cached, copied, reports, logs, delays,
    options: { storage, fetchImpl, logger: (message) => logs.push(message), sleep: async (ms) => { delays.push(ms); } },
  };
}

test('only unique primary images are fetched; optimized primary URLs are shared with matching detail previews', async () => {
  const calls = [];
  const h = harness(async (url, options) => {
    calls.push(url);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'manual');
    assert.ok(!('Authorization' in options.headers));
    assert.ok(!('Cookie' in options.headers));
    return response();
  });
  const input = catalog([original, original, null]);
  input.samples[0].previews.push(image(detail));
  input.samples[2].previews.push(image(original), image(detail));
  const findings = input.samples.map(({ issues, quality }) => structuredClone({ issues, quality }));
  const report = await preparePreviews(input, h.options);
  const path = `/images/previews/${previewKey(original)}.webp`;
  assert.deepEqual(calls, [original]);
  assert.equal(h.cached.size, 1);
  assert.equal(h.copied.size, 1);
  assert.equal(report.totals.attempted, 1);
  assert.equal(report.totals.primaryPreviews, 2);
  assert.equal(report.totals.optimized, 1);
  assert.equal(report.totals.failed, 0);
  assert.equal(report.previews[0].sourceUrl, original);
  assert.deepEqual(report.previews[0].sampleIds, ['sample:0', 'sample:1']);
  assert.equal(input.samples[0].preview.src, path);
  assert.equal(input.samples[1].preview.src, path);
  assert.equal(input.samples[0].previews[1].src, detail);
  assert.equal(input.samples[2].previews[1].src, path);
  assert.equal(input.samples[2].previews[2].src, detail);
  assert.deepEqual(input.samples[2].preview, FALLBACK_PREVIEW);
  assert.deepEqual(input.samples.map(({ issues, quality }) => ({ issues, quality })), findings);
  assert.doesNotThrow(() => assertCatalog(input));
  assert.doesNotThrow(() => assertSearchIndex({ schemaVersion: 1, generatedAt: input.generatedAt, samples: input.samples.map(toSummary) }));
  const decoded = await sharp(h.copied.get(previewKey(original))).metadata();
  assert.equal(decoded.format, 'webp');
  assert.equal(decoded.width, 20);
  assert.equal(decoded.height, 10);
  assert.equal(report.totals.bytesBefore, tiny.byteLength);
  assert.equal(report.totals.bytesAfter, h.copied.get(previewKey(original)).byteLength);
  assert.equal(report.limits.quality, 78);
  assert.equal(report.cacheVersion, CACHE_VERSION);
});

test('images fit inside 960x540 without cropping or upscaling', async () => {
  const bytes = await sharp({ create: { width: 1600, height: 1000, channels: 3, background: '#cc8844' } }).png().toBuffer();
  const h = harness(async () => response(bytes));
  const input = catalog();
  await preparePreviews(input, h.options);
  const metadata = await sharp(h.copied.get(previewKey(original))).metadata();
  assert.equal(metadata.width, 864);
  assert.equal(metadata.height, 540);
  assert.equal(h.cached.get(previewKey(original)).metadata.sourceWidth, 1600);
  assert.equal(h.cached.get(previewKey(original)).metadata.sourceHeight, 1000);
});

test('valid versioned cache is fully decoded, reused without fetching and copied back to public output', async () => {
  const h = harness();
  await preparePreviews(catalog(), h.options);
  h.copied.clear();
  h.options.fetchImpl = async () => { throw new Error('A cache hit must not fetch'); };
  const input = catalog();
  const report = await preparePreviews(input, h.options);
  assert.equal(report.totals.cacheHits, 1);
  assert.equal(report.previews[0].attempts, 0);
  assert.equal(report.previews[0].cache, 'hit');
  assert.equal(h.copied.size, 1);
  assert.match(input.samples[0].preview.src, /^\/images\/previews\/[a-f0-9]{64}\.webp$/);
  assert.notEqual(previewKey(original), createHash('sha256').update(original).digest('hex'));
});

test('corrupt cache bytes, provenance and undecodable WebP are explicitly rejected and refetched', async () => {
  for (const mutate of [
    (entry) => { entry.metadata.sourceUrl = second; },
    (entry) => { entry.metadata.version = 'obsolete'; },
    (entry) => { entry.metadata.width = 961; },
    (entry) => { entry.bytes = Buffer.from('broken'); },
    (entry) => {
      entry.bytes = Buffer.from('not actually WebP');
      entry.metadata.bytesAfter = entry.bytes.byteLength;
      entry.metadata.sha256 = createHash('sha256').update(entry.bytes).digest('hex');
    },
  ]) {
    let calls = 0;
    const h = harness(async () => { calls++; return response(); });
    await preparePreviews(catalog(), h.options);
    mutate(h.cached.get(previewKey(original)));
    const report = await preparePreviews(catalog(), h.options);
    assert.equal(calls, 2);
    assert.equal(report.previews[0].cache, 'invalid');
    assert.ok(report.previews[0].cacheWarning);
    assert.ok(h.logs.some((message) => message.includes('cache/URL rejected')));
    assert.equal(report.totals.failed, 0);
  }
});

test('network concurrency is bounded at six even with more primary images', async () => {
  let active = 0;
  let maximum = 0;
  const h = harness(async () => {
    active++;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 3));
    active--;
    return response();
  });
  const urls = Array.from({ length: 14 }, (_, index) => `${original}?image=${index}`);
  const report = await preparePreviews(catalog(urls), h.options);
  assert.ok(maximum <= 6);
  assert.ok(maximum > 1);
  assert.equal(report.totals.optimized, urls.length);
});

test('partial failures are logged and reported, use labelled fallback, and never change source findings', async () => {
  const h = harness(async (url) => url === original ? response(null, 404) : response());
  const input = catalog([original, second]);
  input.samples[0].previews.push(image(detail));
  const before = input.samples.map(({ issues, quality }) => structuredClone({ issues, quality }));
  const report = await preparePreviews(input, h.options);
  assert.equal(report.totals.failed, 1);
  assert.equal(report.totals.optimized, 1);
  assert.deepEqual(input.samples[0].preview, FALLBACK_PREVIEW);
  assert.deepEqual(input.samples[0].previews[0], FALLBACK_PREVIEW);
  assert.equal(input.samples[0].previews[1].src, detail);
  assert.deepEqual(input.samples.map(({ issues, quality }) => ({ issues, quality })), before);
  assert.equal(report.previews.find((entry) => entry.sourceUrl === original).reason, 'Image HTTP 404');
  assert.ok(h.logs.some((message) => message.includes('FAILED') && message.includes(original) && message.includes('404')));
  assert.equal(h.reports.length, 1);
});

test('a total outage writes its failure report and fails without replacing every screenshot', async () => {
  const h = harness(async () => response(null, 503));
  const input = catalog([original, second]);
  const before = structuredClone(input);
  await assert.rejects(preparePreviews(input, h.options), /All 2 attempted primary previews failed/);
  assert.deepEqual(input, before);
  assert.equal(h.reports.length, 1);
  assert.equal(h.reports[0].totals.failed, 2);
  assert.equal(h.reports[0].totals.optimized, 0);
  assert.equal(h.reports[0].previews[0].attempts, 3);
  assert.equal(h.copied.size, 0);
});

test('only transient statuses retry, within the configured maximum', async () => {
  let calls = 0;
  const h = harness(async () => response(calls++ === 0 ? null : tiny, calls === 1 ? 429 : 200));
  const report = await preparePreviews(catalog(), h.options);
  assert.equal(calls, 2);
  assert.deepEqual(h.delays, [250]);
  assert.equal(report.previews[0].attempts, 2);
  assert.ok(h.logs.some((message) => message.includes('retry 1/2')));
  const permanent = harness(async () => response(null, 403));
  await assert.rejects(preparePreviews(catalog(), permanent.options), /All 1/);
  assert.equal(permanent.reports[0].previews[0].attempts, 1);
  assert.deepEqual(permanent.delays, []);
});

test('request and streaming timeouts abort and produce an explicit bounded failure', async () => {
  for (const fetchImpl of [
    async (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true })),
    async () => new Response(new ReadableStream({ start() {}, cancel() {} }), { headers: { 'Content-Type': 'image/png' } }),
  ]) {
    const h = harness(fetchImpl);
    await assert.rejects(preparePreviews(catalog(), { ...h.options, timeoutMs: 5, retries: 0 }), /All 1/);
    assert.match(h.reports[0].previews[0].reason, /timed out/);
    assert.equal(h.reports[0].previews[0].attempts, 1);
  }
});

test('safe public GitHub redirects are followed manually and preserve original and final provenance', async () => {
  const from = 'https://github.com/pnp/test-samples/raw/main/samples/demo/first.png';
  const calls = [];
  const h = harness(async (url) => {
    calls.push(url);
    return url === from ? response(null, 302, { Location: original }) : response();
  });
  const report = await preparePreviews(catalog([from]), h.options);
  assert.deepEqual(calls, [from, original]);
  assert.equal(report.previews[0].sourceUrl, from);
  assert.equal(report.previews[0].finalUrl, original);
});

test('redirects to non-GitHub hosts, insecure URLs, credentials or ports are blocked before fetching', async () => {
  for (const location of [
    'https://example.com/image.png', 'http://raw.githubusercontent.com/image.png',
    'https://user:password@raw.githubusercontent.com/image.png',
    'https://raw.githubusercontent.com:8443/image.png', 'https://raw.githubusercontent.com.evil.example/image.png',
    'https://127.0.0.1/image.png', 'https://raw.githubusercontent.com@127.0.0.1/image.png',
  ]) {
    let calls = 0;
    const h = harness(async () => { calls++; return response(null, 302, { Location: location }); });
    await assert.rejects(preparePreviews(catalog(), h.options), /All 1/);
    assert.equal(calls, 1);
    assert.equal(h.reports[0].previews[0].attempts, 1);
    assert.ok(h.reports[0].previews[0].reason);
  }
});

test('non-public image endpoints, automatic redirects and redirect loops are rejected', async () => {
  const external = harness(async () => { throw new Error('Must not fetch disallowed hosts'); });
  await assert.rejects(preparePreviews(catalog(['https://example.com/image.png']), external.options), /All 1/);
  assert.equal(external.reports[0].previews[0].attempts, 1);
  const auto = harness(async () => {
    const result = response();
    Object.defineProperty(result, 'redirected', { value: true });
    return result;
  });
  await assert.rejects(preparePreviews(catalog(), auto.options), /All 1/);
  assert.match(auto.reports[0].previews[0].reason, /unvalidated redirect/);
  let calls = 0;
  const loop = harness(async () => { calls++; return response(null, 302, { Location: original }); });
  await assert.rejects(preparePreviews(catalog(), loop.options), /All 1/);
  assert.equal(calls, 1);
  assert.match(loop.reports[0].previews[0].reason, /loop/);
});

test('oversized declared or streamed bodies, empty responses, HTML and invalid bytes fail explicitly', async () => {
  for (const fetchImpl of [
    async () => response(tiny, 200, { 'Content-Length': String(MAX_IMAGE_BYTES + 1) }),
    async () => response(Buffer.alloc(100)),
    async () => response(Buffer.alloc(0)),
    async () => response(Buffer.from('<html>not an image</html>'), 200, { 'Content-Type': 'text/html' }),
    async () => response(Buffer.from('not an image')),
  ]) {
    const h = harness(fetchImpl);
    await assert.rejects(preparePreviews(catalog(), { ...h.options, maxBytes: 64 }), /All 1/);
    assert.equal(h.reports[0].totals.failed, 1);
    assert.equal(h.reports[0].previews[0].attempts, 1);
    assert.ok(h.logs.some((message) => message.includes('FAILED')));
  }
});

test('cache and public output write failures fail generation instead of emitting broken local paths', async () => {
  for (const method of ['writeCache', 'writePreview']) {
    const h = harness();
    h.options.storage[method] = async () => { throw new Error('Disk unavailable'); };
    const input = catalog();
    await assert.rejects(preparePreviews(input, h.options), /Disk unavailable/);
    assert.equal(input.samples[0].preview.src, original);
  }
});

test('existing fallbacks require no requests and stale output keys are pruned without removing active keys', async () => {
  const h = harness(async () => { throw new Error('No fallback fetch expected'); });
  h.copied.set('b'.repeat(64), Buffer.from('stale'));
  const input = catalog([null]);
  const report = await preparePreviews(input, h.options);
  assert.equal(report.totals.attempted, 0);
  assert.equal(report.totals.failed, 0);
  assert.equal(h.copied.size, 0);
  assert.deepEqual(input.samples[0].preview, FALLBACK_PREVIEW);
});

test('unsafe local preview paths are rejected; only exact hashed WebP paths and the labelled fallback are accepted', () => {
  for (const src of [
    '/images/previews/../secret.webp', `/images/previews/${'a'.repeat(64)}.webp?x=1`,
    `/images/previews/${'a'.repeat(64)}.png`, '/images/arbitrary.webp',
    `/images/previews/${'a'.repeat(64)}.webp/extra`, '//evil.example/image.webp',
  ]) {
    const input = catalog([src]);
    assert.throws(() => assertCatalog(input), TypeError);
  }
  assert.doesNotThrow(() => assertCatalog(catalog([`/images/previews/${'a'.repeat(64)}.webp`])));
  assert.doesNotThrow(() => assertCatalog(catalog([null])));
});

test('invalid resource bounds are rejected before fetching or writing', async () => {
  for (const bounds of [{ concurrency: 7 }, { concurrency: 0 }, { retries: 3 }, { timeoutMs: 0 }, { maxBytes: MAX_IMAGE_BYTES + 1 }]) {
    const h = harness();
    await assert.rejects(preparePreviews(catalog(), { ...h.options, ...bounds }), /Invalid bounded/);
    assert.equal(h.reports.length, 0);
    assert.equal(h.copied.size, 0);
  }
});
