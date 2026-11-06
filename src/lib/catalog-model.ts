import { createHash } from 'node:crypto';
import { buildFacets } from './discovery.ts';
import {
  ACCOUNT_PATTERN, assertCatalog, FALLBACK_PREVIEW, isHttpsUrl, isRecord, isValidDate, isValidVersion,
  type Author, type Catalog, type Contributor, type Experience, type Issue,
  type Preview, type Sample, type SampleSummary,
} from './types.ts';

interface Document {
  path: string;
  text: string;
}

interface Source {
  repository: string;
  commit: string;
  family: string;
  roots: string[];
  folders: string[];
  files: Map<string, number>;
  documents: Document[];
  packages: Document[];
  exclusions: string[];
  overrides: { path: string; framework: string; versionKey: string }[];
}

interface SourceIssue extends Issue {
  repository: string;
  path: string;
  index: number | null;
}

interface SourceReport {
  repository: string;
  commit: string;
  folders: number;
  metadataFiles: number;
  samples: number;
  missingMetadata: number;
  errors: number;
  warnings: number;
  exclusions: string[];
}

type Note = (code: string, field: string, message: string, severity?: Issue['severity']) => void;

function fail(message: string): never {
  throw new TypeError(`Catalog input: ${message}`);
}

function object(value: unknown, field: string): Record<string, unknown> {
  return isRecord(value) ? value : fail(`${field} must be an object`);
}

function array(value: unknown, field: string): unknown[] {
  return Array.isArray(value) ? value : fail(`${field} must be an array`);
}

function text(value: unknown, field: string): string {
  return typeof value === 'string' && value.trim() ? value : fail(`${field} must be a non-empty string`);
}

function integer(value: unknown, field: string): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value : fail(`${field} must be a non-negative safe integer`);
}

function exactStrings(value: unknown, field: string): string[] {
  return array(value, field).map((value) => text(value, field));
}

function unique(values: string[], field: string): string[] {
  if (new Set(values).size !== values.length) fail(`duplicate ${field}`);
  return values;
}

function path(value: unknown, field: string): string {
  const result = text(value, field);
  if (/[\\\u0000-\u001f\u007f]/u.test(result) || result.split('/').some((part) => !part || part === '.' || part === '..')) {
    fail(`${field} must be a canonical repository-relative path`);
  }
  return result;
}

function documents(value: unknown, field: string): Document[] {
  const result = array(value, field).map((value) => {
    const item = object(value, field);
    if (typeof item.text !== 'string') fail(`${field}.text must be a string`);
    return { path: path(item.path, `${field}.path`), text: item.text };
  });
  unique(result.map((document) => document.path), `${field} path`);
  return result;
}

function repository(value: unknown): string {
  const result = text(value, 'repository');
  if (!/^[a-z0-9][a-z0-9_.-]*\/[a-z0-9][a-z0-9_.-]*$/i.test(result)) fail('invalid repository');
  return result;
}

function commit(value: unknown): string {
  const result = text(value, 'commit');
  if (!/^[0-9a-f]{40}$/i.test(result)) fail('source commit must be a full Git SHA');
  return result;
}

function parseSource(value: unknown): Source {
  const source = object(value, 'source');
  const files = new Map<string, number>();
  for (const value of array(source.files, 'source.files')) {
    const file = object(value, 'file');
    const filePath = path(file.path, 'file.path');
    if (files.has(filePath)) fail(`duplicate tree path ${filePath}`);
    files.set(filePath, integer(file.size, 'file.size'));
  }
  const exclusions = source.reviewedExclusions === undefined ? [] : array(source.reviewedExclusions, 'reviewedExclusions')
    .map((value) => path(object(value, 'exclusion').path, 'exclusion.path'));
  const overrides = source.frameworkOverrides === undefined ? [] : array(source.frameworkOverrides, 'frameworkOverrides').map((value) => {
    const entry = object(value, 'frameworkOverride');
    return {
      path: path(entry.path, 'frameworkOverride.path'),
      framework: text(entry.framework, 'frameworkOverride.framework'),
      versionKey: text(entry.versionKey, 'frameworkOverride.versionKey'),
    };
  });
  const result: Source = {
    repository: repository(source.repository), commit: commit(source.commit),
    family: text(source.family, 'source.family'), roots: exactStrings(source.roots, 'source.roots'),
    folders: unique(exactStrings(source.folders, 'source.folders').map((value) => path(value, 'folder')), 'folder'),
    files, documents: documents(source.documents, 'source.documents'),
    packages: documents(source.packages, 'source.packages'), exclusions, overrides,
  };
  unique(exclusions, 'exclusion');
  unique(overrides.map((override) => override.path), 'framework override');
  for (const folder of result.folders) {
    if (!result.roots.some((root) => folder.startsWith(`${path(root, 'source.root')}/`))) fail(`folder outside source roots: ${folder}`);
  }
  for (const excluded of exclusions) if (!result.folders.includes(excluded)) fail(`excluded folder not collected: ${excluded}`);
  for (const document of result.documents) {
    if (!files.has(document.path) || !result.folders.some((folder) => document.path.startsWith(`${folder}/`))) {
      fail(`metadata document outside collected tree: ${document.path}`);
    }
  }
  // Manifests are pinned evidence behind the audited gallery projection, not browser-side dependencies.
  for (const document of [...result.packages, ...documents(source.manifests, 'source.manifests')]) {
    if (!files.has(document.path)) fail(`evidence document outside collected tree: ${document.path}`);
  }
  return result;
}

function parseIssue(value: unknown): SourceIssue {
  const entry = object(value, 'issue');
  if (entry.severity !== 'error' && entry.severity !== 'warning') fail('invalid issue severity');
  return {
    repository: repository(entry.repository), path: path(entry.path, 'issue.path'),
    index: entry.index === undefined ? null : integer(entry.index, 'issue.index'),
    code: text(entry.code, 'issue.code'), field: text(entry.field, 'issue.field'),
    message: text(entry.message, 'issue.message'), severity: entry.severity,
  };
}

function parseSourceReport(value: unknown): SourceReport {
  const source = object(value, 'report.source');
  return {
    repository: repository(source.repository), commit: commit(source.commit),
    folders: integer(source.folders, 'report.folders'), metadataFiles: integer(source.metadataFiles, 'report.metadataFiles'),
    samples: integer(source.samples, 'report.samples'), missingMetadata: integer(source.missingMetadata, 'report.missingMetadata'),
    errors: integer(source.errors, 'report.errors'), warnings: integer(source.warnings, 'report.warnings'),
    exclusions: array(source.excludedFolders, 'report.excludedFolders').map((value) => path(object(value, 'excludedFolder').path, 'excludedFolder.path')),
  };
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function slugPart(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function encodePath(value: string): string {
  return value.split('/').map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)).join('/');
}

function nullableText(value: unknown, field: string): string | null {
  return value === null ? null : text(value, field);
}

function normalizeText(value: unknown, field: string, note: Note): string {
  if (typeof value !== 'string' || !value.trim()) {
    note('text.missing', field, 'A non-empty text value was not recorded.', 'error');
    return typeof value === 'string' ? value : '';
  }
  if (value !== value.trim()) note('text.whitespace', field, 'Leading or trailing whitespace was removed for display.');
  if (/<\/?[a-z][^>]*>/i.test(value)) note('text.markup', field, 'Metadata contains markup and must be displayed as text.');
  return value.trim();
}

function normalizeStrings(value: unknown, field: string, note: Note): string[] {
  if (!Array.isArray(value)) {
    note('array.invalid', field, 'Expected an array of non-empty strings; the legacy shape needs review.', 'error');
    return typeof value === 'string' && value.trim() ? [value.trim()] : [];
  }
  if (value.length === 0) note('array.invalid', field, 'A non-empty string array was not recorded.', 'error');
  const result: string[] = [];
  for (const [index, entry] of value.entries()) {
    if (typeof entry !== 'string' || !entry.trim()) {
      note('array.entry-invalid', `${field}[${index}]`, 'Invalid array entry was omitted; the original finding remains available.', 'error');
    } else if (!result.includes(entry.trim())) result.push(entry.trim());
    else note('array.duplicates', field, 'Duplicate display values were consolidated.');
  }
  return result;
}

function normalizeDate(value: unknown, field: string, note: Note): string | null {
  if (isValidDate(value)) return value;
  note('date.invalid', field, 'Expected a real ISO date or timestamp; no date was inferred.', 'error');
  return null;
}

function normalizeMetadata(value: unknown, note: Note): Map<string, string> {
  const metadata = new Map<string, string>();
  if (!Array.isArray(value) || value.length === 0) {
    note('metadata.invalid', 'metadata', 'Expected a non-empty metadata key/value array.', 'error');
    return metadata;
  }
  for (const [index, entry] of value.entries()) {
    const field = `metadata[${index}]`;
    if (!isRecord(entry) || typeof entry.key !== 'string' || !entry.key.trim() || typeof entry.value !== 'string' || !entry.value.trim()) {
      note('metadata.entry-invalid', field, 'Metadata keys and values must be non-empty strings.', 'error');
      continue;
    }
    const key = entry.key.trim().toUpperCase();
    const declared = entry.value.trim();
    const previous = metadata.get(key);
    if (previous !== undefined) {
      note('metadata.duplicate-key', field, `Repeated metadata key: ${key}`, key === 'SPFX-VERSION' && previous !== declared ? 'error' : 'warning');
    }
    metadata.set(key, previous !== undefined && key !== 'SPFX-VERSION' ? `${previous}, ${declared}` : declared);
  }
  return metadata;
}

function safeUrl(value: unknown, field: string, note: Note): string | null {
  if (isHttpsUrl(value)) return value;
  if (typeof value === 'string' && !/[\\\u0000-\u001f\u007f]/u.test(value)) {
    try {
      const normalized = new URL(value.trim()).href;
      if (isHttpsUrl(normalized)) {
        note('url.normalized', field, 'Legacy URL whitespace or encoding was normalized to a safe HTTPS URL.');
        return normalized;
      }
    } catch {
      // Invalid legacy URLs are reported below, never guessed.
    }
  }
  note('url.unsafe', field, 'A missing, invalid or unsafe URL was not exposed.');
  return null;
}

function normalizeAuthors(value: unknown, note: Note): Author[] {
  if (!Array.isArray(value)) {
    note('authors.invalid', 'authors', 'Expected an author array; no author identities were inferred.', 'error');
    return [];
  }
  if (value.length === 0) note('authors.missing', 'authors', 'No authors were recorded.', 'error');
  return value.flatMap((entry, index): Author[] => {
    const field = `authors[${index}]`;
    if (!isRecord(entry)) {
      note('author.invalid', field, 'Expected an author object; the invalid entry was omitted.', 'error');
      return [];
    }
    const name = normalizeText(entry.name, `${field}.name`, note);
    const rawAccount = typeof entry.gitHubAccount === 'string' ? entry.gitHubAccount.trim() : '';
    const account = ACCOUNT_PATTERN.test(rawAccount) ? rawAccount : null;
    if (account === null) note('author.account-format', `${field}.gitHubAccount`, 'No valid GitHub account was recorded; the actual author name is retained.');
    const avatar = entry.pictureUrl === undefined ? null : safeUrl(entry.pictureUrl, `${field}.pictureUrl`, note);
    return [{ name, account, avatar }];
  });
}

interface GithubAsset {
  repository: string;
  path: string;
}

function githubAsset(url: URL): GithubAsset | null {
  const parts = url.pathname.split('/').slice(1).map(decodeURIComponent);
  if (parts.some((part) => !part || part === '.' || part === '..' || /[\\/\u0000-\u001f\u007f]/u.test(part))) return null;
  const [owner, repo] = parts;
  if (!owner || !repo) return null;
  if (['raw.githubusercontent.com', 'raw.github.com'].includes(url.hostname)) {
    const offset = parts[2] === 'refs' && parts[3] === 'heads' ? 5 : 3;
    return parts.length > offset ? { repository: `${owner}/${repo}`, path: parts.slice(offset).join('/') } : null;
  }
  if (url.hostname === 'github.com' && ['blob', 'raw', 'tree'].some((kind) => kind === parts[2])) {
    const offset = parts[3] === 'refs' && parts[4] === 'heads' ? 6 : 4;
    return parts.length > offset ? { repository: `${owner}/${repo}`, path: parts.slice(offset).join('/') } : null;
  }
  return null;
}

function normalizePreviews(value: unknown, sources: Map<string, Source>, title: string, note: Note): Preview[] {
  if (!Array.isArray(value)) {
    note('preview.invalid', 'thumbnails', 'Expected a thumbnail array; no screenshot was inferred.', 'error');
    return [{ ...FALLBACK_PREVIEW }];
  }
  const entries = value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      note('preview.invalid', `thumbnails[${index}]`, 'Expected a thumbnail object.', 'error');
      return [];
    }
    const validOrder = typeof entry.order === 'number' && Number.isSafeInteger(entry.order) && entry.order >= 0;
    if (!validOrder) note('preview.order', `thumbnails[${index}].order`, 'Invalid preview order; this entry follows all explicitly ordered images.', 'error');
    return [{ entry, index, order: validOrder && typeof entry.order === 'number' ? entry.order : Number.MAX_SAFE_INTEGER }];
  }).sort((a, b) => a.order - b.order || a.index - b.index);
  const previews: Preview[] = [];
  for (const { entry, index } of entries) {
    if (entry.type !== 'image') {
      if (entry.type !== 'video') note('preview.type', `thumbnails[${index}].type`, 'Only explicitly declared image thumbnails can be previews.');
      continue;
    }
    const field = `thumbnails[${index}]`;
    const safe = safeUrl(entry.url, `${field}.url`, note);
    if (!safe) continue;
    const url = new URL(safe);
    let asset: GithubAsset | null;
    try { asset = githubAsset(url); } catch {
      note('url.encoding', `${field}.url`, 'Invalid URL path encoding; this preview was skipped.', 'error');
      continue;
    }
    const basename = (asset?.path ?? url.pathname).split('/').at(-1) ?? '';
    const stem = basename.replace(/\.[^.]+$/, '').replace(/[-_. ]/g, '').toLowerCase();
    if (/^(?:pnp(?:logo|brand|samples)?|microsoft(?:365|logo|brand)?|sharepoint(?:logo|brand)?|office(?:365|logo|brand)?|m365(?:logo|brand)?|logo|samplepreviewfallback)$/.test(stem)) {
      note('preview.branding', `${field}.url`, 'A generic branding image is not a screenshot.');
      continue;
    }
    let src = safe;
    if (asset) {
      const source = sources.get(asset.repository.toLowerCase());
      if (source) {
        if (!/\.(?:png|jpe?g|gif|svg|webp|avif|bmp|tiff?|ico)$/i.test(asset.path)) {
          note('preview.not-image', `${field}.url`, 'The declared repository asset does not have an image extension.');
          continue;
        }
        const size = source.files.get(asset.path);
        if (size === undefined || size === 0) {
          note(size === undefined ? 'asset.missing' : 'asset.empty', `${field}.url`, 'Preview is not a non-empty asset in the exact pinned source tree.', 'error');
          continue;
        }
        src = `https://raw.githubusercontent.com/${source.repository}/${source.commit}/${encodePath(asset.path)}`;
      } else {
        note('preview.external-unverified', `${field}.url`, 'External repository image is HTTPS but is not part of the collected source trees.');
      }
    } else if (['github.com', 'raw.github.com', 'raw.githubusercontent.com'].includes(url.hostname)) {
      note('preview.github-invalid', `${field}.url`, 'GitHub image path could not be resolved safely.', 'error');
      continue;
    } else {
      note('preview.external-unverified', `${field}.url`, 'External HTTPS image was not verified against a collected tree.');
    }
    const alt = typeof entry.alt === 'string' && entry.alt.trim() ? entry.alt.trim() : `Preview of ${title}`;
    if (alt !== entry.alt) note('preview.alt-missing', `${field}.alt`, 'Missing preview alt text was replaced with the recorded sample title.');
    if (!previews.some((preview) => preview.src === src)) previews.push({ src, alt, isFallback: false });
  }
  if (previews.length === 0) {
    note('preview.unavailable', 'thumbnails', 'No usable declared image is available; a labelled fallback is shown.');
    return [{ ...FALLBACK_PREVIEW }];
  }
  return previews;
}

function normalizeReferences(value: unknown, note: Note): Sample['references'] {
  if (!Array.isArray(value)) {
    note('references.invalid', 'references', 'Expected a reference array; no links were inferred.');
    return [];
  }
  return value.flatMap((entry, index): Sample['references'] => {
    const field = `references[${index}]`;
    if (!isRecord(entry)) {
      note('reference.invalid', field, 'Expected a reference object; this entry was omitted.', 'error');
      return [];
    }
    const url = safeUrl(entry.url, `${field}.url`, note);
    if (!url) return [];
    return [{
      title: normalizeText(entry.name, `${field}.name`, note),
      description: normalizeText(entry.description, `${field}.description`, note),
      url,
    }];
  });
}

function experiences(source: Source, types: string[], hosts: string[], products: string[]): Experience[] {
  const result: Experience[] = [];
  const copilot = source.family === 'Copilot components' || types.includes('Copilot component');
  if (copilot) result.push('Copilot');
  if (hosts.some((host) => /^Teams/i.test(host)) || products.some((product) => /^(?:Microsoft )?Teams$/i.test(product))) result.push('Teams');
  if (types.includes('Adaptive Card Extension') || source.family === 'Adaptive Card Extensions') result.push('Connections');
  const pageComponent = types.some((type) => /^(?:Web part|Application customizer|ListView command set|Field customizer|Form customizer|Extension \(unclassified\))$/i.test(type));
  const pageHost = hosts.some((host) => /^(?:SharePointWebPart|SharePointFullPage|SharePoint)$/i.test(host));
  if (pageComponent || pageHost) result.push('SharePoint');
  return result;
}

function versionGroup(version: string): string {
  const [major, minor] = version.split('.').map(Number);
  if (major === undefined || minor === undefined) return fail('invalid version grouping');
  return major < 1 || (major === 1 && minor < 1) ? '< 1.1' : `${major}.${minor}`;
}

function contributes(samples: Sample[]): Contributor[] {
  const contributors = new Map<string, Contributor>();
  for (const sample of samples) {
    const seen = new Set<string>();
    for (const author of sample.authors) {
      if (!author.account && !author.name) continue;
      const id = author.account ? `github:${author.account.toLowerCase()}` : `name:${digest(author.name)}`;
      const existing = contributors.get(id);
      if (existing) {
        if (!seen.has(id)) existing.count++;
        if (!existing.name && author.name) existing.name = author.name;
        if (!existing.avatar && author.avatar) existing.avatar = author.avatar;
      } else {
        contributors.set(id, { ...author, account: author.account?.toLowerCase() ?? null, id, count: 1 });
      }
      seen.add(id);
    }
  }
  return [...contributors.values()].sort((a, b) => b.count - a.count || a.id.localeCompare(b.id, 'en'));
}

export function toSummary(sample: Sample): SampleSummary {
  return {
    id: sample.id, slug: sample.slug, title: sample.title, description: sample.description,
    repository: sample.repository, family: sample.family, experiences: [...sample.experiences],
    componentTypes: [...sample.componentTypes], technologies: [...sample.technologies],
    version: sample.version, versionGroup: sample.versionGroup, created: sample.created, updated: sample.updated,
    authors: sample.authors.map((author) => ({ ...author })), preview: { ...sample.preview }, quality: { ...sample.quality },
  };
}

export function buildCatalog(samplesInput: unknown, snapshotInput: unknown, reportInput: unknown): Catalog {
  const snapshot = object(snapshotInput, 'snapshot');
  const report = object(reportInput, 'report');
  if (snapshot.formatVersion !== 1 || report.formatVersion !== 1) fail('unsupported input formatVersion');
  const collectionId = text(snapshot.collectionId, 'snapshot.collectionId');
  if (report.collectionId !== collectionId || snapshot.collectedAt !== report.collectedAt) fail('snapshot/report collection mismatch');
  if (!isValidDate(snapshot.collectedAt) || !isValidDate(report.auditedAt)) fail('invalid collection/audit timestamp');
  const sources = array(snapshot.sources, 'snapshot.sources').map(parseSource);
  if (sources.length === 0) fail('empty source collection');
  unique(sources.map((source) => source.repository.toLowerCase()), 'source repository');
  const sourceMap = new Map(sources.map((source) => [source.repository.toLowerCase(), source]));
  const sourceReports = array(report.sources, 'report.sources').map(parseSourceReport);
  unique(sourceReports.map((source) => source.repository.toLowerCase()), 'report repository');
  if (sourceReports.length !== sources.length) fail('snapshot/report source count mismatch');
  const sourceIssues = array(report.issues, 'report.issues').map(parseIssue);
  for (const issue of sourceIssues) if (!sourceMap.has(issue.repository.toLowerCase())) fail('issue references uncollected source');
  const inputs = array(samplesInput, 'samples');
  if (inputs.length === 0) fail('empty sample collection');
  const records = new Map<string, Record<string, unknown>>();
  for (const value of inputs) {
    const record = object(value, 'sample');
    const gallery = object(record.gallery, 'sample.gallery');
    const id = text(gallery.id, 'gallery.id');
    if (records.has(id)) fail(`duplicate source id ${id}`);
    records.set(id, record);
  }
  const normalized: Sample[] = [];
  const expectedIds = new Set<string>();
  for (const source of sources) {
    const summary = sourceReports.find((summary) => summary.repository === source.repository);
    if (!summary || summary.commit !== source.commit) fail(`source revision mismatch for ${source.repository}`);
    const issues = sourceIssues.filter((issue) => issue.repository === source.repository);
    const missing = source.folders.filter((folder) => !source.exclusions.includes(folder)
      && !source.documents.some((document) => document.path.startsWith(`${folder}/`)));
    if (summary.folders !== source.folders.length || summary.metadataFiles !== source.documents.length
      || summary.missingMetadata !== missing.length
      || JSON.stringify([...summary.exclusions].sort()) !== JSON.stringify([...source.exclusions].sort())
      || summary.errors !== issues.filter((issue) => issue.severity === 'error').length
      || summary.warnings !== issues.filter((issue) => issue.severity === 'warning').length
      || issues.filter((issue) => issue.code === 'metadata.missing').length !== missing.length
      || missing.some((folder) => !issues.some((issue) => issue.code === 'metadata.missing' && issue.path === folder))) {
      fail(`source counts/findings do not reconcile for ${source.repository}`);
    }
    const before = normalized.length;
    const recordPositions = new Set<string>();
    for (const document of source.documents) {
      let raw: unknown;
      try { raw = JSON.parse(document.text.replace(/^\uFEFF/, '')); } catch {
        if (!issues.some((issue) => issue.path === document.path && issue.code === 'json.invalid')) fail(`unreported invalid metadata ${document.path}`);
        continue;
      }
      const rawRecords: unknown[] = isRecord(raw) ? [raw] : Array.isArray(raw) ? raw : [];
      if (rawRecords.length === 0) {
        if (!issues.some((issue) => issue.path === document.path && issue.code === 'json.invalid-root')) fail(`unreported invalid root ${document.path}`);
        continue;
      }
      for (const [index, rawRecord] of rawRecords.entries()) {
        recordPositions.add(`${source.repository}:${document.path}:${index}`);
        if (!isRecord(rawRecord)) {
          if (!issues.some((issue) => issue.path === document.path && issue.index === index && issue.code === 'sample.invalid')) fail(`unreported invalid record ${document.path}:${index}`);
          continue;
        }
        const id = `${source.repository}:${document.path}:${index}`;
        expectedIds.add(id);
        const record = records.get(id);
        if (!record) fail(`parseable source record missing from samples: ${id}`);
        const gallery = object(record.gallery, 'gallery');
        const { gallery: _gallery, ...recordWithoutProjection } = record;
        if (JSON.stringify(recordWithoutProjection) !== JSON.stringify(rawRecord)) fail(`raw record/snapshot mismatch: ${id}`);
        const samplePath = document.path.replace(/\/assets\/sample\.json$/i, '').replace(/\/sample\.json$/i, '');
        if (samplePath === document.path || gallery.repository !== source.repository || gallery.commit !== source.commit
          || gallery.family !== source.family || gallery.metadataPath !== document.path || gallery.samplePath !== samplePath) {
          fail(`gallery provenance mismatch: ${id}`);
        }
        const folder = [...source.folders].sort((a, b) => b.length - a.length).find((folder) => document.path.startsWith(`${folder}/`));
        if (!folder || source.exclusions.includes(folder)) fail(`metadata in ineligible folder: ${id}`);
        const sampleIssues: Issue[] = issues.filter((issue) => {
          if (issue.path === document.path) return issue.index === null || issue.index === index;
          if (source.documents.some((document) => document.path === issue.path)) return false;
          return issue.path === folder || issue.path.startsWith(`${folder}/`)
            || !source.folders.some((folder) => issue.path === folder || issue.path.startsWith(`${folder}/`));
        }).map(({ code, field, message, severity }) => ({ code, field, message, severity }));
        const note: Note = (code, field, message, severity = 'warning') => {
          if (!sampleIssues.some((issue) => issue.code === code && issue.field === field)) sampleIssues.push({ code, field, message, severity });
        };
        const title = normalizeText(record.title, 'title', note);
        const description = normalizeText(record.shortDescription, 'shortDescription', note);
        normalizeText(record.name, 'name', note);
        normalizeText(record.source, 'source', note);
        const componentTypes = exactStrings(gallery.componentTypes, 'gallery.componentTypes');
        const technologies = exactStrings(gallery.technology, 'gallery.technology');
        const supportedHosts = exactStrings(gallery.supportedHosts, 'gallery.supportedHosts');
        const products = normalizeStrings(record.products, 'products', note);
        const metadata = normalizeMetadata(record.metadata, note);
        const framework = text(gallery.framework, 'gallery.framework');
        const declaredFrameworkVersion = nullableText(gallery.frameworkVersion, 'gallery.frameworkVersion');
        const declaredVersion = nullableText(gallery.spfxVersion, 'gallery.spfxVersion');
        const override = source.overrides.find((override) => override.path === folder);
        if ((override && override.framework !== framework) || (!override && framework !== 'SharePoint Framework')) fail(`unregistered framework override: ${id}`);
        const rawFrameworkVersion = metadata.get(override?.versionKey ?? 'SPFX-VERSION') ?? null;
        if (declaredFrameworkVersion !== rawFrameworkVersion || declaredVersion !== (override ? null : rawFrameworkVersion)) {
          fail(`gallery/raw framework version mismatch: ${id}`);
        }
        const version = framework === 'SharePoint Framework' && isValidVersion(declaredVersion) ? declaredVersion : null;
        const frameworkVersion = framework === 'SharePoint Framework' ? version : declaredFrameworkVersion;
        if (framework === 'SharePoint Framework' && version === null) note('version.invalid', 'metadata.SPFX-VERSION', 'No valid declared SPFx version was recorded; no supported version was inferred.', 'error');
        if (version && /^\d+\.\d+$/.test(version)) note('version.patch-unspecified', 'metadata.SPFX-VERSION', 'The declared legacy major.minor version is retained without inventing a patch.');
        if (override && declaredVersion !== null) fail(`non-SPFx sample has an SPFx version: ${id}`);
        const previews = normalizePreviews(record.thumbnails, sourceMap, title, note);
        const preview = previews[0];
        if (!preview) fail('preview invariant failed');
        const authors = normalizeAuthors(record.authors, note);
        const descriptionParagraphs = normalizeStrings(record.longDescription, 'longDescription', note);
        const references = normalizeReferences(record.references, note);
        const created = normalizeDate(record.creationDateTime, 'creationDateTime', note);
        const updated = normalizeDate(record.updateDateTime, 'updateDateTime', note);
        if (created && updated && Date.parse(updated) < Date.parse(created)) note('date.order', 'updateDateTime', 'The recorded update date precedes the creation date.', 'error');
        const root = `https://github.com/${source.repository}`;
        const downloadParams = new URLSearchParams({ url: `${root}/tree/main/${encodePath(samplePath)}` });
        normalized.push({
          id, slug: '', title, description, repository: source.repository, family: source.family,
          experiences: experiences(source, componentTypes, supportedHosts, products),
          componentTypes: [...new Set(componentTypes)], technologies: [...new Set(technologies)],
          version, versionGroup: framework === 'SharePoint Framework' ? version ? versionGroup(version) : null : 'Not applicable',
          created, updated, authors, preview, sourceUrl: `${root}/tree/${source.commit}/${encodePath(samplePath)}`,
          revisionUrl: `${root}/commit/${source.commit}`,
          metadataUrl: `${root}/blob/${source.commit}/${encodePath(document.path)}`,
          downloadUrl: `https://pnp.github.io/download-partial/?${downloadParams.toString()}`,
          descriptionParagraphs, previews, references, products, supportedHosts, framework, frameworkVersion,
          issues: sampleIssues, quality: { needsReview: sampleIssues.some((issue) => issue.severity === 'error'), issueCount: sampleIssues.length },
        });
      }
    }
    for (const issue of issues) {
      if (issue.index !== null && !recordPositions.has(`${source.repository}:${issue.path}:${issue.index}`)) {
        fail(`finding refers to an uncollected record: ${source.repository}:${issue.path}:${issue.index}`);
      }
    }
    if (normalized.length - before !== summary.samples) fail(`parseable source sample count mismatch for ${source.repository}`);
  }
  if (expectedIds.size !== records.size || normalized.length !== inputs.length) fail('sample count loss or unexpected source ids');
  normalized.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const bases = new Map<string, string>();
  const baseCounts = new Map<string, number>();
  for (const sample of normalized) {
    const record = records.get(sample.id);
    if (!record) fail('source identity invariant failed');
    const gallery = object(record.gallery, 'gallery');
    const name = typeof record.name === 'string' && record.name.trim() ? record.name : text(gallery.samplePath, 'gallery.samplePath');
    const base = slugPart(`${sample.repository}-${name}`).slice(0, 150).replace(/-+$/g, '');
    if (!base) fail('empty slug base');
    bases.set(sample.id, base);
    baseCounts.set(base, (baseCounts.get(base) ?? 0) + 1);
  }
  const slugs = new Set<string>();
  const reservedBases = new Set(bases.values());
  for (const sample of normalized) {
    const base = bases.get(sample.id);
    if (!base) fail('slug invariant failed');
    sample.slug = base;
    if ((baseCounts.get(base) ?? 0) > 1) {
      const hash = digest(sample.id);
      let length = 16;
      let suffix = 0;
      sample.slug = `${base}-${hash.slice(0, length)}`;
      while (reservedBases.has(sample.slug) || slugs.has(sample.slug)) {
        if (length < hash.length) length = Math.min(length + 8, hash.length);
        else suffix++;
        sample.slug = `${base}-${hash.slice(0, length)}${suffix ? `-${suffix}` : ''}`;
      }
    }
    if (slugs.has(sample.slug)) fail(`slug uniqueness invariant failed: ${sample.id}`);
    slugs.add(sample.slug);
  }
  const contributors = contributes(normalized);
  const sum = (field: 'folders' | 'metadataFiles' | 'missingMetadata' | 'errors' | 'warnings'): number => sourceReports.reduce((total, source) => total + source[field], 0);
  const catalog: Catalog = {
    schemaVersion: 1, generatedAt: new Date().toISOString(), refreshedAt: snapshot.collectedAt,
    sources: sourceReports.map(({ repository, commit, samples, missingMetadata, errors, warnings }) => ({ repository, commit, samples, missingMetadata, errors, warnings })),
    samples: normalized, contributors, facets: buildFacets(normalized),
    totals: {
      samples: normalized.length, contributors: contributors.length, metadataFiles: sum('metadataFiles'),
      candidateFolders: sum('folders'), eligibleFolders: sum('folders') - sources.reduce((total, source) => total + source.exclusions.length, 0),
      missingMetadata: sum('missingMetadata'), errors: sum('errors'), warnings: sum('warnings'),
    },
  };
  assertCatalog(catalog);
  return catalog;
}
