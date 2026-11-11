import { expect, test } from '@playwright/test';

const locales = [
  { locale: 'es', projects: 'Proyectos' },
  { locale: 'en', projects: 'Projects' },
  { locale: 'ja', projects: 'プロジェクト' },
] as const;

for (const { locale } of locales) {
  test(`${locale} connects the real project from home`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const card = page.locator('#work article').filter({ hasText: 'JaponesApp' });
    await expect(card).toHaveCount(1);
    await card.getByRole('link').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/japonesapp/`));
    await expect(page.getByRole('heading', { name: 'JaponesApp', exact: true })).toBeVisible();
    const video = page.locator('video');
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('preload', 'metadata');
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(video.locator('source')).toHaveAttribute('src', '/kinetic/project-showcase.mp4');
    await page.locator('main a[href="/' + locale + '/projects/"]').first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/`));
    await expect(page.locator('main article')).toHaveCount(1);
    await expect(page.locator('main article')).toContainText('JaponesApp');
  });

  test(`${locale} presents the actual project without a quiz`, async ({ page }) => {
    await page.goto(`/${locale}/projects/japonesapp/`);
    await expect(page.locator('[data-kanji-challenge], #experiment')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/miniquiz|browser experiment|ウェブ実験/);
    await expect(page.locator('main a[href="#recording"]')).toBeVisible();
  });
}

test('the project remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/es/projects/japonesapp/');
  await expect(page.getByRole('heading', { name: 'JaponesApp', exact: true })).toBeVisible();
  await expect(page.locator('video')).toBeVisible();
  await expect(page.locator('[data-kanji-challenge]')).toHaveCount(0);
  await context.close();
});

test('media is local, has a poster, and plays only on request', async ({ page, request }) => {
  await page.goto('/es/projects/japonesapp/');
  const video = page.locator('video');
  await expect(video).toHaveAttribute('poster', '/kinetic/project-showcase-poster.png');
  const response = await request.get('/kinetic/project-showcase.mp4');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('video/mp4');
  expect((await response.body()).byteLength).toBeLessThan(1_000_000);
  const poster = await request.get('/kinetic/project-showcase-poster.png');
  expect(poster.status()).toBe(200);
  expect(poster.headers()['content-type']).toContain('image/png');
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
});

test('project routes keep their translation when switching language', async ({ page }) => {
  await page.goto('/es/projects/japonesapp/');
  await page.locator('.lang-switch--header a[href="/ja/projects/japonesapp/"]').click();
  await expect(page).toHaveURL(/\/ja\/projects\/japonesapp\//);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});

for (const width of [320, 375, 414, 768, 1280]) {
  test(`new project surfaces fit ${width}px in every language`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const { locale } of locales) {
      for (const path of ['', 'projects/', 'projects/japonesapp/']) {
        await page.goto(`/${locale}/${path}`);
        const overflowing = await page.locator('.page-hero, .project-index, .case-layout, .stack, .timeline, .footer').evaluateAll(elements => elements.filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.left < -1 || bounds.right > window.innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.className));
        expect(overflowing, `${locale}/${path} at ${width}px`).toEqual([]);
      }
    }
  });
}

test('the featured home recording is the real Kyoto-style navigation and autoplays muted', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/es/');
  const video = page.locator('#work video');
  await expect(video).toHaveAttribute('poster', '/kinetic/project-showcase-poster.png');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('muted', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).not.toHaveAttribute('controls');
  await expect(video.locator('source')).toHaveAttribute('src', '/kinetic/project-showcase.mp4');
});
