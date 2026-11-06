export type Experience = 'Copilot' | 'Teams' | 'Connections' | 'SharePoint';

export interface Author {
  name: string;
  account: string | null;
  avatar: string | null;
}

export interface Preview {
  src: string;
  alt: string;
  isFallback: boolean;
}

export interface Facet {
  value: string;
  label: string;
  count: number;
}

export interface Facets {
  experiences: Facet[];
  types: Facet[];
  technologies: Facet[];
  versions: Facet[];
  sources: Facet[];
}

export interface SampleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  repository: string;
  family: string;
  experiences: Experience[];
  componentTypes: string[];
  technologies: string[];
  version: string | null;
  versionGroup: string | null;
  created: string | null;
  updated: string | null;
  authors: Author[];
  preview: Preview;
  quality: { needsReview: boolean; issueCount: number };
}

export interface Issue {
  code: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface Sample extends SampleSummary {
  sourceUrl: string;
  revisionUrl: string;
  metadataUrl: string;
  downloadUrl: string;
  descriptionParagraphs: string[];
  previews: Preview[];
  references: { title: string; url: string; description: string }[];
  products: string[];
  supportedHosts: string[];
  framework: string;
  frameworkVersion: string | null;
  issues: Issue[];
}

export interface Contributor extends Author {
  id: string;
  count: number;
}

export interface Catalog {
  schemaVersion: 1;
  generatedAt: string;
  refreshedAt: string;
  sources: {
    repository: string;
    commit: string;
    samples: number;
    missingMetadata: number;
    errors: number;
    warnings: number;
  }[];
  samples: Sample[];
  contributors: Contributor[];
  facets: Facets;
  totals: {
    samples: number;
    contributors: number;
    metadataFiles: number;
    candidateFolders: number;
    eligibleFolders: number;
    missingMetadata: number;
    errors: number;
    warnings: number;
  };
}

export interface SearchIndex {
  schemaVersion: 1;
  generatedAt: string;
  samples: SampleSummary[];
}

export interface DiscoveryState {
  q: string;
  experiences: string[];
  types: string[];
  technologies: string[];
  versions: string[];
  sources: string[];
  author: string;
  savedOnly: boolean;
  sort: 'newest' | 'updated' | 'title';
  page: number;
}

export interface DiscoveryResult {
  samples: SampleSummary[];
  total: number;
  page: number;
  pageCount: number;
  from: number;
  to: number;
  facets: Facets;
}

export const EXPERIENCES: readonly Experience[] = ['Copilot', 'Teams', 'Connections', 'SharePoint'];
export const ACCOUNT_PATTERN = /^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;
export const VERSION_PATTERN = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)?$/;
export const FALLBACK_PREVIEW: Readonly<Preview> = {
  src: '/images/sample-preview-fallback.png',
  alt: 'Preview unavailable',
  isFallback: true,
};

export function isValidVersion(value: unknown): value is string {
  if (typeof value !== 'string' || !VERSION_PATTERN.test(value)) return false;
  const prerelease = /^\d+\.\d+\.\d+-([^+]+)/.exec(value)?.[1];
  return prerelease === undefined || prerelease.split('.').every((part) => !/^\d+$/.test(part) || part === '0' || !part.startsWith('0'));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value !== value.trim() || /[\u0000-\u0020\u007f\\]/u.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return false;
  const day = value.slice(0, 10);
  const date = new Date(value);
  const midnight = new Date(`${day}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && Number.isFinite(midnight.valueOf())
    && midnight.toISOString().slice(0, 10) === day;
}

function requireValue(condition: boolean, field: string): asserts condition {
  if (!condition) throw new TypeError(`Invalid catalog field: ${field}`);
}

function object(value: unknown, field: string): Record<string, unknown> {
  requireValue(isRecord(value), field);
  return value;
}

function text(value: unknown, field: string, nonempty = false): asserts value is string {
  requireValue(typeof value === 'string' && (!nonempty || value.trim().length > 0), field);
}

function integer(value: unknown, field: string): asserts value is number {
  requireValue(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0, field);
}

function list(value: unknown, field: string): unknown[] {
  requireValue(Array.isArray(value), field);
  return value;
}

function strings(value: unknown, field: string): void {
  for (const entry of list(value, field)) text(entry, field, true);
}

function nullableText(value: unknown, field: string): void {
  if (value !== null) text(value, field, true);
}

function date(value: unknown, field: string): void {
  requireValue(value === null || isValidDate(value), field);
}

function author(value: unknown, field: string): void {
  const entry = object(value, field);
  text(entry.name, `${field}.name`);
  requireValue(entry.account === null || (typeof entry.account === 'string' && ACCOUNT_PATTERN.test(entry.account)), `${field}.account`);
  requireValue(entry.avatar === null || isHttpsUrl(entry.avatar), `${field}.avatar`);
}

function preview(value: unknown, field: string): void {
  const entry = object(value, field);
  text(entry.alt, `${field}.alt`, true);
  requireValue(typeof entry.isFallback === 'boolean', `${field}.isFallback`);
  if (entry.isFallback) {
    requireValue(entry.src === FALLBACK_PREVIEW.src && entry.alt === FALLBACK_PREVIEW.alt, field);
  } else {
    requireValue(isHttpsUrl(entry.src) || (typeof entry.src === 'string' && /^\/images\/previews\/[a-f0-9]{64}\.webp$/.test(entry.src)), `${field}.src`);
  }
}

export function assertSampleSummary(value: unknown): asserts value is SampleSummary {
  const entry = object(value, 'sample');
  for (const key of ['id', 'slug', 'repository', 'family']) text(entry[key], key, true);
  for (const key of ['title', 'description']) text(entry[key], key);
  requireValue(typeof entry.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug), 'slug');
  requireValue(typeof entry.repository === 'string' && /^[\w.-]+\/[\w.-]+$/.test(entry.repository), 'repository');
  for (const experience of list(entry.experiences, 'experiences')) {
    requireValue(EXPERIENCES.some((candidate) => candidate === experience), 'experiences');
  }
  strings(entry.componentTypes, 'componentTypes');
  strings(entry.technologies, 'technologies');
  requireValue(entry.version === null || isValidVersion(entry.version), 'version');
  nullableText(entry.versionGroup, 'versionGroup');
  date(entry.created, 'created');
  date(entry.updated, 'updated');
  for (const entryAuthor of list(entry.authors, 'authors')) author(entryAuthor, 'authors');
  preview(entry.preview, 'preview');
  const quality = object(entry.quality, 'quality');
  integer(quality.issueCount, 'quality.issueCount');
  requireValue(typeof quality.needsReview === 'boolean' && (!quality.needsReview || quality.issueCount > 0), 'quality.needsReview');
}

function assertFacets(value: unknown): void {
  const facets = object(value, 'facets');
  for (const key of ['experiences', 'types', 'technologies', 'versions', 'sources']) {
    const seen = new Set<string>();
    for (const value of list(facets[key], `facets.${key}`)) {
      const facet = object(value, `facets.${key}`);
      text(facet.value, 'facet.value', true);
      text(facet.label, 'facet.label', true);
      integer(facet.count, 'facet.count');
      requireValue(!seen.has(facet.value), 'facet.value (duplicate)');
      seen.add(facet.value);
    }
  }
}

function uniqueSamples(samples: unknown[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const sample of samples) {
    assertSampleSummary(sample);
    requireValue(!ids.has(sample.id) && !slugs.has(sample.slug), 'duplicate sample id/slug');
    ids.add(sample.id);
    slugs.add(sample.slug);
  }
}

export function assertSearchIndex(value: unknown): asserts value is SearchIndex {
  const entry = object(value, 'search index');
  requireValue(entry.schemaVersion === 1, 'schemaVersion');
  requireValue(isValidDate(entry.generatedAt), 'generatedAt');
  uniqueSamples(list(entry.samples, 'samples'));
}

export function assertCatalog(value: unknown): asserts value is Catalog {
  const entry = object(value, 'catalog');
  assertSearchIndex(value);
  requireValue(isValidDate(entry.refreshedAt), 'refreshedAt');
  const samples = list(entry.samples, 'samples');
  for (const value of samples) {
    const sample = object(value, 'sample');
    for (const key of ['sourceUrl', 'revisionUrl', 'metadataUrl', 'downloadUrl']) {
      requireValue(isHttpsUrl(sample[key]), key);
    }
    strings(sample.descriptionParagraphs, 'descriptionParagraphs');
    strings(sample.products, 'products');
    strings(sample.supportedHosts, 'supportedHosts');
    text(sample.framework, 'framework', true);
    nullableText(sample.frameworkVersion, 'frameworkVersion');
    const previews = list(sample.previews, 'previews');
    requireValue(previews.length > 0 && JSON.stringify(previews[0]) === JSON.stringify(sample.preview), 'previews');
    for (const image of previews) preview(image, 'previews');
    for (const value of list(sample.references, 'references')) {
      const reference = object(value, 'reference');
      text(reference.title, 'reference.title');
      text(reference.description, 'reference.description');
      requireValue(isHttpsUrl(reference.url), 'reference.url');
    }
    const issues = list(sample.issues, 'issues');
    for (const value of issues) {
      const issue = object(value, 'issue');
      for (const key of ['code', 'field', 'message']) text(issue[key], `issue.${key}`, true);
      requireValue(issue.severity === 'error' || issue.severity === 'warning', 'issue.severity');
    }
    requireValue(object(sample.quality, 'quality').issueCount === issues.length, 'quality.issueCount');
    requireValue(object(sample.quality, 'quality').needsReview === issues.some((issue) => isRecord(issue) && issue.severity === 'error'), 'quality.needsReview');
  }
  const repositories = new Set<string>();
  let sourceSamples = 0;
  for (const value of list(entry.sources, 'sources')) {
    const source = object(value, 'source');
    text(source.repository, 'source.repository', true);
    requireValue(!repositories.has(source.repository), 'duplicate source');
    repositories.add(source.repository);
    requireValue(typeof source.commit === 'string' && /^[a-f0-9]{40}$/i.test(source.commit), 'source.commit');
    for (const key of ['samples', 'missingMetadata', 'errors', 'warnings']) integer(source[key], `source.${key}`);
    integer(source.samples, 'source.samples');
    requireValue(samples.filter((sample) => isRecord(sample) && sample.repository === source.repository).length === source.samples, 'source.samples');
    sourceSamples += source.samples;
  }
  requireValue(sourceSamples === samples.length, 'source sample total');
  const contributors = list(entry.contributors, 'contributors');
  const contributorIds = new Set<string>();
  for (const value of contributors) {
    author(value, 'contributor');
    const contributor = object(value, 'contributor');
    text(contributor.id, 'contributor.id', true);
    requireValue(!contributorIds.has(contributor.id), 'duplicate contributor');
    contributorIds.add(contributor.id);
    integer(contributor.count, 'contributor.count');
    requireValue(contributor.count > 0 && contributor.count <= samples.length, 'contributor.count');
  }
  assertFacets(entry.facets);
  const totals = object(entry.totals, 'totals');
  for (const key of ['samples', 'contributors', 'metadataFiles', 'candidateFolders', 'eligibleFolders', 'missingMetadata', 'errors', 'warnings']) {
    integer(totals[key], `totals.${key}`);
  }
  requireValue(totals.samples === samples.length && totals.contributors === contributors.length, 'totals');
}
