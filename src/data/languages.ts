export type LanguageLocale = 'en' | 'es' | 'ja';

export const languagesByLocale: Record<LanguageLocale, Array<{ name: string; level: string }>> = {
  es: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'B2 · Intermedio avanzado' },
    { name: 'Japonés', level: 'N4 certificado · N3 conversacional' },
  ],
  en: [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'B2 · Upper intermediate' },
    { name: 'Japanese', level: 'JLPT N4 certified · N3 conversational' },
  ],
  ja: [
    { name: 'スペイン語', level: 'ネイティブ' },
    { name: '英語', level: 'B2・中上級' },
    { name: '日本語', level: 'JLPT N4 認定・N3 会話' },
  ],
};
