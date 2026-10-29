import { expect, test } from '@playwright/test';

for (const locale of ['es', 'en', 'ja']) {
  test(`${locale} home has one main heading and the agreed content order`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText('Airán Sánchez');
    const sections = await page.locator('main > section').evaluateAll(elements => elements.map(element => element.id || element.getAttribute('aria-labelledby')));
    expect(sections).toEqual(['intro', 'work', 'about', 'experience', 'testimonials-heading', 'activity', 'contact']);
    await expect(page.locator('footer a[href="/' + locale + '/podcast/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/' + locale + '/blog/"]')).toBeVisible();
  });
}

test('GitHub ranges synchronize statistics and charts without moving the page', async ({ page }) => {
  await page.goto('/en/');
  const root = page.locator('[data-activity]');
  const snapshot = JSON.parse((await root.getAttribute('data-snapshot'))!);
  await expect(root.locator('[data-calendar] button')).toHaveCount(90);
  await root.locator('[data-range="year"]').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await root.locator('[data-range="year"]').click();
  await expect(root.locator('[data-calendar] button')).toHaveCount(snapshot.days.length);
  await expect(root.locator('[data-stat="total"]')).toHaveText(new Intl.NumberFormat('en').format(snapshot.total));
  expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThan(4);
  await root.locator('summary').click();
  const total = await root.locator('[data-month-chart] strong').allTextContents();
  expect(total.reduce((sum, value) => sum + Number(value.replaceAll(',', '')), 0)).toBe(snapshot.total);
  await root.locator('[data-range="90"]').click();
  await expect(root.locator('[data-calendar] button')).toHaveCount(90);
});

test('calendar days expose their date on touch and support keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/');
  const root = page.locator('[data-activity]');
  const cells = root.locator('[data-calendar] button');
  await cells.first().click();
  await expect(root.locator('[data-day-detail]')).toHaveText((await cells.first().getAttribute('aria-label'))!);
  await page.keyboard.press('ArrowRight');
  await expect(cells.nth(7)).toBeFocused();
  await expect(root.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(root.getByRole('tooltip')).toBeHidden();
});

test('profile, GitHub evidence and project remain readable without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/es/');
  await expect(page.locator('main h1')).toContainText('Airán Sánchez');
  await expect(page.locator('[data-stat="total"]')).toBeVisible();
  await expect(page.locator('[data-activity-controls]')).toBeHidden();
  await expect(page.locator('#work article')).toContainText('JaponesApp');
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const width of [320, 375, 414, 768, 1280]) {
    test(`${theme} mobile-first content and controls fit ${width}px in all languages`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      for (const locale of ['es', 'en', 'ja']) {
        await page.goto(`/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        const clipped = await page.locator('main h1, main h2, main h3, .portfolio-action, footer nav a, #contact input:not([type="hidden"]), #contact textarea').evaluateAll(elements => elements.filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.left < -1 || bounds.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.textContent?.trim() || element.id));
        expect(clipped, `${locale} at ${width}`).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        expect(overflow).toBe(false);
        if (width <= 414) {
          const action = await page.locator('#intro a[href="#work"]').boundingBox();
          expect(action!.y + action!.height).toBeLessThan(812);
        }
      }
    });
  }
}

test.describe('touch selection', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 812 } });
  test('a calendar day can be selected without hover', async ({ page }) => {
    await page.goto('/es/');
    const first = page.locator('[data-calendar] button').first();
    await first.tap();
    await expect(page.locator('[data-day-detail]')).toHaveText((await first.getAttribute('aria-label'))!);
  });
});


test('hover details are delayed and cancelled when the pointer leaves', async ({ page }) => {
  await page.goto('/en/');
  const first = page.locator('[data-calendar] button').first();
  const tooltip = page.locator('#activity-tooltip');
  await first.hover();
  await expect(tooltip).toBeHidden();
  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
  await first.hover();
  await expect(tooltip).toBeVisible({ timeout: 2500 });
  await expect(tooltip).toHaveText((await first.getAttribute('aria-label'))!);
  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
});

test('Japanese copy keeps web and team terms together on phones', async ({ page }) => {
  for (const width of [320, 375, 414]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/ja/');
    await page.evaluate(() => document.fonts.ready);
    for (const [selector, label] of [['.profile-position', 'ウェブ'], ['.profile-summary', 'チーム']]) {
      const lines = await page.locator(selector).evaluate((element, label) => {
        const text = element.firstChild!;
        const start = text.textContent!.indexOf(label);
        const word = document.createRange();
        word.setStart(text, start);
        word.setEnd(text, start + label.length);
        return word.getClientRects().length;
      }, label);
      expect(lines, `${label} at ${width}px`).toBe(1);
    }
  }
});


test('the opening leads to a real project instead of a generic stack list', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/es/');
  await expect(page.locator('#intro .profile-practice')).toHaveCount(0);
  const hero = await page.locator('#intro').boundingBox();
  expect(hero!.height).toBeLessThan(720);
  await expect(page.locator('#work video')).toHaveAttribute('preload', 'none');
  await expect(page.locator('#work video')).not.toHaveAttribute('autoplay');
});

test('mobile navigation keeps theme, language and destinations immediately available', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/es/');
  await expect(page.locator('.language-menu summary')).toBeVisible();
  await page.getByRole('button', { name: 'Cambiar tema', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('summary[aria-label="Abrir navegación"]').press('Enter');
  await expect(page.locator('.site-menu__panel').getByRole('link', { name: 'Proyectos', exact: true })).toBeVisible();
  await expect(page.locator('.site-menu__panel').getByRole('link', { name: 'CV', exact: true })).toBeVisible();
});

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} shared system preserves blog, CV and podcast at phone and desktop widths`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 812 });
      for (const locale of ['es', 'en', 'ja']) {
        for (const path of ['blog/', 'cv/', 'podcast/']) {
          const response = await page.goto(`/${locale}/${path}`);
          expect(response!.status()).toBe(200);
          await expect(page.locator('main h1')).toHaveCount(1);
          expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
        }
      }
    }
  });
}
