import {
  defaultState,
  discover,
  parseSearchIndex,
  readDiscoveryState,
  toSearchParams,
} from '../lib/discovery';
import { formatDate, formatVersion } from '../lib/presentation';
import type { DiscoveryState, Facet, SampleSummary } from '../lib/types';
import { getSavedIds, syncSaveButtons } from './collection';

type FacetKey =
  'experiences' | 'types' | 'technologies' | 'versions' | 'sources';
const facetKeys: FacetKey[] = [
  'experiences',
  'types',
  'technologies',
  'versions',
  'sources',
];
const isFacet = (value: string | undefined): value is FacetKey =>
  facetKeys.some((key) => key === value);
const explorerRoot = document.querySelector('[data-explorer]');

async function initialize(): Promise<void> {
  if (!(explorerRoot instanceof HTMLElement)) return;
  const root = explorerRoot;
  function required<T extends Element>(
    selector: string,
    elementType: { new (): T },
  ): T {
    const element = root.querySelector(selector);
    if (!(element instanceof elementType))
      throw new Error(`The sample explorer is missing ${selector}.`);
    return element;
  }
  const input = required('#sample-search', HTMLInputElement);
  const sort = required('#sample-sort', HTMLSelectElement);
  const grid = required('#sample-grid', HTMLDivElement);
  const template = required('#sample-card-template', HTMLTemplateElement);
  const resultCount = required('#results-count', HTMLParagraphElement);
  const chips = required('#active-filters', HTMLDivElement);
  const empty = required('#empty-state', HTMLDivElement);
  const emptyTitle = required('#empty-title', HTMLHeadingElement);
  const emptyDescription = required('#empty-description', HTMLParagraphElement);
  const previous = required('#previous-page', HTMLButtonElement);
  const next = required('#next-page', HTMLButtonElement);
  const pageStatus = required('#page-status', HTMLSpanElement);
  const savedFilter = required('#saved-filter', HTMLButtonElement);
  const base = document.body.dataset.base;
  if (!base) throw new Error('The sample explorer base path is missing.');
  const indexUrl = root.dataset.indexUrl;
  if (!indexUrl) throw new Error('The sample search index URL is missing.');
  root.setAttribute('aria-busy', 'true');
  const response = await fetch(indexUrl, {
    signal: AbortSignal.timeout(15000),
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok)
    throw new Error(
      `The sample search index returned HTTP ${response.status}.`,
    );
  const index = parseSearchIndex(await response.json());
  let state: DiscoveryState = readDiscoveryState(window.location.search);
  let searchTimer: number | undefined;

  function cardFor(sample: SampleSummary): HTMLElement {
    const card = template.content.firstElementChild?.cloneNode(true);
    if (!(card instanceof HTMLElement))
      throw new Error('The sample card template is missing.');
    card.dataset.sampleId = sample.id;
    const text = (selector: string, value: string) => {
      const element = card.querySelector(selector);
      if (!(element instanceof HTMLElement))
        throw new Error(`The sample card is missing ${selector}.`);
      element.textContent = value;
      return element;
    };
    const image = card.querySelector('[data-card-image]');
    const link = card.querySelector('[data-card-link]');
    const save = card.querySelector('[data-save-id]');
    const tags = card.querySelector('[data-card-tags]');
    const people = card.querySelector('[data-card-authors]');
    const imageWrap = card.querySelector('[data-preview-wrap]');
    const fallbackLabel = card.querySelector('[data-fallback-label]');
    const review = card.querySelector('[data-card-review]');
    if (
      !(image instanceof HTMLImageElement) ||
      !(link instanceof HTMLAnchorElement) ||
      !(save instanceof HTMLButtonElement) ||
      !(tags instanceof HTMLElement) ||
      !(people instanceof HTMLElement) ||
      !(imageWrap instanceof HTMLElement) ||
      !(fallbackLabel instanceof HTMLElement) ||
      !(review instanceof HTMLElement)
    ) {
      throw new Error('The sample card template is incomplete.');
    }
    image.src = sample.preview.src.startsWith('/')
      ? `${base}${sample.preview.src.replace(/^\/+/, '')}`
      : sample.preview.src;
    image.alt = sample.preview.alt;
    image.style.visibility = '';
    delete image.dataset.fallbackApplied;
    imageWrap.classList.toggle('is-fallback', sample.preview.isFallback);
    fallbackLabel.hidden = !sample.preview.isFallback;
    link.href = `${base}samples/${encodeURIComponent(sample.slug)}/`;
    link.textContent = sample.title;
    save.dataset.saveId = sample.id;
    save.dataset.saveTitle = sample.title;
    save.disabled = false;
    text(
      '[data-card-experience]',
      sample.experiences.find((experience) =>
        state.experiences.includes(experience),
      ) ??
        sample.experiences[0] ??
        sample.family,
    );
    text('[data-card-type]', sample.componentTypes[0] ?? sample.family);
    text('[data-card-version]', formatVersion(sample));
    text('[data-card-description]', sample.description);
    const date = text(
      '[data-card-date]',
      formatDate(state.sort === 'updated' ? sample.updated : sample.created),
    );
    date.title =
      state.sort === 'updated' ? 'Metadata last updated' : 'First published';
    review.hidden = !sample.quality.needsReview;
    tags.replaceChildren(
      ...sample.technologies.slice(0, 2).map((technology) => {
        const tag = document.createElement('span');
        tag.textContent = technology;
        return tag;
      }),
    );
    people.replaceChildren();
    for (const author of sample.authors.slice(0, 2)) {
      if (author.avatar) {
        const avatar = document.createElement('img');
        avatar.src = author.avatar;
        avatar.alt = '';
        avatar.width = 22;
        avatar.height = 22;
        avatar.loading = 'lazy';
        avatar.referrerPolicy = 'no-referrer';
        people.append(avatar);
      } else {
        const initial = document.createElement('span');
        initial.className = 'avatar-initial';
        initial.setAttribute('aria-hidden', 'true');
        initial.textContent = author.name.slice(0, 1);
        people.append(initial);
      }
    }
    const names = document.createElement('span');
    names.textContent = `${sample.authors[0]?.name ?? 'Contributor information not recorded'}${sample.authors.length > 1 ? ` +${sample.authors.length - 1}` : ''}`;
    people.append(names);
    return card;
  }

  function addChip(label: string, remove: () => void): void {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.setAttribute('aria-label', `Remove ${label} filter`);
    const close = document.createElement('span');
    close.setAttribute('aria-hidden', 'true');
    close.textContent = '\u00d7';
    button.append(document.createTextNode(label), close);
    button.addEventListener('click', () => {
      remove();
      state.page = 1;
      render('push');
    });
    chips.append(button);
  }

  function render(history: 'push' | 'replace' | false = false): void {
    const saved = getSavedIds();
    const results = discover(index.samples, state, saved);
    const clamped = state.page !== results.page;
    state.page = results.page;
    if (history || clamped) {
      const query = toSearchParams(state).toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      if (history === 'push') window.history.pushState(null, '', url);
      else window.history.replaceState(null, '', url);
    }
    if (document.activeElement !== input) input.value = state.q;
    sort.value = state.sort;
    savedFilter.setAttribute('aria-pressed', String(state.savedOnly));
    for (const tab of root.querySelectorAll<HTMLButtonElement>(
      '[data-experience]',
    )) {
      const value = tab.dataset.experience ?? '';
      tab.setAttribute(
        'aria-pressed',
        String(
          value
            ? state.experiences.includes(value)
            : state.experiences.length === 0,
        ),
      );
      const count = tab.querySelector('.tab-count');
      if (count)
        count.textContent = String(
          value
            ? (results.facets.experiences.find(
                (facet: Facet) => facet.value === value,
              )?.count ?? 0)
            : index.samples.length,
        );
    }
    for (const checkbox of root.querySelectorAll<HTMLInputElement>(
      'input[data-facet]',
    )) {
      const key = checkbox.dataset.facet;
      if (!isFacet(key)) throw new Error(`Unknown filter group: ${key}`);
      checkbox.checked = state[key].includes(checkbox.value);
      const count =
        results.facets[key].find(
          (facet: Facet) => facet.value === checkbox.value,
        )?.count ?? 0;
      checkbox.disabled = count === 0 && !checkbox.checked;
      const label = checkbox
        .closest('label')
        ?.querySelector('[data-facet-count]');
      if (label) label.textContent = String(count);
    }
    resultCount.replaceChildren();
    const total = document.createElement('strong');
    total.textContent = results.total.toLocaleString('en');
    resultCount.append(
      total,
      document.createTextNode(
        results.total === 1
          ? ' starting point for your next idea'
          : ' starting points for your next idea',
      ),
    );
    chips.replaceChildren();
    if (state.q)
      addChip(`Search: ${state.q}`, () => {
        state.q = '';
        input.value = '';
      });
    for (const key of facetKeys)
      for (const value of state[key])
        addChip(value, () => {
          state[key] = state[key].filter((selected) => selected !== value);
        });
    if (state.author)
      addChip(`Contributor: ${state.author}`, () => {
        state.author = '';
      });
    if (state.savedOnly)
      addChip('My collection', () => {
        state.savedOnly = false;
      });
    grid.replaceChildren(...results.samples.map(cardFor));
    grid.hidden = results.total === 0;
    empty.hidden = results.total !== 0;
    const emptyCollection = state.savedOnly && saved.size === 0;
    emptyTitle.textContent = emptyCollection
      ? 'A little collection. A lot of possibility.'
      : 'No matches. Still plenty of possibilities.';
    emptyDescription.textContent = emptyCollection
      ? 'Use the bookmark on any sample to keep your next ideas here. Your collection lives only in this browser; no sign-in needed.'
      : 'Try a different search or remove a filter to discover something new.';
    previous.disabled = results.page <= 1;
    next.disabled = results.page >= results.pageCount || results.total === 0;
    pageStatus.textContent = results.total
      ? `${results.from}\u2013${results.to} of ${results.total.toLocaleString('en')}`
      : 'No matching samples';
    syncSaveButtons();
  }

  input.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.q = input.value.trim();
      state.page = 1;
      render('push');
    }, 220);
  });
  sort.addEventListener('change', () => {
    if (
      sort.value !== 'newest' &&
      sort.value !== 'updated' &&
      sort.value !== 'title'
    )
      throw new Error('Unknown sample sort.');
    state.sort = sort.value;
    state.page = 1;
    render('push');
  });
  root.addEventListener('change', (event) => {
    const checkbox = event.target;
    if (
      !(checkbox instanceof HTMLInputElement) ||
      !checkbox.matches('[data-facet]')
    )
      return;
    const key = checkbox.dataset.facet;
    if (!isFacet(key)) throw new Error('Unknown sample filter.');
    const values = new Set(state[key]);
    if (checkbox.checked) values.add(checkbox.value);
    else values.delete(checkbox.value);
    state[key] = [...values];
    state.page = 1;
    render('push');
  });
  for (const tab of root.querySelectorAll<HTMLButtonElement>(
    '[data-experience]',
  ))
    tab.addEventListener('click', () => {
      const value = tab.dataset.experience;
      if (!value) state.experiences = [];
      else {
        const values = new Set(state.experiences);
        if (!values.delete(value)) values.add(value);
        state.experiences = [...values];
      }
      state.page = 1;
      render('push');
    });
  function reset(): void {
    state = defaultState();
    input.value = '';
    render('push');
  }
  root.querySelector('#clear-filters')?.addEventListener('click', reset);
  root.querySelector('#empty-reset')?.addEventListener('click', reset);
  savedFilter.addEventListener('click', () => {
    state.savedOnly = !state.savedOnly;
    state.page = 1;
    render('push');
  });
  function changePage(delta: number): void {
    state.page += delta;
    render('push');
    root.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  previous.addEventListener('click', () => changePage(-1));
  next.addEventListener('click', () => changePage(1));
  window.addEventListener('popstate', () => {
    state = readDiscoveryState(window.location.search);
    input.value = state.q;
    render();
  });
  window.addEventListener('spfx:collectionchange', () => render());
  render();
  input.disabled = false;
  sort.disabled = false;
  savedFilter.disabled = false;
  for (const button of root.querySelectorAll<HTMLButtonElement>(
    '[data-experience]',
  ))
    button.disabled = false;
  for (const button of root.querySelectorAll<HTMLButtonElement>(
    '#clear-filters, #empty-reset',
  ))
    button.disabled = false;
  root.setAttribute('aria-busy', 'false');
}

void initialize().catch((error: unknown) => {
  console.error(
    'The interactive sample explorer could not be initialized.',
    error,
  );
  const notice = document.querySelector('#explorer-error');
  if (notice instanceof HTMLElement) {
    notice.hidden = false;
    notice.textContent =
      'Interactive discovery could not start. The samples below and the Browse A\u2013Z link remain available. Reload to try again.';
  }
  if (explorerRoot instanceof HTMLElement)
    explorerRoot.setAttribute('aria-busy', 'false');
});
