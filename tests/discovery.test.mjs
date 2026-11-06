import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PAGE_SIZE, defaultState, readDiscoveryState, toSearchParams, discover, parseSearchIndex,
} from '../src/lib/discovery.ts';
import { isValidVersion } from '../src/lib/types.ts';

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [index, rawSamples, snapshot] = await Promise.all([
  '../public/search-index.json', '../.metadata/samples.json', '../.metadata/source-data.json',
].map(read));
const generated = parseSearchIndex(index);
const emptySaved = new Set();
const state = (changes = {}) => ({ ...defaultState(), ...changes });
const ids = (result) => result.samples.map((sample) => sample.id);

function sample(id, changes = {}) {
  return {
    id, slug: `sample-${id}`, title: `Sample ${id}`, description: 'A clear description',
    repository: 'pnp/source-one', family: 'Web parts', experiences: ['SharePoint'],
    componentTypes: ['Web part'], technologies: ['React'], version: '1.24.0', versionGroup: '1.24',
    created: '2024-01-01', updated: '2024-02-01',
    authors: [{ name: 'Real Author', account: 'real-user', avatar: null }],
    preview: { src: '/images/sample-preview-fallback.png', alt: 'Preview unavailable', isFallback: true },
    quality: { needsReview: false, issueCount: 0 }, ...changes,
  };
}

const samples = [
  sample('a', { title: 'Café Réact card', experiences: ['Connections'], componentTypes: ['Adaptive Card Extension'], technologies: ['React', 'TypeScript'], created: '2023-01-01', updated: '2025-01-01' }),
  sample('b', { title: 'Teams directory', experiences: ['Teams', 'SharePoint'], version: '1.9.0', versionGroup: '1.9', created: '2024-01-01', updated: '2024-02-01' }),
  sample('c', { title: 'Copilot search', repository: 'pnp/source-two', family: 'Copilot components', experiences: ['Copilot'], componentTypes: ['Copilot component'], technologies: ['TypeScript'], version: null, versionGroup: null, authors: [{ name: 'Zoë Other', account: 'other-user', avatar: null }], created: '2025-01-01', updated: null }),
  sample('d', { title: 'Bot task', repository: 'pnp/source-two', family: 'Copilot components', experiences: ['Connections'], componentTypes: ['Adaptive Card Extension'], technologies: [], version: null, versionGroup: 'Not applicable', created: null, updated: null }),
];

test('default state and array instances are independent', () => {
  assert.equal(PAGE_SIZE, 24);
  assert.deepEqual(defaultState(), {
    q: '', experiences: [], types: [], technologies: [], versions: [], sources: [],
    author: '', savedOnly: false, sort: 'newest', page: 1,
  });
  const first = defaultState();
  first.experiences.push('Teams');
  assert.deepEqual(defaultState().experiences, []);
});

test('URL state preserves repeated OR values, unknown explicit facets and escaped text', () => {
  const value = state({
    q: 'café <script> AND things', experiences: ['Teams', 'Connections'],
    types: ['Web part', 'Unknown <type>'], technologies: ['React', 'TypeScript'],
    versions: ['1.24', '< 1.1', 'Unknown'], sources: ['pnp/source-one', 'nonexistent/source'],
    author: 'Real-User', savedOnly: true, sort: 'updated', page: 12,
  });
  const params = toSearchParams(value);
  assert.deepEqual(params.getAll('experience'), value.experiences);
  assert.deepEqual(params.getAll('technology'), value.technologies);
  assert.equal(params.get('saved'), '1');
  assert.deepEqual(readDiscoveryState(`?${params}`), value);
  assert.equal(toSearchParams(defaultState()).toString(), '');
});

test('URL parser rejects invalid page/sort and normalizes blank and duplicate facet values', () => {
  for (const page of ['0', '-1', '1.5', 'Infinity', '1e3', '999999999999999999999', 'abc', '']) {
    assert.equal(readDiscoveryState(`page=${page}`).page, 1);
  }
  const result = readDiscoveryState('?experience=Teams&experience=Teams&experience=&source=missing&sort=bad&saved=true&q=%20hi%20');
  assert.deepEqual(result.experiences, ['Teams']);
  assert.deepEqual(result.sources, ['missing']);
  assert.equal(result.q, 'hi');
  assert.equal(result.sort, 'newest');
  assert.equal(result.savedOnly, false);
});

test('legacy experience URLs explicitly map to SharePoint and serialize only the current value', () => {
  const input = new URLSearchParams();
  input.append('experience', 'Pages & portals');
  input.append('experience', 'SharePoint');
  input.append('experience', 'Teams');
  const parsed = readDiscoveryState(`?${input}`);
  assert.deepEqual(parsed.experiences, ['SharePoint', 'Teams']);
  assert.deepEqual(toSearchParams(parsed).getAll('experience'), ['SharePoint', 'Teams']);
  assert.deepEqual(ids(discover(samples, parsed, emptySaved)), ['b']);
  assert.deepEqual(toSearchParams(state({ experiences: ['Pages & portals'] })).getAll('experience'), ['SharePoint']);
});

test('OR within each facet and AND across groups work independently', () => {
  assert.deepEqual(ids(discover(samples, state({ experiences: ['Connections', 'Teams'] }), emptySaved)), ['b', 'a', 'd']);
  assert.deepEqual(ids(discover(samples, state({
    experiences: ['Connections', 'Teams'], technologies: ['React'], versions: ['1.24'],
  }), emptySaved)), ['a']);
  assert.deepEqual(ids(discover(samples, state({ sources: ['pnp/source-two'], technologies: ['TypeScript'] }), emptySaved)), ['c']);
  assert.deepEqual(ids(discover(samples, state({ types: ['Web part', 'Copilot component'] }), emptySaved)), ['c', 'b']);
});

test('accent-insensitive AND-token search covers source, technologies, types and actual author text', () => {
  assert.deepEqual(ids(discover(samples, state({ q: 'cafe react card' }), emptySaved)), ['a']);
  assert.deepEqual(ids(discover(samples, state({ q: 'cafe nonexistent' }), emptySaved)), []);
  assert.deepEqual(ids(discover(samples, state({ q: 'zoe source-two typescript' }), emptySaved)), ['c']);
  assert.deepEqual(ids(discover(samples, state({ q: 'adaptive typescript real-user' }), emptySaved)), ['a']);
  assert.deepEqual(ids(discover(samples, state({ q: 'CLEAR DIRECTORY' }), emptySaved)), ['b']);
});

test('author filtering is an exact case-insensitive GitHub account match, never a name substring', () => {
  assert.deepEqual(ids(discover(samples, state({ author: 'OTHER-USER' }), emptySaved)), ['c']);
  assert.equal(discover(samples, state({ author: 'other' }), emptySaved).total, 0);
  assert.equal(discover(samples, state({ author: 'Zoë Other' }), emptySaved).total, 0);
  assert.equal(discover(samples, state({ author: 'nonexistent' }), emptySaved).total, 0);
});

test('saved-only uses source IDs and composes with the query and all facet filters', () => {
  const saved = new Set(['a', 'c', 'not-a-current-id']);
  assert.deepEqual(ids(discover(samples, state({ savedOnly: true }), saved)), ['c', 'a']);
  assert.deepEqual(ids(discover(samples, state({ savedOnly: true, technologies: ['React'] }), saved)), ['a']);
  assert.equal(discover(samples, state({ savedOnly: true }), emptySaved).total, 0);
});

test('unknown selected values never silently broaden the results and stay visible with zero counts', () => {
  for (const group of ['experiences', 'types', 'technologies', 'versions', 'sources']) {
    const result = discover(samples, state({ [group]: ['Not in catalog'] }), emptySaved);
    assert.equal(result.total, 0, group);
    assert.ok(result.facets[group].some((facet) => facet.value === 'Not in catalog' && facet.count === 0));
  }
  assert.equal(discover(samples, state({ experiences: ['Not in catalog', 'Teams'] }), emptySaved).total, 1);
});

test('dynamic facet counts exclude only their own group and retain every global value', () => {
  const result = discover(samples, state({ experiences: ['Connections'], technologies: ['React'] }), emptySaved);
  assert.deepEqual(ids(result), ['a']);
  const experience = new Map(result.facets.experiences.map((facet) => [facet.value, facet.count]));
  assert.equal(experience.get('Connections'), 1);
  assert.equal(experience.get('Teams'), 1);
  assert.equal(experience.get('SharePoint'), 1);
  assert.equal(experience.get('Copilot'), 0);
  const technologies = new Map(result.facets.technologies.map((facet) => [facet.value, facet.count]));
  assert.equal(technologies.get('React'), 1);
  assert.equal(technologies.get('TypeScript'), 1);
  assert.equal(result.facets.sources.length, 2);
  assert.equal(result.facets.types.length, 3);
  assert.equal(result.facets.versions.length, 4);
});

test('all facet counts respect search, author and saved filters even when excluding their own group', () => {
  const result = discover(samples, state({ q: 'card', savedOnly: true, author: 'real-user', technologies: ['TypeScript'] }), new Set(['a', 'b']));
  assert.equal(result.total, 1);
  assert.equal(result.facets.technologies.find((facet) => facet.value === 'React').count, 1);
  assert.equal(result.facets.sources.find((facet) => facet.value === 'pnp/source-two').count, 0);
  assert.equal(result.facets.experiences.find((facet) => facet.value === 'Teams').count, 0);
});

test('duplicate metadata values never inflate facet counts', () => {
  const dup = sample('duplicate', { technologies: ['React', 'React'], experiences: ['Teams', 'Teams'] });
  const result = discover([dup], defaultState(), emptySaved);
  assert.equal(result.facets.technologies[0].count, 1);
  assert.equal(result.facets.experiences[0].count, 1);
});

test('version facets sort newest numeric first followed by legacy, Unknown and Not applicable', () => {
  const versions = ['1.9', '1.24', '2.0', '1.10', '< 1.1', null, 'Not applicable'];
  const result = discover(versions.map((versionGroup, index) => sample(String(index), { versionGroup })), defaultState(), emptySaved);
  assert.deepEqual(result.facets.versions.map((facet) => facet.value), ['2.0', '1.24', '1.10', '1.9', '< 1.1', 'Unknown', 'Not applicable']);
  assert.ok(result.facets.versions.every((facet) => facet.value === facet.label));
  assert.deepEqual(result.facets.sources[0], { value: 'pnp/source-one', label: 'Web parts', count: 7 });
});

test('newest, updated and title sorts put missing dates last and break ties deterministically by ID', () => {
  assert.deepEqual(ids(discover(samples, state({ sort: 'newest' }), emptySaved)), ['c', 'b', 'a', 'd']);
  assert.deepEqual(ids(discover(samples, state({ sort: 'updated' }), emptySaved)), ['a', 'b', 'c', 'd']);
  assert.deepEqual(ids(discover(samples, state({ sort: 'title' }), emptySaved)), ['d', 'a', 'c', 'b']);
  const tied = [sample('z'), sample('b'), sample('a')].map((sample) => ({ ...sample, title: 'Same' }));
  for (const sort of ['newest', 'updated', 'title']) {
    assert.deepEqual(ids(discover(tied, state({ sort }), emptySaved)), ['a', 'b', 'z']);
  }
  assert.deepEqual(samples.map((sample) => sample.id), ['a', 'b', 'c', 'd']);
});

test('pagination clamps high/invalid pages, reports ranges and represents empty results consistently', () => {
  const many = Array.from({ length: 49 }, (_, index) => sample(String(index).padStart(3, '0')));
  const first = discover(many, defaultState(), emptySaved);
  assert.equal(first.total, 49);
  assert.equal(first.pageCount, 3);
  assert.equal(first.samples.length, 24);
  assert.equal(first.from, 1);
  assert.equal(first.to, 24);
  const second = discover(many, state({ page: 2 }), emptySaved);
  assert.equal(second.from, 25);
  assert.equal(second.to, 48);
  const last = discover(many, state({ page: 999 }), emptySaved);
  assert.equal(last.page, 3);
  assert.equal(last.from, 49);
  assert.equal(last.to, 49);
  assert.equal(last.samples.length, 1);
  for (const page of [0, -1, 1.5, Number.NaN]) assert.equal(discover(many, state({ page }), emptySaved).page, 1);
  const empty = discover(many, state({ q: 'does-not-exist', page: 999 }), emptySaved);
  assert.deepEqual({ total: empty.total, page: empty.page, pageCount: empty.pageCount, from: empty.from, to: empty.to }, {
    total: 0, page: 1, pageCount: 1, from: 0, to: 0,
  });
});

test('search-index guard rejects invalid nested data, unsafe assets, duplicate IDs and invalid schema', () => {
  assert.equal(generated.samples.length, rawSamples.length);
  const mutations = [
    (index) => { index.schemaVersion = 2; },
    (index) => { index.generatedAt = 'invalid'; },
    (index) => { index.samples[0].experiences = ['Invented experience']; },
    (index) => { index.samples[0].authors = [{ name: 'Real Name', account: 'invalid account', avatar: null }]; },
    (index) => { index.samples[0].preview = { src: 'javascript:alert(1)', alt: 'Unsafe', isFallback: false }; },
    (index) => { index.samples[0].preview = { src: '/images/arbitrary.png', alt: 'Fake', isFallback: true }; },
    (index) => { index.samples[0].version = 'latest'; },
    (index) => { index.samples[0].created = '2025-02-29'; },
    (index) => { index.samples.push(index.samples[0]); },
    (index) => { index.samples[0].slug = '../unsafe'; },
    (index) => { delete index.samples[0].quality; },
  ];
  for (const mutate of mutations) {
    const index = structuredClone(generated);
    mutate(index);
    assert.throws(() => parseSearchIndex(index), TypeError);
  }
  assert.throws(() => parseSearchIndex(null), TypeError);
});

test('XSS-like search and metadata remain plain strings and are safely URL-encoded', () => {
  const payload = '<img src=x onerror=alert(1)>';
  const input = [sample('xss', { title: payload, description: '<script>alert(1)</script>' })];
  const search = readDiscoveryState(`?${toSearchParams(state({ q: payload }))}`);
  assert.equal(search.q, payload);
  assert.equal(discover(input, search, emptySaved).samples[0].title, payload);
  assert.ok(!toSearchParams(search).toString().includes('<img'));
});

test('the complete generated index discovers all records, sources and special version facets', () => {
  const result = discover(generated.samples, defaultState(), emptySaved);
  assert.equal(result.total, rawSamples.length);
  assert.equal(result.pageCount, Math.max(1, Math.ceil(rawSamples.length / PAGE_SIZE)));
  assert.equal(result.facets.sources.length, snapshot.sources.filter((source) => rawSamples.some((sample) => sample.gallery.repository === source.repository)).length);
  assert.equal(result.facets.sources.reduce((total, facet) => total + facet.count, 0), rawSamples.length);
  const unknown = rawSamples.filter((sample) => sample.gallery.framework === 'SharePoint Framework' && !isValidVersion(sample.gallery.spfxVersion)).length;
  const notApplicable = rawSamples.filter((sample) => sample.gallery.framework !== 'SharePoint Framework').length;
  assert.equal(result.facets.versions.find((facet) => facet.value === 'Unknown')?.count ?? 0, unknown);
  assert.equal(result.facets.versions.find((facet) => facet.value === 'Not applicable')?.count ?? 0, notApplicable);
});
