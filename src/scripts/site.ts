import { announce, syncSaveButtons, toggleSaved } from './collection';

const toggle = document.querySelector('#theme-toggle');
const color = document.querySelector('#theme-color');

function applyTheme(theme: 'light' | 'dark', persist = false): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (toggle instanceof HTMLButtonElement) {
    toggle.setAttribute('aria-checked', String(theme === 'dark'));
    toggle.setAttribute(
      'aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
    );
    toggle.title = toggle.getAttribute('aria-label') ?? '';
  }
  if (color instanceof HTMLMetaElement)
    color.content = theme === 'dark' ? '#0d1625' : '#f5f7fb';
  if (persist) {
    try {
      localStorage.setItem('spfx-samples-theme', theme);
    } catch (error) {
      console.warn('Theme preference could not be persisted.', error);
      announce('Theme changed for this visit. Browser storage is unavailable.');
    }
  }
}

applyTheme(
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
);
toggle?.addEventListener('click', () =>
  applyTheme(
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark',
    true,
  ),
);
syncSaveButtons();
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('[data-save-id]');
  if (!(button instanceof HTMLButtonElement)) return;
  const id = button.dataset.saveId;
  const title = button.dataset.saveTitle;
  if (!id || !title)
    throw new Error('A collection action is missing its sample identity.');
  toggleSaved(id, title);
});
window.addEventListener('storage', (event) => {
  if (event.key === 'spfx-samples-collection') {
    announce(
      'Your collection changed in another tab. Reload this page to load those changes.',
    );
  }
});
document.addEventListener(
  'error',
  (event) => {
    const image = event.target;
    if (
      !(image instanceof HTMLImageElement) ||
      !image.matches('[data-card-image], [data-preview-image]')
    )
      return;
    const fallback = document.body.dataset.fallback;
    if (!fallback)
      throw new Error('The gallery fallback image is not configured.');
    const wrap = image.closest('[data-preview-wrap]');
    if (wrap instanceof HTMLElement) {
      wrap.classList.add('is-fallback');
      const label = wrap.querySelector('[data-fallback-label]');
      if (label instanceof HTMLElement) label.hidden = false;
    }
    image.alt = 'Preview unavailable';
    if (image.dataset.fallbackApplied === 'true') {
      console.error(
        'The sample preview and the generic fallback image could not be loaded.',
        image.src,
      );
      image.style.visibility = 'hidden';
      return;
    }
    image.dataset.fallbackApplied = 'true';
    image.src = fallback;
  },
  true,
);
document.addEventListener('keydown', (event) => {
  if (
    event.key !== '/' ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    !(event.target instanceof Element)
  )
    return;
  if (event.target.closest('input,textarea,select,[contenteditable="true"]'))
    return;
  const input = document.querySelector('#sample-search');
  if (input instanceof HTMLInputElement) {
    event.preventDefault();
    input.focus();
  }
});
for (const image of document.querySelectorAll<HTMLImageElement>(
  '[data-card-image], [data-preview-image]',
)) {
  if (image.complete && image.naturalWidth === 0)
    image.dispatchEvent(new Event('error'));
}
const filterDrawer = document.querySelector('.filter-drawer');
if (filterDrawer instanceof HTMLDetailsElement) {
  const compact = window.matchMedia('(max-width: 820px)');
  const syncFilterLayout = () => {
    filterDrawer.open = !compact.matches;
  };
  syncFilterLayout();
  compact.addEventListener('change', syncFilterLayout);
}
const contributorSearch = document.querySelector('#contributor-search');
if (contributorSearch instanceof HTMLInputElement) {
  contributorSearch.addEventListener('input', () => {
    const query = contributorSearch.value.toLocaleLowerCase().trim();
    let visible = 0;
    for (const card of document.querySelectorAll<HTMLElement>(
      '[data-contributor]',
    )) {
      card.hidden = !card.dataset.contributor?.includes(query);
      if (!card.hidden) visible++;
    }
    const status = document.querySelector('#contributor-count');
    if (status)
      status.textContent = `${visible.toLocaleString('en')} community contributors`;
  });
}
