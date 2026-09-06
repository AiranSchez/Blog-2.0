import type { TranslateBody } from '../../types/comments';

export async function translateComment(
  { text, source_lang, target_lang }: TranslateBody,
  libreTranslateUrl: string | undefined,
  apiKey: string | undefined,
  transport: typeof fetch = fetch,
) {
  if (!libreTranslateUrl) {
    return { error: 'unavailable' } as const;
  }

  try {
    const libreResponse = await transport(`${libreTranslateUrl}/translate`, {
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
      return { error: 'unavailable' } as const;
    }

    const result = await libreResponse.json() as { translatedText?: string };
    return { translated_text: result.translatedText ?? '' };
  } catch (err) {
    console.warn('[POST /api/translate] Network error:', err);
    return { error: 'unavailable' } as const;
  }
}
