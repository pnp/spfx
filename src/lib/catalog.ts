import generatedCatalog from '../data/catalog.json' with { type: 'json' };
import { assertCatalog, type Catalog, type SampleSummary } from './types.ts';

export { formatDate, formatVersion } from './presentation.ts';

export function parseCatalog(value: unknown): Catalog {
  assertCatalog(value);
  return value;
}

export const catalog: Catalog = parseCatalog(generatedCatalog);
export const summaries: SampleSummary[] = catalog.samples.map((sample) => ({
  id: sample.id, slug: sample.slug, title: sample.title, description: sample.description,
  repository: sample.repository, family: sample.family, experiences: sample.experiences,
  componentTypes: sample.componentTypes, technologies: sample.technologies,
  version: sample.version, versionGroup: sample.versionGroup,
  created: sample.created, updated: sample.updated, authors: sample.authors,
  preview: sample.preview, quality: sample.quality,
}));

export function sitePath(path: string): string {
  const base = import.meta.env?.BASE_URL ?? '/spfx/';
  if (!base.startsWith('/') || base.startsWith('//') || /[\\?#\u0000-\u0020]/u.test(base)) {
    throw new TypeError('BASE_URL must be an absolute site pathname');
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//') || /[\\\u0000-\u001f\u007f]/u.test(path)) {
    throw new TypeError('sitePath requires a local path');
  }
  const prefix = `${base.replace(/\/+$/g, '')}/`;
  const relative = path.replace(/^\/+/g, '');
  const pathname = relative.split(/[?#]/, 1)[0] ?? '';
  for (const segment of pathname.split('/')) {
    let decoded: string;
    try { decoded = decodeURIComponent(segment); } catch { throw new TypeError('Invalid local path encoding'); }
    if (decoded === '.' || decoded === '..' || /[\\/\u0000-\u001f\u007f]/u.test(decoded)) throw new TypeError('Unsafe local path');
  }
  return `${prefix}${relative}`;
}

export function samplePath(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new TypeError('Invalid sample slug');
  return sitePath(`samples/${slug}/`);
}
