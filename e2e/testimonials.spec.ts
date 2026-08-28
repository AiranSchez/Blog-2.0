import { expect, test } from '@playwright/test';

const locales = [
  {
    locale: 'en',
    readMore: 'Read more',
    close: 'Close testimonial',
    ending: 'all the knowledge I know he has to offer.',
  },
  {
    locale: 'es',
    readMore: 'Leer más',
    close: 'Cerrar testimonio',
    ending: 'todo el conocimiento que sé que me va a ofrecer.',
  },
  {
    locale: 'ja',
    readMore: '続きを読む',
    close: '推薦文を閉じる',
    ending: '学び続けたいと心から思います。',
  },
] as const;

test.describe('localized testimonials', () => {
  test.describe.configure({ mode: 'serial' });

  test('keeps a single review at one-column width on desktop', async ({ page }) => {
    await page.goto('/en/#testimonials');

    const card = page.locator('.testimonial-card').first();
    const cardBounds = await card.boundingBox();
    const viewportWidth = page.viewportSize()?.width;

    expect(cardBounds).not.toBeNull();
    expect(viewportWidth).toBeDefined();
    expect(cardBounds!.width).toBeLessThan(viewportWidth! / 2);
  });

  for (const { locale, readMore, close, ending } of locales) {
    test(`${locale} shows a shortened testimonial and opens the full review`, async ({ page }) => {
      await page.goto(`/${locale}/#testimonials`);

      await expect(page.locator('.testimonial-card')).toHaveCount(1);
      const card = page.locator('.testimonial-card:not(.is-placeholder)').first();
      await expect(card.getByRole('link', { name: 'Michael Reyes' })).toBeVisible();

      const preview = card.locator('.testimonial-card__quote blockquote');
      await expect(preview).toContainText('...');
      await expect(preview).not.toContainText(ending);

      await card.getByRole('button', { name: readMore }).click();

      const dialog = page.getByRole('dialog', { name: 'Michael Reyes' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText(ending);

      await dialog.getByRole('button', { name: close }).click();
      await expect(dialog).not.toBeVisible();
    });
  }
});
