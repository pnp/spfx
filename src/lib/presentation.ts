import type { SampleSummary } from './types';

const dateFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(value: string | null): string {
  if (!value) return 'Date not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()))
    throw new Error(`The public catalog contains an invalid date: ${value}`);
  return dateFormat.format(date);
}

export function formatVersion(sample: SampleSummary): string {
  if (sample.versionGroup === 'Not applicable') return 'Bot Framework';
  return sample.version ? `SPFx ${sample.version}` : 'Version not recorded';
}
