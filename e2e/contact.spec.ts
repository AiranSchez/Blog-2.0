import { test, expect, type Page } from '@playwright/test';

const CONTACT_URL = '/en/#contact';
const API_URL = 'https://api.web3forms.com/submit';
const draft = { name: 'Test User', email: 'test@example.com', message: 'Hello from Playwright' };

async function fillForm(page: Page) {
  await page.fill('#contact-name', draft.name);
  await page.fill('#contact-email', draft.email);
  await page.fill('#contact-message', draft.message);
}

async function expectStatus(page: Page, kind: 'success' | 'error') {
  const message = await page.locator('#contact-form').getAttribute(`data-${kind}`);
  expect(message).toBeTruthy();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(message!);
}

test.describe('ContactSection', () => {
  test.beforeEach(async ({ page }) => {
    // Safe default: no test can accidentally send a real contact message.
    await page.route(API_URL, route => route.abort());
    await page.goto(CONTACT_URL);
    await expect(page.locator('#contact-form')).toBeVisible();
  });

  test('shows success and resets every field after submission', async ({ page }) => {
    await page.route(API_URL, route => route.fulfill({ json: { success: true } }));
    await fillForm(page);
    await page.click('#submit-button');
    await expectStatus(page, 'success');
    for (const field of ['name', 'email', 'message']) {
      await expect(page.locator(`#contact-${field}`)).toHaveValue('');
    }
  });

  test('updates character count while typing and resets it on success', async ({ page }) => {
    await page.route(API_URL, route => route.fulfill({ json: { success: true } }));
    await fillForm(page);
    const count = page.locator('#char-count-contact-message');
    await expect(count).toHaveText(String(draft.message.length));
    await expect(page.locator('#contact-message')).toHaveAttribute('maxlength', '1000');
    await page.click('#submit-button');
    await expectStatus(page, 'success');
    await expect(count).toHaveText('0');
  });

  for (const failure of ['network', 'api'] as const) {
    test(`shows error and preserves the draft after ${failure} failure`, async ({ page }) => {
      await page.route(API_URL, route => failure === 'network'
        ? route.abort('failed')
        : route.fulfill({ status: 422, json: { success: false, message: 'Invalid key' } }));
      await fillForm(page);
      await page.click('#submit-button');
      await expectStatus(page, 'error');
      for (const field of ['name', 'email', 'message'] as const) {
        await expect(page.locator(`#contact-${field}`)).toHaveValue(draft[field]);
      }
      await expect(page.locator('#submit-button')).toBeEnabled();
      await expect(page.locator('#submit-button')).not.toHaveAttribute('aria-busy');
    });
  }

  test('disables submit until the response completes', async ({ page }) => {
    let release!: () => void;
    const responseReady = new Promise<void>(resolve => { release = resolve; });
    await page.route(API_URL, async route => {
      await responseReady;
      await route.fulfill({ json: { success: true } });
    });
    await fillForm(page);
    const button = page.locator('#submit-button');
    const originalText = await button.textContent();
    await button.click();
    try {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute('aria-busy', 'true');
    } finally {
      release();
    }
    await expectStatus(page, 'success');
    await expect(button).toBeEnabled();
    await expect(button).not.toHaveAttribute('aria-busy');
    await expect(button).toHaveText(originalText!);
  });

  test('warns before leaving an edited draft', async ({ page }) => {
    await page.locator('#contact-name').click();
    await page.locator('#contact-name').pressSequentially('Draft name');
    const dialog = page.waitForEvent('dialog');
    const navigation = page.reload();
    const warning = await dialog;
    expect(warning.type()).toBe('beforeunload');
    await warning.accept();
    await navigation;
  });
});

for (const locale of ['en', 'es', 'ja']) {
  test(`contact confirmation uses the ${locale} translation`, async ({ page }) => {
    await page.route(API_URL, route => route.fulfill({ json: { success: true } }));
    await page.goto(`/${locale}/#contact`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await fillForm(page);
    await page.click('#submit-button');
    await expectStatus(page, 'success');
  });
}
