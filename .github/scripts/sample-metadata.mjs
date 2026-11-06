import { createHash } from 'node:crypto';
import { parse as parseJsonc, printParseErrorCode } from 'jsonc-parser';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const unique = (values) => [...new Set(values)].sort();
const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const partialVersionPattern = /^\d+\.\d+$/;
const technologies = new Map([
  ['react', 'React'], ['reactjs', 'React'], ['react.js', 'React'],
  ['javascript', 'JavaScript'], ['vanilla javascript', 'JavaScript'],
  ['typescript', 'TypeScript'], ['jquery', 'jQuery'],
  ['angular', 'Angular'], ['angularjs', 'AngularJS'],
  ['knockout', 'Knockout'], ['knockoutjs', 'Knockout'],
  ['vue', 'Vue.js'], ['vuejs', 'Vue.js'], ['vue.js', 'Vue.js'],
  ['no framework', 'JavaScript'], ['none', 'JavaScript'],
]);
const extensionTypes = {
  ApplicationCustomizer: 'Application customizer',
  ListViewCommandSet: 'ListView command set',
  FieldCustomizer: 'Field customizer',
  FormCustomizer: 'Form customizer',
};

export function fingerprint(issue) {
  return createHash('sha256').update(JSON.stringify([
    issue.repository, issue.path, issue.index ?? null, issue.field, issue.code,
  ])).digest('hex');
}

export function parseDate(value) {
  if (!hasText(value) || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return null;
  const day = value.slice(0, 10);
  const midnight = new Date(`${day}T00:00:00Z`);
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.valueOf()) || Number.isNaN(midnight.valueOf())
    || midnight.toISOString().slice(0, 10) !== day ? null : date;
}

export function parseGithubFile(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (['raw.githubusercontent.com', 'raw.github.com'].includes(url.hostname) && parts.length >= 4) {
    const refIndex = parts[2] === 'refs' && parts[3] === 'heads' ? 4 : 2;
    return { repository: `${parts[0]}/${parts[1]}`, ref: parts[refIndex], path: parts.slice(refIndex + 1).join('/') };
  }
  if (url.hostname === 'github.com' && ['blob', 'raw', 'tree'].includes(parts[2]) && parts.length >= 5) {
    const refIndex = parts[3] === 'refs' && parts[4] === 'heads' ? 5 : 3;
    return { repository: `${parts[0]}/${parts[1]}`, ref: parts[refIndex], path: parts.slice(refIndex + 1).join('/') };
  }
  return null;
}

export function compareBaseline(issues, baseline) {
  const allowed = new Set(baseline.issues.map((issue) => issue.fingerprint));
  return issues.filter((issue) => issue.severity === 'error' && !allowed.has(issue.fingerprint));
}

export function auditSnapshot(snapshot, { now = new Date() } = {}) {
  const issues = [];
  const samples = [];
  const summaries = [];
  const seenNames = new Map();
  const seenUrls = new Map();
  const externalUrls = new Set();
  let verifiedAssets = 0;
  const sourceMaps = new Map(snapshot.sources.map((source) => [
    source.repository.toLowerCase(), new Map(source.files.map((file) => [file.path, file])),
  ]));
  const issue = (context, severity, code, field, message) => {
    const result = { ...context, severity, code, field, message };
    result.fingerprint = fingerprint(result);
    issues.push(result);
  };
  const urlValue = (value, context, field) => {
    if (!hasText(value)) {
      issue(context, 'error', 'url.missing', field, 'A non-empty absolute HTTPS URL is required.');
      return null;
    }
    let url;
    try { url = new URL(value); } catch {
      issue(context, 'error', 'url.invalid', field, 'Invalid absolute URL.');
      return null;
    }
    if (url.protocol !== 'https:' || url.username || url.password) {
      issue(context, 'error', 'url.unsafe', field, 'Use HTTPS without embedded credentials.');
      return null;
    }
    return url;
  };
  const strings = (value, context, field, required = true) => {
    if (!Array.isArray(value) || (required && value.length === 0) || value.some((entry) => !hasText(entry))) {
      issue(context, required ? 'error' : 'warning', 'array.invalid', field, 'Expected an array of non-empty strings.');
      return [];
    }
    if (new Set(value.map((entry) => entry.trim().toLowerCase())).size !== value.length) {
      issue(context, 'warning', 'array.duplicates', field, 'Duplicate values should be consolidated.');
    }
    return value.map((entry) => entry.trim());
  };
  const checkAsset = (value, context, field) => {
    if (!urlValue(value, context, field)) return;
    let target;
    try { target = parseGithubFile(value); } catch {
      issue(context, 'error', 'url.encoding', field, 'Invalid URL path encoding.');
      return;
    }
    const fileMap = target && sourceMaps.get(target.repository.toLowerCase());
    if (!fileMap) {
      externalUrls.add(value);
      return;
    }
    const file = fileMap.get(target.path);
    if (!file) {
      const caseMatch = [...fileMap.keys()].find((filePath) => filePath.toLowerCase() === target.path.toLowerCase());
      issue(context, 'error', caseMatch ? 'asset.case-mismatch' : 'asset.missing', field,
        caseMatch ? `Filename casing differs from ${caseMatch}.` : `Asset not found in collected repository tree: ${target.path}`);
    } else if (file.size === 0) {
      issue(context, 'error', 'asset.empty', field, 'Asset is empty.');
    } else {
      verifiedAssets++;
    }
  };

  for (const source of snapshot.sources) {
    const before = issues.length;
    const beforeSamples = samples.length;
    const contextFor = (filePath) => ({ repository: source.repository, path: filePath });
    const packageVersions = new Map();
    const components = new Map();
    const hosts = new Map();
    const folderOf = (filePath) => source.folders.find((folder) => filePath.startsWith(`${folder}/`));
    const excludedFolders = new Set((source.reviewedExclusions ?? []).map((entry) => entry.path));

    for (const document of source.packages) {
      const context = contextFor(document.path);
      let data;
      try { data = JSON.parse(document.text.replace(/^\uFEFF/, '')); } catch (error) {
        issue(context, 'error', 'package.invalid-json', '$', error.message);
        continue;
      }
      if (!isObject(data)) {
        issue(context, 'error', 'package.invalid-shape', '$', 'Expected a package object.');
        continue;
      }
      const dependencies = { ...data.dependencies, ...data.devDependencies };
      const versions = Object.entries(dependencies).filter(([key]) => /^@microsoft\/sp-(core-library|webpart-base|extension-base|adaptive-card-extension-base|copilot)/.test(key))
        .map(([, value]) => value).filter((value) => typeof value === 'string');
      const folder = folderOf(document.path);
      packageVersions.set(folder, unique([...(packageVersions.get(folder) ?? []), ...versions]));
    }
    for (const document of source.manifests) {
      const context = contextFor(document.path);
      const errors = [];
      const data = parseJsonc(document.text, errors, { allowTrailingComma: true });
      if (errors.length || !isObject(data)) {
        issue(context, 'error', 'manifest.invalid-jsonc', '$',
          errors.map((error) => `${printParseErrorCode(error.error)} at offset ${error.offset}`).join('; ') || 'Expected a manifest object.');
        continue;
      }
      const folder = folderOf(document.path);
      const types = components.get(folder) ?? [];
      if (data.componentType === 'WebPart') types.push('Web part');
      else if (data.componentType === 'AdaptiveCardExtension') types.push('Adaptive Card Extension');
      else if (data.componentType === 'CopilotComponent') types.push('Copilot component');
      else if (data.componentType === 'Library') types.push('Library component');
      else if (data.componentType === 'Extension') types.push(extensionTypes[data.extensionType] ?? 'Extension (unclassified)');
      else if (hasText(data.componentType)) issue(context, 'warning', 'component.unknown', 'componentType', `Unmapped component type: ${data.componentType}`);
      components.set(folder, unique(types));
      if (Array.isArray(data.supportedHosts)) {
        hosts.set(folder, unique([...(hosts.get(folder) ?? []), ...data.supportedHosts.filter(hasText)]));
      }
    }

    for (const folder of source.folders) {
      if (!excludedFolders.has(folder) && !source.documents.some((document) => document.path.startsWith(`${folder}/`))) {
        issue(contextFor(folder), 'error', 'metadata.missing', '$', 'Sample folder has no sample.json; it cannot appear in the gallery yet.');
      }
    }

    for (const document of source.documents) {
      const documentContext = contextFor(document.path);
      if (!document.path.endsWith('/assets/sample.json')) {
        issue(documentContext, 'warning', 'metadata.location', '$', 'Use the canonical assets/sample.json path and casing.');
      }
      if (document.text.startsWith('\uFEFF')) issue(documentContext, 'warning', 'json.bom', '$', 'Remove the UTF-8 byte order mark.');
      let records;
      try { records = JSON.parse(document.text.replace(/^\uFEFF/, '')); } catch (error) {
        issue(documentContext, 'error', 'json.invalid', '$', error.message);
        continue;
      }
      if (isObject(records)) {
        issue(documentContext, 'warning', 'json.object-root', '$', 'Legacy object root accepted; prefer an array of sample objects.');
        records = [records];
      }
      if (!Array.isArray(records) || !records.length) {
        issue(documentContext, 'error', 'json.invalid-root', '$', 'Expected a non-empty array of sample objects.');
        continue;
      }
      for (const [index, record] of records.entries()) {
        const context = { ...documentContext, index };
        const start = issues.length;
        if (!isObject(record)) {
          issue(context, 'error', 'sample.invalid', '$', 'Expected a sample object; nested arrays are not silently flattened.');
          continue;
        }
        for (const field of ['name', 'source', 'title', 'shortDescription']) {
          if (!hasText(record[field])) issue(context, 'error', 'text.missing', field, 'A non-empty string is required.');
          else {
            if (record[field] !== record[field].trim()) issue(context, 'warning', 'text.whitespace', field, 'Trim leading and trailing whitespace.');
            if (/<\/?[a-z][^>]*>/i.test(record[field])) issue(context, 'warning', 'text.markup', field, 'Use plain text; the gallery must escape metadata.');
          }
        }
        if (hasText(record.name) && !/^[a-z0-9][a-z0-9._-]*$/i.test(record.name)) {
          issue(context, 'warning', 'name.format', 'name', 'Prefer a stable identifier containing letters, digits, dots, underscores or hyphens.');
        }
        for (const [field, seen, code] of [['name', seenNames, 'name.duplicate'], ['url', seenUrls, 'url.duplicate']]) {
          if (!hasText(record[field])) continue;
          const key = record[field].trim().toLowerCase().replace(/\/$/, '');
          if (seen.has(key)) issue(context, 'warning', code, field, `Also used by ${seen.get(key)}; records remain namespaced, not silently deduplicated.`);
          else seen.set(key, `${source.repository}/${document.path}#${index}`);
        }
        const sampleUrl = urlValue(record.url, context, 'url');
        const directory = document.path.replace(/\/assets\/sample\.json$/i, '').replace(/\/sample\.json$/i, '');
        if (sampleUrl) {
          let target;
          try { target = parseGithubFile(record.url); } catch {
            issue(context, 'error', 'url.encoding', 'url', 'Invalid URL path encoding.');
          }
          if (!target || sampleUrl.hostname !== 'github.com' || !sampleUrl.pathname.includes('/tree/')
            || target.repository.toLowerCase() !== source.repository.toLowerCase() || target.path.replace(/\/$/, '') !== directory) {
            issue(context, 'error', 'url.source-mismatch', 'url', `Expected the sample directory in ${source.repository}: ${directory}`);
          }
        }
        if (record.downloadUrl !== undefined) urlValue(record.downloadUrl, context, 'downloadUrl');
        else issue(context, 'warning', 'download.missing', 'downloadUrl', 'No download link; derive one explicitly in the future gallery.');
        strings(record.longDescription, context, 'longDescription');
        const products = strings(record.products, context, 'products');
        const created = parseDate(record.creationDateTime);
        const updated = parseDate(record.updateDateTime);
        for (const [field, value] of [['creationDateTime', created], ['updateDateTime', updated]]) {
          if (!value) issue(context, 'error', 'date.invalid', field, 'Expected a real ISO date or timestamp.');
          else if (value > now) issue(context, 'warning', 'date.future', field, 'Date is in the future.');
        }
        if (created && updated && updated < created) issue(context, 'error', 'date.order', 'updateDateTime', 'Update date is earlier than creation date.');

        const metadata = new Map();
        if (!Array.isArray(record.metadata) || !record.metadata.length) issue(context, 'error', 'metadata.invalid', 'metadata', 'Expected a non-empty key/value array.');
        else for (const [metadataIndex, item] of record.metadata.entries()) {
          const field = `metadata[${metadataIndex}]`;
          if (!isObject(item) || !hasText(item.key) || !hasText(item.value)) {
            issue(context, 'error', 'metadata.entry-invalid', field, 'Metadata keys and values must be non-empty strings.');
            continue;
          }
          const key = item.key.trim().toUpperCase();
          if (metadata.has(key)) {
            const conflict = key === 'SPFX-VERSION' && metadata.get(key) !== item.value.trim();
            issue(context, conflict ? 'error' : 'warning', 'metadata.duplicate-key', field, `Repeated metadata key: ${key}`);
            if (key !== 'SPFX-VERSION') {
              metadata.set(key, `${metadata.get(key)}, ${item.value.trim()}`);
              continue;
            }
          }
          metadata.set(key, item.value.trim());
        }
        const folder = folderOf(document.path);
        const declaredVersions = packageVersions.get(folder) ?? [];
        const frameworkOverride = source.frameworkOverrides?.find((entry) => entry.path === folder);
        const framework = frameworkOverride?.framework ?? 'SharePoint Framework';
        const frameworkVersion = frameworkOverride ? metadata.get(frameworkOverride.versionKey) ?? null : metadata.get('SPFX-VERSION') ?? null;
        if (frameworkOverride && (!frameworkVersion || declaredVersions.length || metadata.has('SPFX-VERSION'))) {
          issue(context, 'error', 'framework.override-invalid', 'metadata',
            'Reviewed non-SPFx framework classification no longer matches the metadata/packages; revalidate the source registry.');
        }
        const spfxVersion = frameworkOverride ? null : frameworkVersion;
        const validVersion = spfxVersion && (versionPattern.test(spfxVersion) || partialVersionPattern.test(spfxVersion));
        const versionParts = validVersion ? spfxVersion.split('.').slice(0, 2).map(Number) : null;
        const spfxVersionGroup = versionParts
          ? versionParts[0] < 1 || (versionParts[0] === 1 && versionParts[1] < 1) ? '< 1.1' : versionParts.join('.')
          : null;
        if (spfxVersion && partialVersionPattern.test(spfxVersion)) {
          issue(context, 'warning', 'version.patch-unspecified', 'metadata.SPFX-VERSION', 'Legacy major.minor version accepted for filtering; supply a patch version for reproducibility.');
        } else if (!frameworkOverride && (!spfxVersion || !versionPattern.test(spfxVersion))) {
          issue(context, 'error', 'version.invalid', 'metadata.SPFX-VERSION', 'Expected an SPFx version, optionally with prerelease/build suffix.');
        }
        const exactVersions = unique(declaredVersions.filter((version) => versionPattern.test(version)));
        if (!frameworkOverride && !declaredVersions.length) issue(context, 'warning', 'version.unverified', 'metadata.SPFX-VERSION', 'No comparable SPFx package dependency found.');
        else if (spfxVersion && versionPattern.test(spfxVersion) && exactVersions.length && !exactVersions.includes(spfxVersion)) {
          issue(context, 'error', 'version.package-mismatch', 'metadata.SPFX-VERSION', `Package dependencies declare ${exactVersions.join(', ')}.`);
        }
        if (declaredVersions.some((version) => !versionPattern.test(version))) issue(context, 'warning', 'version.range', 'metadata.SPFX-VERSION', 'Package ranges cannot prove the installed SPFx version.');
        const rawTechnology = metadata.get('CLIENT-SIDE-DEV');
        const technology = rawTechnology ? unique(rawTechnology.split(/[,;|]/).map((value) => value.trim()).filter(Boolean)
          .map((value) => technologies.get(value.toLowerCase()) ?? value)) : [];
        if (!technology.length) issue(context, 'warning', 'technology.missing', 'metadata.CLIENT-SIDE-DEV', 'Technology filter metadata is missing.');
        let componentTypes = components.get(folder) ?? [];
        if (source.family === 'Copilot components') componentTypes = unique([...componentTypes, 'Copilot component']);
        if (source.family === 'Reference scenarios') componentTypes = unique([...componentTypes, 'Reference scenario']);
        if (!componentTypes.length) {
          componentTypes = [source.family === 'Extensions' ? 'Extension (unclassified)' : source.family === 'Web parts' ? 'Web part' : 'Adaptive Card Extension'];
          issue(context, 'warning', 'component.unverified', 'gallery.componentTypes', 'Repository-family fallback used; no classifiable component manifest found.');
        }
        if (componentTypes.includes('Extension (unclassified)')) issue(context, 'warning', 'component.unclassified', 'gallery.componentTypes', 'Extension subtype requires source metadata/manifest correction.');
        const supportedHosts = hosts.get(folder) ?? [];
        if (supportedHosts.some((host) => ['TeamsTab', 'TeamsPersonalApp'].includes(host))) componentTypes = unique([...componentTypes, 'Teams tab']);

        if (!Array.isArray(record.authors) || !record.authors.length) issue(context, 'error', 'authors.missing', 'authors', 'At least one author is required.');
        else for (const [authorIndex, author] of record.authors.entries()) {
          const field = `authors[${authorIndex}]`;
          if (!isObject(author)) {
            issue(context, 'error', 'author.invalid', field, 'Expected an author object.');
            continue;
          }
          for (const key of ['name', 'gitHubAccount']) if (!hasText(author[key])) issue(context, 'error', 'author.missing-field', `${field}.${key}`, 'A non-empty author field is required.');
          if (hasText(author.gitHubAccount) && !/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(author.gitHubAccount)) {
            issue(context, 'warning', 'author.account-format', `${field}.gitHubAccount`, 'Check the GitHub account format.');
          }
          if (author.pictureUrl !== undefined) urlValue(author.pictureUrl, context, `${field}.pictureUrl`);
          else issue(context, 'warning', 'author.picture-missing', `${field}.pictureUrl`, 'Author picture is missing.');
        }
        if (!Array.isArray(record.thumbnails) || !record.thumbnails.length) issue(context, 'error', 'preview.missing', 'thumbnails', 'At least one image preview is required.');
        else {
          const orders = new Set();
          let images = 0;
          for (const [thumbnailIndex, thumbnail] of record.thumbnails.entries()) {
            const field = `thumbnails[${thumbnailIndex}]`;
            if (!isObject(thumbnail)) {
              issue(context, 'error', 'preview.invalid', field, 'Expected a thumbnail object.');
              continue;
            }
            if (thumbnail.type === 'image') images++;
            else if (thumbnail.type !== 'video') issue(context, 'warning', 'preview.type', `${field}.type`, 'Expected an image or video thumbnail.');
            if (!Number.isInteger(thumbnail.order) || thumbnail.order < 0) issue(context, 'error', 'preview.order', `${field}.order`, 'Expected a non-negative integer.');
            if (orders.has(thumbnail.order)) issue(context, 'warning', 'preview.duplicate-order', `${field}.order`, 'Preview order is duplicated.');
            orders.add(thumbnail.order);
            if (!hasText(thumbnail.alt)) issue(context, 'error', 'preview.alt-missing', `${field}.alt`, 'Meaningful preview alt text is required.');
            else if (/^(preview|screenshot|web part preview|image|sample)$/i.test(thumbnail.alt.trim())) issue(context, 'warning', 'preview.alt-generic', `${field}.alt`, 'Replace generic alt text with a description of the sample.');
            checkAsset(thumbnail.url, context, `${field}.url`);
          }
          if (!images) issue(context, 'error', 'preview.no-image', 'thumbnails', 'No image thumbnail is declared.');
        }
        if (!Array.isArray(record.references)) issue(context, 'warning', 'references.missing', 'references', 'Reference documentation should be supplied as an array.');
        else for (const [referenceIndex, reference] of record.references.entries()) {
          const field = `references[${referenceIndex}]`;
          if (!isObject(reference)) issue(context, 'error', 'reference.invalid', field, 'Expected a reference object.');
          else {
            for (const key of ['name', 'description']) if (!hasText(reference[key])) issue(context, 'warning', 'reference.text-missing', `${field}.${key}`, 'Reference text is missing.');
            if (urlValue(reference.url, context, `${field}.url`)) externalUrls.add(reference.url);
          }
        }
        samples.push({
          ...record,
          gallery: {
            id: `${source.repository}:${document.path}:${index}`,
            repository: source.repository,
            commit: source.commit,
            metadataPath: document.path,
            samplePath: directory,
            sourceUrl: `https://github.com/${source.repository}/tree/${source.commit}/${directory}`,
            family: source.family,
            componentTypes,
            supportedHosts,
            technology,
            products,
            framework,
            frameworkVersion,
            spfxVersion,
            spfxVersionGroup,
            errorCount: issues.slice(start).filter((entry) => entry.severity === 'error').length,
          },
        });
      }
    }
    const sourceIssues = issues.slice(before);
    summaries.push({
      repository: source.repository, commit: source.commit, folders: source.folders.length,
      metadataFiles: source.documents.length, samples: samples.length - beforeSamples,
      excludedFolders: source.reviewedExclusions ?? [],
      missingMetadata: sourceIssues.filter((entry) => entry.code === 'metadata.missing').length,
      errors: sourceIssues.filter((entry) => entry.severity === 'error').length,
      warnings: sourceIssues.filter((entry) => entry.severity === 'warning').length,
    });
  }
  samples.sort((a, b) => a.gallery.id.localeCompare(b.gallery.id));
  issues.sort((a, b) => a.repository.localeCompare(b.repository) || a.path.localeCompare(b.path)
    || (a.index ?? -1) - (b.index ?? -1) || a.field.localeCompare(b.field) || a.code.localeCompare(b.code));
  const facets = {};
  for (const field of ['family', 'componentTypes', 'technology', 'products', 'framework', 'spfxVersionGroup']) {
    const counts = new Map();
    for (const sample of samples) {
      const values = sample.gallery[field];
      for (const value of unique(Array.isArray(values) ? values : values ? [values] : [])) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    facets[field] = Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
  }
  return {
    samples,
    report: {
      formatVersion: 1, collectionId: snapshot.collectionId, collectedAt: snapshot.collectedAt,
      auditedAt: now.toISOString(), sources: summaries, facets,
      linkCoverage: {
        repositoryAssetsVerified: verifiedAssets,
        externalUrlsNotProbed: unique([...externalUrls]),
        method: 'HTTPS syntax plus exact, case-sensitive repository-tree asset existence/size. No external HTTP reachability or image decoding checks.',
      },
      issues,
    },
  };
}

export function reportMarkdown(report) {
  const escape = (value) => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
  const counts = new Map();
  for (const issue of report.issues) {
    const key = `${issue.severity}|${issue.code}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [
    '# SPFx sample metadata quality report', '',
    `Collected: ${report.collectedAt}. Audited: ${report.auditedAt}.`, '',
    'This is a metadata/content audit, not a sample build or a visual review. Older SPFx versions are not defects.',
    'Errors and warnings are retained; parseable records are not silently discarded or deduplicated.', '',
    '| Repository | Commit | Folders | Metadata files | Records | Missing metadata | Errors | Warnings |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...report.sources.map((source) => `| ${source.repository} | ${source.commit} | ${source.folders} | ${source.metadataFiles} | ${source.samples} | ${source.missingMetadata} | ${source.errors} | ${source.warnings} |`),
    '', '## Reviewed coverage exclusions', '',
    ...report.sources.flatMap((source) => (source.excludedFolders ?? []).map((entry) => `- ${source.repository}/${escape(entry.path)}: ${escape(entry.reason)}`)),
    'Excluded folders remain in the candidate folder counts; no source metadata records are discarded.', '',
    '', '## Findings by rule', '', '| Severity | Rule | Count |', '| --- | --- | ---: |',
    ...[...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => `| ${key.replace('|', ' | ')} | ${count} |`),
    '', '## Filter inventory', '',
    ...Object.entries(report.facets).flatMap(([key, values]) => [`### ${key}`, '', ...Object.entries(values).map(([name, count]) => `- ${escape(name)}: ${count}`), '']),
    '## Link verification boundary', '', report.linkCoverage.method,
    `Verified repository asset references: ${report.linkCoverage.repositoryAssetsVerified}.`,
    `Unique external URLs not probed: ${report.linkCoverage.externalUrlsNotProbed.length}. See [machine report](./quality-report.json).`, '',
    '## Remediation backlog', '',
    '| Severity | Repository / metadata path | Record | Field | Rule | Detail |',
    '| --- | --- | ---: | --- | --- | --- |',
    ...report.issues.map((issue) => `| ${issue.severity} | ${escape(`${issue.repository}/${issue.path}`)} | ${issue.index ?? '-'} | ${escape(issue.field)} | ${issue.code} | ${escape(issue.message)} |`),
    '',
  ].join('\n');
}
