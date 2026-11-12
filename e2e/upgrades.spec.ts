import { expect, test } from '@playwright/test';

for (const locale of ['es', 'en', 'ja']) {
  test(`${locale} publishes an RSS feed with real articles`, async ({ request }) => {
    const response = await request.get(`/${locale}/blog/feed.xml`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/rss+xml');
    const body = await response.text();
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain(`https://airanschez.tech/${locale}/blog/`);
    expect(body.match(/<item>/g)?.length).toBeGreaterThan(5);
  });

  test(`${locale} legal pages use the current shell`, async ({ page }) => {
    for (const path of ['privacy', 'legal', 'accessibility']) {
      const response = await page.goto(`/${locale}/${path}/`);
      expect(response!.status()).toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('.header')).toBeVisible();
      await expect(page.locator('.footer__legal a[href="/${locale}/privacy/"]'.replace('${locale}', locale))).toHaveAttribute('href', `/${locale}/privacy/`);
    }
  });
}

test('theme menu switches system, light, dark and high contrast', async ({ page }) => {
  await page.goto('/es/');
  const menu = page.locator('.header .theme-menu');
  await menu.locator('summary').click();
  await menu.locator('[data-theme-set="contrast"]').click();
  await expect(page.locator('html')).toHaveClass(/contrast/);
  await menu.locator('summary').click();
  await menu.locator('[data-theme-set="dark"]').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).not.toHaveClass(/contrast/);
  await menu.locator('summary').click();
  await menu.locator('[data-theme-set="auto"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'auto');
});

test('command palette filters destinations and keeps keyboard access', async ({ page }) => {
  await page.goto('/es/');
  await page.keyboard.press('Control+k');
  const palette = page.locator('[data-palette]');
  await expect(palette).toBeVisible();
  await palette.locator('[data-palette-input]').fill('podcast');
  await expect(palette.locator('[data-palette-link]:visible')).toHaveCount(1);
  await expect(palette.locator('[data-palette-link]:visible')).toContainText('Podcast');
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});

test('home exposes capabilities, activity and about without inventing data', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('#sobre-mi')).toBeVisible();
  await expect(page.locator('#sobre-mi .about-index li')).toHaveCount(9);
  await expect(page.locator('#sobre-mi .profile-card')).toBeVisible();
  await expect(page.locator('.capability-list li')).toHaveCount(5);
  await expect(page.locator('.activity-chart svg')).toBeVisible();
  await expect(page.locator('.profile-card__langs li')).toHaveCount(3);
});

test('CV includes capabilities and language sections linked from the index', async ({ page }) => {
  await page.goto('/es/cv/');
  await expect(page.locator('#capacidades')).toBeVisible();
  await expect(page.locator('.dossier-index a[href="#capacidades"]')).toBeVisible();
  await expect(page.locator('#capacidades .skills li')).toHaveCount(5);
  await expect(page.locator('#idiomas .language-list li')).toHaveCount(3);
  await expect(page.locator('#idiomas')).toContainText('N4 certificado');
});

test('blog shows reading time, categories and related posts', async ({ page }) => {
  await page.goto('/es/blog/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.locator('.index-filter__tab')).toHaveCount(4);
  await expect(page.locator('.article-lead__copy .meta')).toContainText('min de lectura');
  const before = await page.locator('.article-card:visible').count();
  await page.locator('.index-filter__tab').filter({ hasText: 'Datos' }).click();
  await expect(page.locator('.article-card:visible')).not.toHaveCount(before);
  await page.goto('/es/blog/csrf-xss-cors/');
  await expect(page.locator('.related')).toBeVisible();
});

test('case gallery opens a lightbox and closes with Escape', async ({ page }) => {
  await page.goto('/es/projects/japonesapp/');
  const gallery = page.locator('.case-gallery button').first();
  await gallery.click();
  const lightbox = page.locator('[data-lightbox]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator('img')).toHaveAttribute('src', '/kinetic/rail-modes.png');
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(page.locator('[data-share-copy]')).toBeVisible();
});

for (const width of [320, 375, 1280]) {
  test(`new sections fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    for (const path of ['/es/', '/es/cv/', '/es/privacy/', '/es/blog/', '/es/projects/japonesapp/']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), path).toBe(false);
    }
  });
}
