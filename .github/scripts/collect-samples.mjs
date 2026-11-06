import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
export const metadataDir = path.join(repoRoot, '.metadata');
const cacheDir = path.join(repoRoot, '.cache', 'sample-gallery');
const pendingBlobs = new Map();

export async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export async function mapLimit(items, limit, callback) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('Concurrency must be a positive integer.');
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await callback(items[index], index);
    }
  }));
  return results;
}

export async function fetchBytes(url, { fetchImpl = fetch, token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN } = {}) {
  const headers = { 'User-Agent': 'pnp-spfx-sample-gallery' };
  if (new URL(url).hostname === 'api.github.com') {
    headers.Accept = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(30_000), redirect: 'error' });
    } catch (error) {
      if (attempt === 2) throw new Error(`Request failed for ${url}: ${error.message}`, { cause: error });
      await delay(1000 * (attempt + 1));
      continue;
    }
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    const retryable = [408, 429, 500, 502, 503, 504].includes(response.status);
    if (!retryable || attempt === 2) {
      throw new Error(`HTTP ${response.status} for ${url}; collection is incomplete.`);
    }
    await response.body?.cancel();
    const retryAfter = Number(response.headers.get('retry-after'));
    await delay(Math.min(30, Math.max(attempt + 1, Number.isFinite(retryAfter) ? retryAfter : 0)) * 1000);
  }
  throw new Error(`Request attempts exhausted for ${url}.`);
}

export function selectSourceFiles(tree, source) {
  if (tree.truncated) throw new Error(`${source.repository}: GitHub returned a truncated tree; refusing partial coverage.`);
  if (!Array.isArray(tree.tree)) throw new Error(`${source.repository}: missing GitHub tree entries.`);
  const underRoot = (entry) => source.roots.some((root) => entry.path.startsWith(`${root}/`));
  const files = tree.tree.filter((entry) => entry.type === 'blob');
  const isSourceFile = (entry) => !entry.path.split('/').some((part) =>
    ['node_modules', '.git', 'lib', 'lib-commonjs', 'release', 'dist', 'temp'].includes(part));
  const sampleFiles = files.filter((entry) => underRoot(entry) && /\/sample\.json$/i.test(entry.path));
  const folders = [...new Set(files.filter(underRoot).filter((entry) => entry.path.split('/').length > 2)
    .map((entry) => entry.path.split('/').slice(0, 2).join('/')))].sort();
  if (!sampleFiles.length || !folders.length) throw new Error(`${source.repository}: no sample metadata or sample folders found.`);
  const packageFiles = files.filter((entry) => underRoot(entry) && /\/package\.json$/i.test(entry.path) && isSourceFile(entry));
  const manifests = files.filter((entry) => underRoot(entry) && /\.manifest\.json$/i.test(entry.path) && isSourceFile(entry));
  for (const exclusion of source.reviewedExclusions ?? []) {
    if (!folders.includes(exclusion.path) || sampleFiles.some((entry) => entry.path.startsWith(`${exclusion.path}/`))) {
      throw new Error(`${source.repository}: reviewed exclusion ${exclusion.path} is stale or would hide sample metadata.`);
    }
  }
  for (const override of source.frameworkOverrides ?? []) {
    if (!sampleFiles.some((entry) => entry.path.startsWith(`${override.path}/`))) {
      throw new Error(`${source.repository}: framework override ${override.path} has no sample metadata.`);
    }
  }
  return { files, sampleFiles, folders, packageFiles, manifests };
}

export function readBlob(entry, repository, commit, options = {}) {
  const key = path.join(options.directory ?? cacheDir, entry.sha);
  if (!pendingBlobs.has(key)) {
    pendingBlobs.set(key, readBlobFromCache(entry, repository, commit, options).finally(() => pendingBlobs.delete(key)));
  }
  return pendingBlobs.get(key);
}

async function readBlobFromCache(entry, repository, commit, { directory = cacheDir, request = fetchBytes } = {}) {
  if (!/^[a-f0-9]{40}$/.test(entry.sha)) throw new Error(`Invalid blob hash for ${repository}/${entry.path}.`);
  const cacheFile = path.join(directory, entry.sha);
  let bytes;
  let cached = true;
  try {
    bytes = await readFile(cacheFile);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    cached = false;
    const encodedPath = entry.path.split('/').map(encodeURIComponent).join('/');
    bytes = await request(`https://raw.githubusercontent.com/${repository}/${commit}/${encodedPath}`);
  }
  const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  if (hash !== entry.sha) throw new Error(`Blob checksum mismatch for ${repository}/${entry.path}; remove ${cacheFile} and retry.`);
  if (!cached) {
    await mkdir(directory, { recursive: true });
    const temporaryFile = `${cacheFile}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporaryFile, bytes);
      await rename(temporaryFile, cacheFile);
    } finally {
      await rm(temporaryFile, { force: true });
    }
  }
  return bytes;
}

async function collectSource(source) {
  const commitData = JSON.parse((await fetchBytes(`https://api.github.com/repos/${source.repository}/commits/HEAD`)).toString('utf8'));
  const commit = commitData.sha;
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error(`${source.repository}: invalid commit response.`);
  const tree = JSON.parse((await fetchBytes(`https://api.github.com/repos/${source.repository}/git/trees/${commit}?recursive=1`)).toString('utf8'));
  const { files, sampleFiles, folders, packageFiles, manifests } = selectSourceFiles(tree, source);
  const wanted = [...sampleFiles, ...packageFiles, ...manifests].sort((a, b) => a.path.localeCompare(b.path));
  const documents = await mapLimit(wanted, 8, async (entry) => {
    const bytes = await readBlob(entry, source.repository, commit);
    return { path: entry.path, text: bytes.toString('utf8') };
  });
  console.log(`${source.repository}@${commit.slice(0, 12)}: ${folders.length} folders, ${sampleFiles.length} metadata files, ${packageFiles.length} packages, ${manifests.length} manifests`);
  const paths = (entries) => new Set(entries.map((entry) => entry.path));
  const metadataPaths = paths(sampleFiles);
  const packagePaths = paths(packageFiles);
  const manifestPaths = paths(manifests);
  return {
    ...source,
    commit,
    folders,
    files: files.map(({ path: filePath, size }) => ({ path: filePath, size })),
    documents: documents.filter((document) => metadataPaths.has(document.path)),
    packages: documents.filter((document) => packagePaths.has(document.path)),
    manifests: documents.filter((document) => manifestPaths.has(document.path)),
  };
}

export async function collect() {
  const collectionId = randomUUID();
  const collectedAt = new Date().toISOString();
  const statusFile = path.join(metadataDir, 'collection-status.json');
  await writeJson(statusFile, { collectionId, collectedAt, complete: false });
  try {
    const registry = await readJson(path.join(metadataDir, 'sources.json'));
    if (registry.formatVersion !== 1 || !Array.isArray(registry.sources) || !registry.sources.length) {
      throw new Error('Invalid source registry.');
    }
    const seen = new Set();
    for (const source of registry.sources) {
      if (!/^pnp\/[a-z0-9-]+$/.test(source.repository) || seen.has(source.repository)
        || !Array.isArray(source.roots) || !source.roots.length
        || source.roots.some((root) => !/^[a-z0-9-]+$/.test(root)) || typeof source.family !== 'string') {
        throw new Error(`Invalid or duplicate source registry entry: ${JSON.stringify(source)}`);
      }
      for (const field of ['reviewedExclusions', 'frameworkOverrides']) {
        const entries = source[field] ?? [];
        if (!Array.isArray(entries) || new Set(entries.map((entry) => entry.path)).size !== entries.length
          || entries.some((entry) => !entry || !source.roots.some((root) => entry.path?.startsWith(`${root}/`))
            || !/^[^/]+\/[A-Za-z0-9._-]+$/.test(entry.path) || typeof entry.reason !== 'string' || !entry.reason.trim()
            || (field === 'frameworkOverrides' && (entry.framework !== 'Bot Framework' || entry.versionKey !== 'BOT-FRAMEWORK-VERSION')))) {
          throw new Error(`Invalid ${field} for ${source.repository}.`);
        }
      }
      seen.add(source.repository);
    }
    const sources = [];
    for (const source of registry.sources) sources.push(await collectSource(source));
    await writeJson(path.join(metadataDir, 'source-data.json'), { formatVersion: 1, collectionId, collectedAt, sources });
    await writeJson(statusFile, { collectionId, collectedAt, complete: true, sourceCount: sources.length });
    console.log('Complete source snapshot saved. Run npm run samples:audit next.');
  } catch (error) {
    await writeJson(statusFile, { collectionId, collectedAt, complete: false, error: error.message });
    throw error;
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  collect().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
