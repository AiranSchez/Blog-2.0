import { expect, test } from '@playwright/test';

const locales = ['es', 'en', 'ja'] as const;

for (const locale of locales) {
  test(`${locale} home has one main heading and the agreed content order`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText('Airán Sánchez');
    const sections = await page.locator('main section').evaluateAll(elements => elements.map(element => element.id));
    expect(sections).toEqual(['perfil', 'practica', 'sobre-mi', 'work', 'escritura', 'escucha', 'trayectoria', 'testimonio', 'actividad', 'contact']);
    await expect(page.locator('footer a[href="/' + locale + '/podcast/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/' + locale + '/blog/"]')).toBeVisible();
  });

  test(`${locale} home shows real latest article, episodes and experience`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('.article-preview h3')).not.toBeEmpty();
    await expect(page.locator('.episode')).toHaveCount(8);
    await expect(page.locator('.career li')).toHaveCount(6);
    await expect(page.locator('.career__when span').first()).not.toBeEmpty();
    await expect(page.locator('[data-testimonial]')).toHaveCount(1);
    await expect(page.locator('main')).not.toContainText('Añade una recomendación');
  });
}

test('the featured project recording is real, muted and autoplays', async ({ page }) => {
  await page.goto('/es/');
  const video = page.locator('#work video');
  await expect(video).toHaveAttribute('poster', '/kinetic/project-showcase-poster.png');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('muted', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).not.toHaveAttribute('controls');
  await expect(video.locator('source')).toHaveAttribute('src', '/kinetic/project-showcase.mp4');
});

test('the opening leads to the JaponesApp case', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('#work article').filter({ hasText: 'JaponesApp' })).toHaveCount(1);
  await expect(page.locator('#perfil a[href="#work"]')).toBeVisible();
  await expect(page.locator('#work a[href="/es/projects/japonesapp/"]').first()).toBeVisible();
});

test('profile and project remain readable without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/es/');
  await expect(page.locator('main h1')).toContainText('Airán Sánchez');
  await expect(page.locator('#work article').filter({ hasText: 'JaponesApp' })).toHaveCount(1);
  await expect(page.locator('#contact-form')).toBeVisible();
  await context.close();
});

for (const theme of ['light', 'dark'] as const) {
  for (const width of [320, 375, 414, 768, 1280]) {
    test(`${theme} kinetic home fits ${width}px in all languages`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      for (const locale of locales) {
        await page.goto(`/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        const clipped = await page.locator('main h1, main h2, main h3, .btn, .footer__links a, #contact input:not([type="hidden"]), #contact textarea').evaluateAll(elements => elements.filter(element => {
          if (element.closest('.rail, .carousel, .drawer')) return false;
          const bounds = element.getBoundingClientRect();
          return bounds.left < -1 || bounds.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.textContent?.trim() || element.id));
        expect(clipped, `${locale} at ${width}`).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        expect(overflow).toBe(false);
        if (width <= 414) {
          const action = await page.locator('#perfil a[href="#work"]').boundingBox();
          expect(action!.y + action!.height).toBeLessThan(812);
        }
      }
    });
  }
}

test('mobile navigation keeps theme, language and destinations available', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/es/');
  await expect(page.locator('.lang-switch--header')).toBeVisible();
  await page.locator('[data-menu-open]').click();
  await expect(page.locator('.drawer')).toBeVisible();
  await expect(page.locator('.drawer__nav a[href="#work"]')).toBeVisible();
  await expect(page.locator('.drawer__nav a[href="/es/cv/"]')).toBeVisible();
  await page.locator('.drawer .theme-menu summary').click();
  await page.locator('.drawer [data-theme-set="dark"]').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('language switch keeps the home route', async ({ page }) => {
  await page.goto('/es/');
  await page.locator('.lang-switch--header a[href="/en/"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} shared system preserves blog, CV and podcast`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 812 });
      for (const locale of locales) {
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
