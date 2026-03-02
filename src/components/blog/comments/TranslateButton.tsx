/**
 * TranslateButton — toggles between original and translated comment text
 * Only renders if source language differs from target (user's browser language)
 */
import { useState } from 'react';

interface TranslateButtonProps {
  commentId: string;
  content: string;
  sourceLang: string;
  targetLang: string;
  translations: {
    translate: string;
    showOriginal: string;
    translating: string;
    translateError: string;
  };
  onTranslated: (translated: string | null) => void;
}

export default function TranslateButton({
  commentId,
  content,
  sourceLang,
  targetLang,
  translations: t,
  onTranslated,
}: TranslateButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'translated' | 'error'>('idle');

  // Don't render if same language
  if (sourceLang === targetLang) return null;

  const handleClick = async () => {
    if (state === 'translated') {
      setState('idle');
      onTranslated(null);
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, source_lang: sourceLang, target_lang: targetLang }),
      });
      const data = await res.json() as { translated_text?: string; error?: string };

      if (data.error || !data.translated_text) {
        setState('error');
        return;
      }

      setState('translated');
      onTranslated(data.translated_text);
    } catch {
      setState('error');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className={`
        text-xs transition-colors
        ${state === 'error'
          ? 'text-red-500 dark:text-red-400 cursor-default'
          : 'text-carbon/50 dark:text-alabaster/50 hover:text-stormy dark:hover:text-seaweed'
        }
        focus:outline-none focus:underline disabled:opacity-50
      `}
    >
      {state === 'loading' && t.translating}
      {state === 'idle' && t.translate}
      {state === 'translated' && t.showOriginal}
      {state === 'error' && t.translateError}
    </button>
  );
}
