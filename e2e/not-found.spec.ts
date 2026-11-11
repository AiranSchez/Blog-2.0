import { expect, test } from '@playwright/test';

const pages = [
  { path: '/404', lang: 'en', heading: 'NOTHING HERE.', nav: 'Work', home: '/en/' },
  { path: '/en/404/', lang: 'en', heading: 'NOTHING HERE.', nav: 'Work', home: '/en/' },
  { path: '/es/404/', lang: 'es', heading: 'NO HAY NADA AQUÍ.', nav: 'Trabajo', home: '/es/' },
  { path: '/ja/404/', lang: 'ja', heading: 'ここには何もありません。', nav: '仕事', home: '/ja/' },
] as const;

for (const { path, lang, heading, nav, home } of pages) {
  test(`${path} uses the current shell and real destinations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText(heading);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.nav a').first()).toHaveText(nav);
    await expect(page.locator('main a[href="' + home + '"]')).toBeVisible();
    await expect(page.locator('main a[href="/' + lang + '/blog/"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
}

for (const width of [320, 375, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme} 404 fits ${width}px in every language`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      for (const { path } of pages) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
        const title = await page.locator('main h1').boundingBox();
        expect(title!.x).toBeGreaterThanOrEqual(0);
        expect(title!.x + title!.width).toBeLessThanOrEqual(width);
      }
    });
  }
}
