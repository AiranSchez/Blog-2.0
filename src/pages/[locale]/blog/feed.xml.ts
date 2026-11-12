import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { articleLocale, articlePath } from '../../../features/blog/routes';

export const prerender = true;

export const getStaticPaths = (() => ['en', 'es', 'ja'].map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

const copy = {
  en: {
    title: 'Airán Sánchez · Blog',
    description: 'A working notebook about software, testing, teams and the craft behind maintainable systems.',
    language: 'en-US',
  },
  es: {
    title: 'Airán Sánchez · Blog',
    description: 'Un cuaderno de trabajo sobre software, testing, equipos y el oficio que hay detrás de los sistemas mantenibles.',
    language: 'es-ES',
  },
  ja: {
    title: 'Airán Sánchez · ブログ',
    description: 'ソフトウェア、テスト、チーム、そして保守しやすいシステムを作る技術についてのノートです。',
    language: 'ja-JP',
  },
};

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.locale as 'en' | 'es' | 'ja';
  const text = copy[lang];
  const base = site ?? new URL('https://airanschez.tech');
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft && articleLocale(post) === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const items = posts.map((post) => {
    const url = new URL(articlePath(lang, post.slug), base).toString();
    return [
      '    <item>',
      `      <title>${escapeXml(post.data.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <description>${escapeXml(post.data.description)}</description>`,
      `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
      ...post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      '    </item>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(text.title)}</title>`,
    `    <link>${escapeXml(new URL(`/${lang}/blog/`, base).toString())}</link>`,
    `    <description>${escapeXml(text.description)}</description>`,
    `    <language>${text.language}</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(new URL(`/${lang}/blog/feed.xml`, base).toString())}" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
