const storageKey = 'spfx-samples-collection';
let saved: Set<string> | undefined;
let toastTimer: number | undefined;
let storageAvailable = true;

export function announce(message: string): void {
  const toast = document.querySelector('#site-toast');
  if (!(toast instanceof HTMLElement))
    throw new Error('The site notification region is missing.');
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 5000);
}

export function getSavedIds(): ReadonlySet<string> {
  if (saved) return saved;
  try {
    const raw = localStorage.getItem(storageKey);
    const value: unknown = raw ? JSON.parse(raw) : [];
    if (
      !Array.isArray(value) ||
      !value.every(
        (id): id is string => typeof id === 'string' && id.length > 0,
      )
    ) {
      throw new Error('Saved collection data is not an array of sample IDs.');
    }
    saved = new Set(value);
  } catch (error) {
    console.warn('Saved collection could not be loaded.', error);
    storageAvailable = false;
    saved = new Set<string>();
    announce(
      'Your saved collection could not be loaded. New saves will be kept for this visit only.',
    );
  }
  return saved;
}

export function syncSaveButtons(): void {
  const ids = getSavedIds();
  for (const button of document.querySelectorAll('[data-save-id]')) {
    if (!(button instanceof HTMLButtonElement)) continue;
    const id = button.dataset.saveId;
    const title = button.dataset.saveTitle;
    if (!id || !title)
      throw new Error('A collection button is missing its sample identity.');
    const selected = ids.has(id);
    button.disabled = false;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute(
      'aria-label',
      selected ? `Remove ${title} from collection` : `Save ${title}`,
    );
    const label = button.querySelector('[data-save-label]');
    if (label)
      label.textContent = selected
        ? 'Saved to collection'
        : 'Save to collection';
  }
  const count = document.querySelector('#saved-count');
  if (count) count.textContent = String(ids.size);
}

export function toggleSaved(id: string, title: string): void {
  const next = new Set(getSavedIds());
  const wasSaved = next.delete(id);
  if (!wasSaved) next.add(id);
  saved = next;
  if (storageAvailable) {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch (error) {
      console.warn('Saved collection could not be persisted.', error);
      storageAvailable = false;
    }
  }
  announce(
    `${wasSaved ? 'Removed from' : 'Added to'} your collection: ${title}.${storageAvailable ? '' : ' Changes are saved for this visit only; browser storage is unavailable.'}`,
  );
  syncSaveButtons();
  window.dispatchEvent(new CustomEvent('spfx:collectionchange'));
}
