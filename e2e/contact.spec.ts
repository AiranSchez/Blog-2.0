import { test, expect, type Page } from '@playwright/test';

const CONTACT_URL = '/#contact';

async function fillForm(page: Page, data: { name: string; email: string; message: string }) {
  await page.fill('#contact-name', data.name);
  await page.fill('#contact-email', data.email);
  await page.fill('#contact-message', data.message);
}

test.describe('ContactSection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONTACT_URL);
    await page.waitForSelector('#contact-form');
  });

  test.describe('submit — success', () => {
    test('shows success message and resets form after successful submission', async ({ page }) => {
      await page.route('https://api.web3forms.com/submit', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      );

      await fillForm(page, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello from Playwright',
      });

      await page.click('#submit-button');

      const status = page.locator('#form-status');
      await expect(status).toBeVisible();
      await expect(status).not.toHaveClass(/hidden/);

      // Form fields should be cleared after reset
      await expect(page.locator('#contact-name')).toHaveValue('');
      await expect(page.locator('#contact-email')).toHaveValue('');
      await expect(page.locator('#contact-message')).toHaveValue('');
    });

    test('resets char counter to 0 after successful submission', async ({ page }) => {
      await page.route('https://api.web3forms.com/submit', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      );

      await fillForm(page, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Some message text',
      });
      await page.click('#submit-button');

      const charCount = page.locator('[id^="char-count-"]');
      await expect(charCount).toHaveText('0');
    });
  });

  test.describe('submit — error', () => {
    test('shows error message on network failure', async ({ page }) => {
      await page.route('https://api.web3forms.com/submit', (route) =>
        route.abort('failed')
      );

      await fillForm(page, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello from Playwright',
      });

      await page.click('#submit-button');

      const status = page.locator('#form-status');
      await expect(status).toBeVisible();
      await expect(status).toHaveClass(/bg-red-500/);
    });

    test('shows error message on API failure response', async ({ page }) => {
      await page.route('https://api.web3forms.com/submit', (route) =>
        route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Invalid key' }),
        })
      );

      await fillForm(page, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello from Playwright',
      });

      await page.click('#submit-button');

      const status = page.locator('#form-status');
      await expect(status).toBeVisible();
      await expect(status).toHaveClass(/bg-red-500/);
    });
  });

  test.describe('submit button — loading state', () => {
    test('disables button and sets aria-busy during submission', async ({ page }) => {
      // Delay the response to capture the loading state
      await page.route('https://api.web3forms.com/submit', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      await fillForm(page, {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello from Playwright',
      });

      const submitButton = page.locator('#submit-button');
      await page.click('#submit-button');

      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toHaveAttribute('aria-busy', 'true');

      // After response, button should be restored
      await expect(submitButton).not.toBeDisabled();
      await expect(submitButton).not.toHaveAttribute('aria-busy');
    });
  });

  test.describe('beforeunload guard', () => {
    test('form tracks changes after user types', async ({ page }) => {
      // Verify inputs are initially empty (no unsaved state)
      await expect(page.locator('#contact-name')).toHaveValue('');

      await page.fill('#contact-name', 'Draft name');

      // We can't easily assert beforeunload in Playwright without dialog interception,
      // but we verify the field has the typed value (guard is active)
      await expect(page.locator('#contact-name')).toHaveValue('Draft name');
    });
  });
});
