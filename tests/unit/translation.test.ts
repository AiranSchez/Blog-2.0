import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translateComment } from '../../src/server/translation/libretranslate';
const body = { text: 'Hola', source_lang: 'es', target_lang: 'en' };

test('unconfigured translation does not contact a provider', async () => {
  assert.deepEqual(await translateComment(body, undefined, undefined, (() => { throw new Error('unexpected IO'); }) as typeof fetch), { error: 'unavailable' });
});
test('translation maps the provider response and keeps its key server-side', async () => {
  const transport = (async (url: unknown, init?: RequestInit) => {
    assert.equal(url, 'https://translation.invalid/translate');
    assert.deepEqual(JSON.parse(String(init?.body)), { q: 'Hola', source: 'es', target: 'en', format: 'text', api_key: 'test-only' });
    return Response.json({ translatedText: 'Hello' });
  }) as typeof fetch;
  assert.deepEqual(await translateComment(body, 'https://translation.invalid', 'test-only', transport), { translated_text: 'Hello' });
});
test('provider failures become unavailable without leaking details', async () => {
  for (const transport of [async () => new Response('', { status: 503 }), async () => { throw new Error('offline'); }]) {
    assert.deepEqual(await translateComment(body, 'https://translation.invalid', undefined, transport as typeof fetch), { error: 'unavailable' });
  }
});
