import { test, expect } from '@playwright/test';
import legacy from '../src/data/blog-legacy-routes.json' with { type: 'json' };

test('every historical URL redirects once to its canonical article', async ({ request }) => {
  for (const route of legacy) {
    if (route.oldPath === route.newPath) continue;
    const response = await request.get(encodeURI(route.oldPath), { maxRedirects: 0 });
    expect(response.status(), route.oldPath).toBe(301);
    expect(new URL(response.headers().location, response.url()).pathname).toBe(route.newPath);
    const canonical = await request.get(route.newPath, { maxRedirects: 0 });
    expect(canonical.status(), route.newPath).toBe(200);
  }
});

for (const locale of ['en', 'es', 'ja']) {
  test(`${locale} canonical article retains comments and valid language links`, async ({ page }) => {
    const article = legacy.find(route => route.newPath.startsWith(`/${locale}/`) && route.newPath.includes('csrf'))!;
    let requestedKey: string | null = null;
    await page.route('**/api/comments?*', route => {
      requestedKey = new URL(route.request().url()).searchParams.get('slug');
      return route.fulfill({ json: { comments: [], total: 0 } });
    });
    await page.goto(article.newPath);
    await expect.poll(() => requestedKey).toBe(article.commentKey);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://airanschez.tech${article.newPath}`);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
    for (const lang of ['en', 'es', 'ja']) {
      const link = page.locator(`.language-menu__panel a[hreflang="${lang}"]`);
      const href = await link.getAttribute('href');
      expect(legacy.some(route => route.newPath === href)).toBeTruthy();
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute('href', `https://airanschez.tech${href}`);
    }
  });

  test(`${locale} archive links only to canonical articles`, async ({ page }) => {
    await page.goto(`/${locale}/blog/`);
    const links = await page.locator('main a[href*="/blog/"]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')));
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) expect(legacy.some(route => route.newPath === href), String(href)).toBeTruthy();
  });
}
