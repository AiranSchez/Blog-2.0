import type { Language } from '../../services/i18n';

export interface ArticleRouteInput { id: string; slug: string }

export function articleLocale(entry: ArticleRouteInput): Language {
  const locale = entry.id.split('/')[0];
  if (locale !== 'en' && locale !== 'es' && locale !== 'ja') throw new Error(`Unsupported article locale: ${entry.id}`);
  return locale;
}

export function normalizeArticleSlug(slug: string): string {
  const value = slug.replace(/^\/+|\/+$/g, '').replace(/^(en|es|ja)\//, '')
    .normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  if (!value) throw new Error(`Empty normalized article slug: ${slug}`);
  return value;
}

export function articlePath(locale: string, slug: string): string {
  return `/${locale}/blog/${normalizeArticleSlug(slug)}/`;
}

// Deliberately reproduce the old key, including .en.md/.es.md/.ja.md.
// This is a persistence identity, NOT a URL or a cross-language thread key.
export function commentKey(entryId: string): string {
  return entryId.replace(/^(en|es|ja)\//, '').replace(/\.(en|es|ja)$/, '').normalize('NFC');
}

function translationKey(id: string): string {
  return id.replace(/^(en|es|ja)\//, '').replace(/\.(en|es|ja)\.mdx?$/, '').normalize('NFC');
}

export function articleAlternates(entry: ArticleRouteInput, entries: ArticleRouteInput[]): Partial<Record<Language, string>> {
  const key = translationKey(entry.id);
  return Object.fromEntries(entries.filter(candidate => translationKey(candidate.id) === key)
    .map(candidate => [articleLocale(candidate), articlePath(articleLocale(candidate), candidate.slug)]));
}
