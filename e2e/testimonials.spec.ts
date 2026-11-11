import { expect, test } from '@playwright/test';

const locales = [
  { locale: 'en', close: 'Close', ending: 'all the knowledge I know he has to offer.' },
  { locale: 'es', close: 'Cerrar', ending: 'todo el conocimiento que sé que me va a ofrecer.' },
  { locale: 'ja', close: '閉じる', ending: '学び続けたいと心から思います。' },
] as const;

for (const { locale, ending } of locales) {
  test(`${locale} home shows the real recommendation, not placeholders`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const card = page.locator('[data-testimonial]');
    await expect(card).toHaveCount(1);
    await expect(card).toContainText('Michael Reyes');
    await expect(page.locator('main')).not.toContainText('Añade una recomendación');
    await card.locator('summary').click();
    await expect(card.locator('.testimonial__full blockquote')).toContainText(ending);
    await expect(card.locator('.testimonial__full')).toBeVisible();
  });
}
