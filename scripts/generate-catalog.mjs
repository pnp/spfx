import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalog, toSummary } from '../src/lib/catalog-model.ts';
import { isRecord } from '../src/lib/types.ts';
import { preparePreviews } from './prepare-previews.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (isRecord(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
};
const identity = (source) => {
  if (!isRecord(source)) throw new Error('Invalid source registry entry');
  return stable({
    repository: source.repository, roots: source.roots, family: source.family,
    reviewedExclusions: source.reviewedExclusions ?? [],
    frameworkOverrides: source.frameworkOverrides ?? [],
  });
};

export function validateCollection(snapshot, report, status, registry) {
  if (!isRecord(snapshot) || !isRecord(report) || !isRecord(status) || !isRecord(registry)
    || status.complete !== true || typeof status.collectionId !== 'string' || !status.collectionId.trim()
    || snapshot.collectionId !== status.collectionId || report.collectionId !== status.collectionId
    || snapshot.collectedAt !== status.collectedAt || report.collectedAt !== status.collectedAt
    || registry.formatVersion !== 1 || !Array.isArray(registry.sources) || !Array.isArray(snapshot.sources)
    || status.sourceCount !== registry.sources.length || snapshot.sources.length !== registry.sources.length) {
    throw new Error('Refusing to generate from an incomplete or mismatched collection');
  }
  const registryIdentities = registry.sources.map(identity).map((value) => JSON.stringify(value)).sort();
  const snapshotIdentities = snapshot.sources.map(identity).map((value) => JSON.stringify(value)).sort();
  if (JSON.stringify(registryIdentities) !== JSON.stringify(snapshotIdentities)) {
    throw new Error('Source registry and collected source definitions disagree; refresh the collection');
  }
}

export async function generateCatalog() {
  const read = async (path) => JSON.parse(await readFile(resolve(root, ...path.split('\\')), 'utf8'));
  const [samples, snapshot, report, status, registry] = await Promise.all([
    '.metadata\\samples.json', '.metadata\\source-data.json', '.metadata\\quality-report.json',
    '.metadata\\collection-status.json', '.metadata\\sources.json',
  ].map(read));
  validateCollection(snapshot, report, status, registry);
  const catalog = buildCatalog(samples, snapshot, report);
  await preparePreviews(catalog, { root });
  const search = { schemaVersion: 1, generatedAt: catalog.generatedAt, samples: catalog.samples.map(toSummary) };
  for (const [path, value] of [
    ['src\\data\\catalog.json', catalog],
    ['public\\catalog.json', catalog],
    ['public\\search-index.json', search],
  ]) {
    const destination = resolve(root, ...path.split('\\'));
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  }
  console.log(`Generated ${catalog.totals.samples} samples from ${catalog.sources.length} sources; `
    + `${catalog.totals.contributors} contributors; source audit: ${catalog.totals.errors} errors, `
    + `${catalog.totals.warnings} warnings; ${catalog.totals.missingMetadata} folder without metadata.`);
  return catalog;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateCatalog();
