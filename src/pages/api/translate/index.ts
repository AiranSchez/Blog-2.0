/**
 * API Route: POST /api/translate
 * Proxies translation requests to LibreTranslate.
 * Keeps the API key server-side — never exposed to browser.
 * Returns { translated_text } on success, { error: 'unavailable' } on failure.
 */
import type { APIRoute } from 'astro';
import { translateComment } from '../../../server/translation/libretranslate';
import type { TranslateBody } from '../../../types/comments';

export const prerender = false;

const SUPPORTED_LANGS = ['en', 'es', 'ja'];

export const POST: APIRoute = async ({ request }) => {
  let body: TranslateBody;

  try {
    body = await request.json() as TranslateBody;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Expected object');
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

  return Response.json(await translateComment(
    body, import.meta.env.LIBRETRANSLATE_URL, import.meta.env.LIBRETRANSLATE_API_KEY,
  ));
};
