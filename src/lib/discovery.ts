import {
  assertSearchIndex,
  EXPERIENCES,
  type DiscoveryResult,
  type DiscoveryState,
  type Facet,
  type Facets,
  type SampleSummary,
  type SearchIndex,
} from './types.ts';

export const PAGE_SIZE = 24;
const GROUPS = ['experiences', 'types', 'technologies', 'versions', 'sources'] as const;
type Group = typeof GROUPS[number];
const PARAMS: Record<Group, string> = {
  experiences: 'experience',
  types: 'type',
  technologies: 'technology',
  versions: 'version',
  sources: 'source',
};
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

export function defaultState(): DiscoveryState {
  return {
    q: '', experiences: [], types: [], technologies: [], versions: [], sources: [],
    author: '', savedOnly: false, sort: 'newest', page: 1,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function canonicalValue(group: Group, value: string): string {
  const trimmed = value.trim();
  return group === 'experiences' && trimmed === 'Pages & portals' ? 'SharePoint' : trimmed;
}

function pageNumber(value: string | null): number {
  if (value === null || !/^[1-9]\d*$/.test(value)) return 1;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : 1;
}

export function readDiscoveryState(search: string): DiscoveryState {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const state = defaultState();
  state.q = (params.get('q') ?? '').trim();
  state.author = (params.get('author') ?? '').trim();
  state.savedOnly = params.get('saved') === '1';
  const sort = params.get('sort');
  if (sort === 'newest' || sort === 'updated' || sort === 'title') state.sort = sort;
  state.page = pageNumber(params.get('page'));
  for (const group of GROUPS) state[group] = unique(params.getAll(PARAMS[group]).map((value) => canonicalValue(group, value)));
  return state;
}

export function toSearchParams(state: DiscoveryState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  for (const group of GROUPS) {
    for (const value of unique(state[group].map((value) => canonicalValue(group, value)))) params.append(PARAMS[group], value);
  }
  if (state.author.trim()) params.set('author', state.author.trim());
  if (state.savedOnly) params.set('saved', '1');
  if (state.sort !== 'newest') params.set('sort', state.sort);
  if (Number.isSafeInteger(state.page) && state.page > 1) params.set('page', String(state.page));
  return params;
}

function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en');
}

function values(sample: SampleSummary, group: Group): string[] {
  switch (group) {
    case 'experiences': return sample.experiences;
    case 'types': return sample.componentTypes;
    case 'technologies': return sample.technologies;
    case 'versions': return [sample.versionGroup ?? 'Unknown'];
    case 'sources': return [sample.repository];
  }
}

function versionOrder(a: string, b: string): number {
  const special = (value: string): number => value === 'Unknown' ? 2 : value === 'Not applicable' ? 3 : value.startsWith('<') ? 1 : 0;
  return special(a) - special(b) || collator.compare(b, a) || compareId(a, b);
}

function compareId(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildFacets(
  samples: SampleSummary[],
  countsFrom: (group: Group) => SampleSummary[] = () => samples,
  selected?: DiscoveryState,
): Facets {
  const facets: Facets = { experiences: [], types: [], technologies: [], versions: [], sources: [] };
  for (const group of GROUPS) {
    const labels = new Map<string, string>();
    for (const sample of samples) {
      for (const value of values(sample, group)) labels.set(value, group === 'sources' ? sample.family : value);
    }
    for (const value of selected?.[group] ?? []) if (!labels.has(value)) labels.set(value, value);
    const counts = new Map<string, number>();
    for (const sample of countsFrom(group)) {
      for (const value of new Set(values(sample, group))) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const entries: Facet[] = [...labels].map(([value, label]) => ({ value, label, count: counts.get(value) ?? 0 }));
    entries.sort((a, b) => {
      if (group === 'versions') return versionOrder(a.value, b.value);
      if (group === 'experiences') {
        const index = (value: string) => {
          const found = EXPERIENCES.findIndex((experience) => experience === value);
          return found < 0 ? EXPERIENCES.length : found;
        };
        return index(a.value) - index(b.value) || compareId(a.value, b.value);
      }
      return collator.compare(a.label, b.label) || compareId(a.value, b.value);
    });
    facets[group] = entries;
  }
  return facets;
}

export function discover(samples: SampleSummary[], state: DiscoveryState, savedIds: ReadonlySet<string>): DiscoveryResult {
  const tokens = fold(state.q).split(/\s+/u).filter(Boolean);
  const account = state.author.trim().toLowerCase();
  const base = samples.filter((sample) => {
    if (state.savedOnly && !savedIds.has(sample.id)) return false;
    if (account && !sample.authors.some((author) => author.account?.toLowerCase() === account)) return false;
    const haystack = fold([
      sample.title, sample.description, sample.repository, sample.family,
      ...sample.technologies, ...sample.componentTypes,
      ...sample.authors.flatMap((author) => [author.name, author.account ?? '']),
    ].join(' '));
    return tokens.every((token) => haystack.includes(token));
  });
  const matches = (sample: SampleSummary, excluded?: Group): boolean => GROUPS.every((group) => {
    return group === excluded || state[group].length === 0 || state[group].some((selected) => values(sample, group).includes(selected));
  });
  const results = base.filter((sample) => matches(sample));
  results.sort((a, b) => {
    if (state.sort === 'title') return collator.compare(a.title, b.title) || compareId(a.id, b.id);
    const field = state.sort === 'updated' ? 'updated' : 'created';
    const timestamp = (value: string | null): number => {
      const parsed = value === null ? Number.NaN : Date.parse(value);
      return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
    };
    const left = timestamp(a[field]);
    const right = timestamp(b[field]);
    return (left === right ? 0 : left > right ? -1 : 1) || compareId(a.id, b.id);
  });
  const total = results.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.isSafeInteger(state.page) && state.page > 0 ? state.page : 1;
  const page = Math.min(requested, pageCount);
  const offset = (page - 1) * PAGE_SIZE;
  return {
    samples: results.slice(offset, offset + PAGE_SIZE), total, page, pageCount,
    from: total === 0 ? 0 : offset + 1, to: Math.min(offset + PAGE_SIZE, total),
    facets: buildFacets(samples, (group) => base.filter((sample) => matches(sample, group)), state),
  };
}

export function parseSearchIndex(value: unknown): SearchIndex {
  assertSearchIndex(value);
  return value;
}
