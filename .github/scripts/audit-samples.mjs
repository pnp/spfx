import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { metadataDir, readJson, writeJson } from './collect-samples.mjs';
import { auditSnapshot, compareBaseline, reportMarkdown } from './sample-metadata.mjs';

export function validateSnapshot(snapshot, status, registry) {
  if (!status.complete || !snapshot.collectionId || status.collectionId !== snapshot.collectionId
    || snapshot.formatVersion !== 1 || registry.formatVersion !== 1
    || !Array.isArray(snapshot.sources) || !Array.isArray(registry.sources) || !registry.sources.length
    || snapshot.sources.length !== registry.sources.length || status.sourceCount !== registry.sources.length
    || registry.sources.some((source) => !snapshot.sources.some((entry) => entry.repository === source.repository
      && entry.family === source.family && JSON.stringify(entry.roots) === JSON.stringify(source.roots)
      && JSON.stringify(entry.reviewedExclusions ?? []) === JSON.stringify(source.reviewedExclusions ?? [])
      && JSON.stringify(entry.frameworkOverrides ?? []) === JSON.stringify(source.frameworkOverrides ?? [])))
    || snapshot.sources.some((source) => !/^[a-f0-9]{40}$/.test(source.commit)
      || ['folders', 'files', 'documents', 'packages', 'manifests'].some((field) => !Array.isArray(source[field])))) {
    throw new Error('Collection is incomplete or does not match the source registry. Run npm run samples:collect successfully first.');
  }
}

export async function audit({ updateBaseline = false } = {}) {
  const snapshot = await readJson(path.join(metadataDir, 'source-data.json'));
  const status = await readJson(path.join(metadataDir, 'collection-status.json'));
  const registry = await readJson(path.join(metadataDir, 'sources.json'));
  validateSnapshot(snapshot, status, registry);
  const { samples, report } = auditSnapshot(snapshot);
  await writeJson(path.join(metadataDir, 'samples.json'), samples);
  await writeJson(path.join(metadataDir, 'quality-report.json'), report);
  await writeFile(path.join(metadataDir, 'quality-report.md'), reportMarkdown(report));
  const baselineFile = path.join(metadataDir, 'quality-baseline.json');
  let baseline;
  if (updateBaseline) {
    baseline = {
      formatVersion: 1,
      approvedAt: report.auditedAt,
      sources: report.sources.map(({ repository, commit }) => ({ repository, commit })),
      issues: report.issues.filter((issue) => issue.severity === 'error')
        .map(({ fingerprint, repository, path: filePath, index, field, code }) => ({ fingerprint, repository, path: filePath, index, field, code })),
    };
    await writeJson(baselineFile, baseline);
    console.log('Baseline explicitly updated. Review this change before committing; never update it automatically in CI.');
  } else {
    baseline = await readJson(baselineFile);
    if (baseline.formatVersion !== 1 || !Array.isArray(baseline.issues)) throw new Error('Invalid quality baseline.');
  }
  const newErrors = compareBaseline(report.issues, baseline);
  const errors = report.issues.filter((issue) => issue.severity === 'error').length;
  const warnings = report.issues.length - errors;
  console.log(`${samples.length} sample records; ${errors} metadata errors (${newErrors.length} new); ${warnings} warnings.`);
  console.log(`Reports: ${metadataDir}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(process.env.GITHUB_STEP_SUMMARY, reportMarkdown({ ...report, issues: [] }), { flag: 'a' });
  }
  if (newErrors.length) throw new Error(`${newErrors.length} new metadata errors. Review .metadata/quality-report.md; do not silently refresh the baseline.`);
  return report;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--update-baseline')) {
    console.error('Usage: node .github/scripts/audit-samples.mjs [--update-baseline]');
    process.exitCode = 1;
  } else {
    audit({ updateBaseline: args.includes('--update-baseline') }).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
