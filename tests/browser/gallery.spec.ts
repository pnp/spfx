import { expect, test, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertCatalog, type Catalog } from '../../src/lib/types';

async function publishedCatalog(
  request: APIRequestContext,
  baseURL: string | undefined,
): Promise<Catalog> {
  if (!baseURL) throw new Error('The gallery test base URL is missing.');
  const response = await request.get(new URL('catalog.json', baseURL).href);
  expect(response.ok()).toBe(true);
  const value: unknown = await response.json();
  assertCatalog(value);
  return value;
}

test('Microsoft 365-first identity and aligned community navigation', async ({
  page,
  isMobile,
}) => {
  await page.goto('./');
  await expect(page).toHaveTitle('SPFx Samples | Build for Microsoft 365');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Small building blocks.',
  );
  await expect(page.getByRole('heading', { level: 1 })).not.toContainText(
    'SharePoint',
  );
  await expect(page.locator('.hero-lead')).toHaveText(
    'Copilot, SharePoint, Teams and more.',
  );
  await expect(page.getByRole('button', { name: /^SharePoint/ })).toBeVisible();
  await expect(page.locator('.tile-sharepoint strong')).toHaveText(
    'SharePoint',
  );
  if (isMobile)
    await page.getByLabel('Open navigation', { exact: true }).click();
  const nav = page.getByRole('navigation', {
    name: isMobile ? 'Mobile navigation' : 'Primary navigation',
    exact: true,
  });
  await expect(nav.getByRole('link')).toHaveText([
    'Community',
    'Samples',
    'Getting started',
    'Contributors',
    'Contributing',
    "What's new",
    'GitHub',
  ]);
  await expect(page.locator('#sample-grid [data-card]')).toHaveCount(24);
  const firstPreview = page.locator('#sample-grid [data-card-image]').first();
  await firstPreview.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      firstPreview.evaluate(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('search, meaningful empty state and reset work', async ({ page }) => {
  await page.goto('./');
  await page
    .getByRole('searchbox', { name: 'Search samples', exact: true })
    .fill('zzzx-no-such-community-sample');
  await expect(page.locator('#empty-state')).toBeVisible();
  await expect(page).toHaveURL(/q=zzzx-no-such-community-sample/);
  await expect(page.locator('#sample-grid [data-card]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start fresh' }).click();
  await expect(page.locator('#sample-grid [data-card]')).toHaveCount(24);
  await expect(page.locator('#empty-state')).toBeHidden();
});

test('experience and technology combine, survive reload and browser history', async ({
  page,
  isMobile,
  request,
  baseURL,
}) => {
  const catalog = await publishedCatalog(request, baseURL);
  const expected = catalog.samples.filter(
    (sample) =>
      sample.experiences.includes('Copilot') &&
      sample.technologies.includes('React'),
  ).length;
  await page.goto('./');
  await page.getByRole('button', { name: /^Copilot/ }).click();
  if (isMobile) await page.locator('.filter-drawer > summary').click();
  const react = page.locator('input[data-facet="technologies"][value="React"]');
  await react.check();
  await expect(page).toHaveURL(/experience=Copilot/);
  await expect(page).toHaveURL(/technology=React/);
  await expect(page.locator('#results-count strong')).toHaveText(
    expected.toLocaleString('en'),
  );
  await page.reload();
  await expect(react).toBeChecked();
  await expect(page.getByRole('button', { name: /^Copilot/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page
    .getByRole('button', { name: 'Remove React filter', exact: true })
    .click();
  await expect(page).not.toHaveURL(/technology=React/);
  await page.goBack();
  await expect(react).toBeChecked();
  await expect(page).toHaveURL(/technology=React/);
});

test('pagination and alphabetical sorting are reflected in the URL', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByLabel('Sort by', { exact: true }).selectOption('updated');
  await expect(
    page.locator('#sample-grid [data-card-date]').first(),
  ).toHaveAttribute('title', 'Metadata last updated');
  await page.getByLabel('Sort by', { exact: true }).selectOption('title');
  await expect(page).toHaveURL(/sort=title/);
  const firstTitle = await page.locator('[data-card-link]').first().innerText();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('[data-card-link]').first()).not.toHaveText(
    firstTitle,
  );
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.locator('[data-card-link]').first()).toHaveText(firstTitle);
});

test('saved collection persists and can be emptied without an account', async ({
  page,
}) => {
  await page.goto('./');
  await page.locator('#sample-grid [data-save-id]').first().click();
  await expect(page.locator('#saved-count')).toHaveText('1');
  await page.getByRole('button', { name: /My collection/ }).click();
  await expect(page.locator('#sample-grid [data-card]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#sample-grid [data-card]')).toHaveCount(1);
  await expect(page.locator('#saved-count')).toHaveText('1');
  await page.locator('#sample-grid [data-save-id]').click();
  await expect(page.locator('#saved-count')).toHaveText('0');
  await expect(page.locator('#empty-title')).toHaveText(
    'A little collection. A lot of possibility.',
  );
});

test('theme persists and a generated detail page has working source actions', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('switch', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#sample-grid [data-card-link]').first().click();
  await expect(page).toHaveURL(/\/spfx\/samples\/[^/]+\/$/);
  await expect(
    page.getByRole('heading', { name: 'At a glance', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View on GitHub', exact: true }),
  ).toHaveAttribute('href', /^https:\/\/github\.com\/pnp\//);
  await expect(
    page.getByRole('link', { name: 'Download sample', exact: true }),
  ).toHaveAttribute('href', /^https:\/\/pnp\.github\.io\/download-partial\//);
});

test('failed remote preview recovers to the honest local placeholder', async ({
  page,
}) => {
  await page.route('https://raw.githubusercontent.com/**', (route) =>
    route.request().resourceType() === 'image'
      ? route.abort()
      : route.continue(),
  );
  await page.route('**/spfx/images/previews/**', (route) => route.abort());
  await page.goto('./');
  const image = page.locator('#sample-grid [data-card-image]').first();
  await expect(image).toHaveAttribute(
    'src',
    /\/spfx\/images\/sample-preview-fallback\.png$/,
  );
  await expect(
    page.locator('#sample-grid [data-fallback-label]').first(),
  ).toBeVisible();
  await expect(image).toHaveAttribute('alt', 'Preview unavailable');
});

test('the complete directory works without JavaScript', async ({
  browser,
  baseURL,
  request,
}) => {
  const catalog = await publishedCatalog(request, baseURL);
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}browse/`);
    await expect(
      page.getByRole('heading', { name: 'The whole collection.', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.directory-list a')).toHaveCount(
      catalog.totals.samples,
    );
    await page.locator('.directory-list a').first().click();
    await expect(
      page.getByRole('link', { name: 'View on GitHub', exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test('home meets automated WCAG AA checks in both themes', async ({ page }) => {
  await page.goto('./');
  await expect(
    page.getByRole('searchbox', { name: 'Search samples', exact: true }),
  ).toBeEnabled();
  const light = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(light.violations).toEqual([]);
  await page.getByRole('switch', { name: 'Switch to dark mode' }).click();
  const dark = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(dark.violations).toEqual([]);
});

test('SharePoint discovery and sample details meet automated WCAG AA checks', async ({
  page,
}) => {
  await page.goto('./?experience=SharePoint&technology=React');
  await expect(
    page.getByRole('searchbox', { name: 'Search samples', exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole('button', { name: /^SharePoint/ }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.locator('#sample-grid [data-card-experience]').first(),
  ).toHaveText('SharePoint');
  const filtered = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(filtered.violations).toEqual([]);
  await page.locator('#sample-grid [data-card-link]').first().click();
  const detail = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(detail.violations).toEqual([]);
});

test('filter drawer follows mobile and desktop layout transitions', async ({
  page,
}) => {
  await page.goto('./');
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(page.locator('.filter-drawer')).toHaveJSProperty('open', false);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.filter-drawer')).toHaveJSProperty('open', true);
  await page.setViewportSize({ width: 768, height: 1000 });
  await expect(page.locator('.filter-drawer')).toHaveJSProperty('open', false);
});

test('visible catalog metrics reflect the refreshed data, not fixed counts', async ({
  page,
  request,
  baseURL,
}) => {
  const catalog = await publishedCatalog(request, baseURL);
  await page.goto('./');
  await expect(page.locator('[data-stat="samples"]')).toHaveText(
    catalog.totals.samples.toLocaleString('en'),
  );
  await expect(page.locator('[data-stat="contributors"]')).toHaveText(
    catalog.totals.contributors.toLocaleString('en'),
  );
  await expect(page.locator('[data-stat="sources"]')).toHaveText(
    catalog.sources.length.toLocaleString('en'),
  );
  await expect(page.locator('.catalog-totals')).not.toContainText('100%');
  await expect(page.locator('.hero-proof')).toContainText(
    'Tens of millions of daily active users.',
  );
  await expect(page.locator('.hero-proof [data-stat]')).toHaveCount(0);
  for (const facet of catalog.facets.experiences) {
    await expect(
      page.locator(`button[data-experience="${facet.value}"] .tab-count`),
    ).toHaveText(String(facet.count));
  }
});

test('Connections remains discoverable without a promotional logo', async ({
  page,
  request,
  baseURL,
}) => {
  const catalog = await publishedCatalog(request, baseURL);
  const connections = catalog.facets.experiences.find(
    (facet) => facet.value === 'Connections',
  );
  if (!connections)
    throw new Error('Connections was removed from the experience facets.');
  await page.goto('./?experience=Connections');
  await expect(
    page.getByRole('searchbox', { name: 'Search samples', exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole('button', { name: /^Connections/ }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#results-count strong')).toHaveText(
    connections.count.toLocaleString('en'),
  );
  await expect(
    page.locator('#sample-grid [data-card-experience]').first(),
  ).toHaveText('Connections');
  await expect(page.locator('.hero-art')).not.toContainText('Connections');
  await expect(page.locator('.hero-art .tile-connections')).toHaveCount(0);
  await expect(page.locator('.hero-art .product-logo')).toHaveCount(4);
});

test('official artwork and community invitations are available and accessible', async ({
  page,
}) => {
  await page.goto('./');
  for (const product of ['copilot', 'sharepoint', 'teams', 'power-automate']) {
    const logo = page.locator(`.hero-art img[src$="/brand/${product}.webp"]`);
    await expect(logo).toBeVisible();
    await expect
      .poll(() =>
        logo.evaluate(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await expect(page.locator('.community-ribbon a')).toHaveAttribute(
    'href',
    'https://aka.ms/community/calls',
  );
  await page.goto('./contributing/');
  await expect(page.locator('.recognition-panel')).toHaveCount(1);
  await expect(page.locator('.recognition-panel img')).toHaveAttribute(
    'src',
    /\/images\/brand\/contributor-badge\.webp$/,
  );
  await expect
    .poll(() =>
      page
        .locator('.recognition-panel img')
        .evaluate(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await expect(page.locator('.recognition-panel .button')).toHaveAttribute(
    'href',
    'https://pnp.github.io/recognitionprogram/',
  );
  await expect(page.locator('#present-a-demo')).toContainText('availability');
  await expect(page.locator('#present-a-demo .guide-link')).toHaveAttribute(
    'href',
    'https://aka.ms/community/request/demo',
  );
  await expect(page.locator('#community-calls .guide-link')).toHaveAttribute(
    'href',
    'https://aka.ms/community/calls',
  );
  const contributing = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(contributing.violations).toEqual([]);
  await page.goto('./contributors/');
  await expect(page.locator('.recognition-panel')).toHaveCount(1);
  await expect(page.locator('.recognition-panel img')).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('.recognition-panel img')
        .evaluate(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
    )
    .toBe(true);
});
