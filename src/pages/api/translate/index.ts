/**
 * API Route: POST /api/translate
 * Proxies translation requests to LibreTranslate.
 * Keeps the API key server-side — never exposed to browser.
 * Returns { translated_text } on success, { error: 'unavailable' } on failure.
 */
import type { APIRoute } from 'astro';
import type { TranslateBody } from '../../../types/comments';

export const prerender = false;

const SUPPORTED_LANGS = ['en', 'es', 'ja'];

export const POST: APIRoute = async ({ request }) => {
  let body: TranslateBody;

  try {
    body = await request.json() as TranslateBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { text, source_lang, target_lang } = body;

  if (!text || typeof text !== 'string') {
    return Response.json({ error: 'Missing text' }, { status: 400 });
  }
  if (text.length > 2000) {
    return Response.json({ error: 'Text too long' }, { status: 400 });
  }
  if (!SUPPORTED_LANGS.includes(target_lang)) {
    return Response.json({ error: 'Unsupported target language' }, { status: 400 });
  }

  const libreTranslateUrl = import.meta.env.LIBRETRANSLATE_URL as string;
  const apiKey = import.meta.env.LIBRETRANSLATE_API_KEY as string | undefined;

  if (!libreTranslateUrl) {
    return Response.json({ error: 'unavailable' }, { status: 200 });
  }

  try {
    const libreResponse = await fetch(`${libreTranslateUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: source_lang ?? 'auto',
        target: target_lang,
        format: 'text',
        ...(apiKey ? { api_key: apiKey } : {}),
      }),
    });

    if (!libreResponse.ok) {
      console.warn('[POST /api/translate] LibreTranslate error:', libreResponse.status);
      return Response.json({ error: 'unavailable' }, { status: 200 });
    }

    const result = await libreResponse.json() as { translatedText?: string };
    return Response.json({ translated_text: result.translatedText ?? '' }, { status: 200 });
  } catch (err) {
    console.warn('[POST /api/translate] Network error:', err);
    return Response.json({ error: 'unavailable' }, { status: 200 });
  }
};
