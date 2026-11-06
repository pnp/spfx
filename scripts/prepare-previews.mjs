import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { assertCatalog, FALLBACK_PREVIEW, isHttpsUrl, isRecord } from '../src/lib/types.ts';

export const CACHE_VERSION = 'primary-webp-v1-960x540-inside-q78';
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const HOSTS = new Set([
  'github.com', 'raw.github.com', 'raw.githubusercontent.com', 'avatars.githubusercontent.com',
  'avatars0.githubusercontent.com', 'avatars1.githubusercontent.com',
  'avatars2.githubusercontent.com', 'avatars3.githubusercontent.com', 'user-images.githubusercontent.com',
]);
const HASH = /^[a-f0-9]{64}$/;
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const reason = (error) => error instanceof Error ? error.message : String(error);
const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0;
const missing = (error) => isRecord(error) && error.code === 'ENOENT';

class PreviewError extends Error {
  constructor(message, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

export function previewKey(url) {
  return sha256(`${CACHE_VERSION}\n${url}`);
}

function publicImageUrl(value) {
  if (!isHttpsUrl(value)) throw new PreviewError('Image URL must be HTTPS without credentials, whitespace or control characters');
  const url = new URL(value);
  if (!HOSTS.has(url.hostname) || url.port || url.hash) throw new PreviewError('Image URL is not on an allowed public GitHub image host');
  if (url.hostname === 'github.com' && !/^\/(?:[^/]+\/[^/]+\/(?:raw|blob)\/|user-attachments\/assets\/)/.test(url.pathname)) {
    throw new PreviewError('GitHub URL is not a public image endpoint');
  }
  return url.href;
}

export function createFileStorage(root) {
  const cacheDirectory = resolve(root, '.cache', 'gallery-previews');
  const publicDirectory = resolve(root, 'public', 'images', 'previews');
  const filename = (directory, key, extension) => {
    if (!HASH.test(key)) throw new Error('Invalid preview storage key');
    return resolve(directory, `${key}.${extension}`);
  };
  return {
    async readCache(key) {
      const results = await Promise.allSettled([
        readFile(filename(cacheDirectory, key, 'webp')),
        readFile(filename(cacheDirectory, key, 'json'), 'utf8'),
      ]);
      if (results.every((result) => result.status === 'rejected' && missing(result.reason))) return null;
      if (results.some((result) => result.status === 'rejected')) throw new Error('Preview cache entry is incomplete or unreadable');
      return { bytes: results[0].value, metadata: JSON.parse(results[1].value) };
    },
    async writeCache(key, entry) {
      await mkdir(cacheDirectory, { recursive: true });
      await writeFile(filename(cacheDirectory, key, 'webp'), entry.bytes);
      await writeFile(filename(cacheDirectory, key, 'json'), `${JSON.stringify(entry.metadata)}\n`, 'utf8');
    },
    async writePreview(key, bytes) {
      await mkdir(publicDirectory, { recursive: true });
      await writeFile(filename(publicDirectory, key, 'webp'), bytes);
    },
    async prunePreviews(keys) {
      let files;
      try { files = await readdir(publicDirectory); } catch (error) {
        if (missing(error)) return;
        throw error;
      }
      for (const file of files) {
        const key = file.replace(/\.webp$/, '');
        if (file === `${key}.webp` && HASH.test(key) && !keys.has(key)) await unlink(filename(publicDirectory, key, 'webp'));
      }
    },
    async writeReport(report) {
      await mkdir(resolve(root, 'public'), { recursive: true });
      await writeFile(resolve(root, 'public', 'preview-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    },
  };
}

async function validateCache(entry, url, key, maxBytes) {
  if (!isRecord(entry) || !(entry.bytes instanceof Uint8Array) || !isRecord(entry.metadata)) throw new Error('Invalid cache shape');
  const { bytes, metadata } = entry;
  if (metadata.schemaVersion !== 1 || metadata.version !== CACHE_VERSION || metadata.sourceUrl !== url
    || metadata.key !== key || metadata.bytesAfter !== bytes.byteLength || bytes.byteLength === 0 || bytes.byteLength > maxBytes
    || !positiveInteger(metadata.bytesBefore) || metadata.bytesBefore > maxBytes || metadata.sha256 !== sha256(bytes)
    || !positiveInteger(metadata.sourceWidth) || !positiveInteger(metadata.sourceHeight)
    || !positiveInteger(metadata.width) || !positiveInteger(metadata.height)
    || metadata.width > 960 || metadata.height > 540
    || metadata.width > metadata.sourceWidth || metadata.height > metadata.sourceHeight
    || metadata.sourceWidth * metadata.sourceHeight > MAX_INPUT_PIXELS) {
    throw new Error('Cache provenance, dimensions, size or content digest is invalid');
  }
  publicImageUrl(metadata.finalUrl);
  const image = sharp(bytes, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' });
  const decoded = await image.metadata();
  if (decoded.format !== 'webp' || decoded.width !== metadata.width || decoded.height !== metadata.height || (decoded.pages ?? 1) !== 1) {
    throw new Error('Cache is not the expected single-frame bounded WebP');
  }
  await image.raw().toBuffer();
  return entry;
}

async function readBounded(response, maxBytes, signal) {
  const length = response.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
    await response.body?.cancel();
    throw new PreviewError(`Image exceeds the ${maxBytes}-byte limit or has an invalid Content-Length`);
  }
  const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType && !contentType.startsWith('image/') && contentType !== 'application/octet-stream') {
    await response.body?.cancel();
    throw new PreviewError(`Non-image Content-Type: ${contentType}`);
  }
  if (!response.body) throw new PreviewError('Image response has no body');
  const reader = response.body.getReader();
  const abort = () => { void reader.cancel(signal.reason).catch(() => {}); };
  signal.addEventListener('abort', abort, { once: true });
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) throw new PreviewError(`Image exceeds the ${maxBytes}-byte streaming limit`);
      chunks.push(Buffer.from(value));
    }
    signal.throwIfAborted();
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    signal.removeEventListener('abort', abort);
    reader.releaseLock();
  }
  if (total === 0) throw new PreviewError('Image response is empty');
  if (length !== null && Number(length) !== total && !response.headers.get('content-encoding')) {
    throw new PreviewError('Image response is truncated: Content-Length does not match the body', true);
  }
  return Buffer.concat(chunks, total);
}

async function downloadOnce(url, fetchImpl, { timeoutMs, maxBytes }) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new PreviewError(`Image request timed out after ${timeoutMs}ms`, true);
      controller.abort(error);
      reject(error);
    }, timeoutMs);
  });
  const request = async () => {
    let current = publicImageUrl(url);
    const visited = new Set();
    for (let redirects = 0; redirects <= 4; redirects++) {
      if (visited.has(current)) throw new PreviewError('Image redirect loop');
      visited.add(current);
      const response = await fetchImpl(current, {
        redirect: 'manual', credentials: 'omit', signal: controller.signal,
        headers: { Accept: 'image/*,application/octet-stream;q=0.5' },
      });
      if (response.redirected) throw new PreviewError('Fetch implementation followed an unvalidated redirect');
      if (REDIRECTS.has(response.status)) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (!location) throw new PreviewError('Image redirect has no Location');
        if (redirects === 4) throw new PreviewError('Image exceeded four redirects');
        let target;
        try { target = new URL(location, current).href; } catch { throw new PreviewError('Image redirect has an invalid Location'); }
        current = publicImageUrl(target);
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new PreviewError(`Image HTTP ${response.status}`, [408, 425, 429].includes(response.status) || response.status >= 500);
      }
      return { bytes: await readBounded(response, maxBytes, controller.signal), finalUrl: current };
    }
    throw new PreviewError('Image redirect limit exceeded');
  };
  try {
    return await Promise.race([request(), timeout]);
  } catch (error) {
    if (error instanceof PreviewError) throw error;
    throw new PreviewError(`Image network error: ${reason(error)}`, true);
  } finally {
    clearTimeout(timer);
  }
}

async function optimize(bytes, sourceUrl, finalUrl, key) {
  const input = sharp(bytes, { animated: false, limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' });
  const source = await input.metadata();
  const swap = source.orientation >= 5 && source.orientation <= 8;
  const sourceWidth = swap ? source.height : source.width;
  const sourceHeight = swap ? source.width : source.height;
  if (!positiveInteger(sourceWidth) || !positiveInteger(sourceHeight)) throw new PreviewError('Image dimensions were not decoded');
  const { data, info } = await input.rotate().resize({
    width: 960, height: 540, fit: 'inside', withoutEnlargement: true,
  }).webp({ quality: 78, effort: 4 }).toBuffer({ resolveWithObject: true });
  return {
    bytes: data,
    metadata: {
      schemaVersion: 1, version: CACHE_VERSION, sourceUrl, finalUrl, key,
      sourceWidth, sourceHeight, width: info.width, height: info.height,
      bytesBefore: bytes.byteLength, bytesAfter: data.byteLength, sha256: sha256(data),
    },
  };
}

export async function preparePreviews(catalog, options = {}) {
  assertCatalog(catalog);
  const {
    root = process.cwd(), storage = createFileStorage(root), fetchImpl = globalThis.fetch,
    logger = (message) => console.warn(message), sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    concurrency = 6, timeoutMs = 15_000, maxBytes = MAX_IMAGE_BYTES, retries = 2,
  } = options;
  if (!positiveInteger(concurrency) || concurrency > 6 || !positiveInteger(timeoutMs) || timeoutMs > 60_000
    || !positiveInteger(maxBytes) || maxBytes > MAX_IMAGE_BYTES
    || !Number.isSafeInteger(retries) || retries < 0 || retries > 2 || typeof fetchImpl !== 'function') {
    throw new TypeError('Invalid bounded preview preparation options');
  }
  for (const method of ['readCache', 'writeCache', 'writePreview', 'prunePreviews', 'writeReport']) {
    if (typeof storage[method] !== 'function') throw new TypeError(`Preview storage requires ${method}`);
  }
  const primaryUrls = new Map();
  for (const sample of catalog.samples) {
    if (sample.preview.isFallback || sample.preview.src.startsWith('/images/previews/')) continue;
    const ids = primaryUrls.get(sample.preview.src) ?? [];
    ids.push(sample.id);
    primaryUrls.set(sample.preview.src, ids);
  }
  const urls = [...primaryUrls.keys()].sort();
  const entries = new Array(urls.length);
  let cursor = 0;
  const prepareOne = async (sourceUrl) => {
    const key = previewKey(sourceUrl);
    let cacheState = 'miss';
    let cacheWarning = null;
    let entry = null;
    let attempts = 0;
    try {
      publicImageUrl(sourceUrl);
      const cached = await storage.readCache(key);
      if (cached !== null) {
        entry = await validateCache(cached, sourceUrl, key, maxBytes);
        cacheState = 'hit';
      }
    } catch (error) {
      cacheState = 'invalid';
      cacheWarning = reason(error);
      logger(`Preview cache/URL rejected for ${sourceUrl}: ${cacheWarning}`);
    }
    let failure = null;
    if (entry === null) {
      let downloaded = null;
      for (let attempt = 0; attempt <= retries; attempt++) {
        attempts++;
        try {
          downloaded = await downloadOnce(sourceUrl, fetchImpl, { timeoutMs, maxBytes });
          break;
        } catch (error) {
          failure = reason(error);
          if (!(error instanceof PreviewError) || !error.retryable || attempt === retries) break;
          logger(`Preview retry ${attempt + 1}/${retries} for ${sourceUrl}: ${failure}`);
          await sleep(250 * 2 ** attempt);
        }
      }
      if (downloaded) {
        try {
          entry = await optimize(downloaded.bytes, sourceUrl, downloaded.finalUrl, key);
        } catch (error) {
          failure = `Image decode/optimization failed: ${reason(error)}`;
        }
      }
      if (entry) await storage.writeCache(key, entry);
    }
    if (!entry) {
      const message = failure ?? cacheWarning ?? 'Image preparation failed';
      logger(`Preview FAILED for ${sourceUrl}: ${message}`);
      return {
        sourceUrl, sampleIds: primaryUrls.get(sourceUrl), status: 'failed', localPath: null,
        reason: message, cache: cacheState, cacheWarning, attempts, finalUrl: null,
        bytesBefore: 0, bytesAfter: 0, width: null, height: null,
      };
    }
    await storage.writePreview(key, entry.bytes);
    const { metadata } = entry;
    return {
      sourceUrl, sampleIds: primaryUrls.get(sourceUrl), status: 'optimized',
      localPath: `/images/previews/${key}.webp`, reason: null, cache: cacheState, cacheWarning,
      attempts, finalUrl: metadata.finalUrl, bytesBefore: metadata.bytesBefore,
      bytesAfter: metadata.bytesAfter, width: metadata.width, height: metadata.height,
    };
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (cursor < urls.length) {
      const index = cursor++;
      entries[index] = await prepareOne(urls[index]);
    }
  }));
  const optimized = entries.filter((entry) => entry.status === 'optimized');
  const failed = entries.filter((entry) => entry.status === 'failed');
  const bytesBefore = optimized.reduce((total, entry) => total + entry.bytesBefore, 0);
  const bytesAfter = optimized.reduce((total, entry) => total + entry.bytesAfter, 0);
  const report = {
    schemaVersion: 1, generatedAt: new Date().toISOString(), catalogGeneratedAt: catalog.generatedAt,
    cacheVersion: CACHE_VERSION,
    limits: { concurrency, timeoutMs, maxBytes, retries, maxRedirects: 4, width: 960, height: 540, quality: 78 },
    totals: {
      samples: catalog.samples.length, primaryPreviews: [...primaryUrls.values()].reduce((total, ids) => total + ids.length, 0),
      attempted: entries.length, optimized: optimized.length, failed: failed.length,
      cacheHits: optimized.filter((entry) => entry.cache === 'hit').length,
      bytesBefore, bytesAfter, savedBytes: bytesBefore - bytesAfter,
      reductionPercent: bytesBefore === 0 ? 0 : Number(((1 - bytesAfter / bytesBefore) * 100).toFixed(2)),
    },
    previews: entries,
  };
  await storage.writeReport(report);
  if (entries.length > 0 && optimized.length === 0) {
    throw new Error(`All ${entries.length} attempted primary previews failed; refusing to replace the entire gallery with fallbacks. See public/preview-report.json.`);
  }
  const localUrls = new Map(optimized.map((entry) => [entry.sourceUrl, entry.localPath]));
  const failures = new Set(failed.map((entry) => entry.sourceUrl));
  for (const sample of catalog.samples) {
    const failedPrimary = failures.has(sample.preview.src);
    sample.previews = sample.previews.map((preview, index) => {
      const local = localUrls.get(preview.src);
      if (local) return { ...preview, src: local };
      return failedPrimary && index === 0 ? { ...FALLBACK_PREVIEW } : preview;
    });
    sample.preview = { ...sample.previews[0] };
  }
  assertCatalog(catalog);
  const usedKeys = new Set(catalog.samples.flatMap((sample) => sample.previews
    .filter((preview) => preview.src.startsWith('/images/previews/'))
    .map((preview) => preview.src.slice('/images/previews/'.length, -'.webp'.length))));
  await storage.prunePreviews(usedKeys);
  console.log(`Primary previews: ${optimized.length} optimized (${report.totals.cacheHits} cached), ${failed.length} failed; `
    + `${bytesBefore} -> ${bytesAfter} bytes (${report.totals.reductionPercent}% reduction).`);
  return report;
}
