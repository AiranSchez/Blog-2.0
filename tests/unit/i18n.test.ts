import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLangFromUrl, getLocaleFromPath, useTranslations, SUPPORTED_LOCALES } from '../../src/services/i18n';
import { ui } from '../../src/i18n/translations';

test('shared translations cover the same keys in all languages', () => {
  for (const locale of SUPPORTED_LOCALES) {
    assert.deepEqual(Object.keys(ui[locale]).sort(), Object.keys(ui.en).sort());
    assert.ok(useTranslations(locale)('contact.success'));
    assert.equal(getLangFromUrl(new URL(`https://example.invalid/${locale}/blog/`)), locale);
    assert.equal(getLocaleFromPath(`/${locale}/blog/`), locale);
  }
  assert.equal(getLangFromUrl(new URL('https://example.invalid/fr/')), 'en');
});
