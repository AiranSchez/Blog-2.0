import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import legacy from '../../src/data/blog-legacy-routes.json';

const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf8')) as {
  routes: { src?: string; status?: number; headers?: { Location?: string } }[];
};
const sitemap = readFileSync('.vercel/output/static/sitemap-0.xml', 'utf8');
const xmlEscape = (value: string) => value.replaceAll('&', '&amp;');

test('built articles retain all 51 comment identities and self-canonical URLs', () => {
  for (const route of legacy) {
    const html = readFileSync(`.vercel/output/static${route.newPath}index.html`, 'utf8');
    const props = html.match(/<astro-island[^>]+component-url="[^"]*CommentsSection[^>]+props="([^"]+)"/)?.[1];
    assert.ok(props, route.newPath);
    const decoded = props.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
    assert.equal(JSON.parse(decoded).articleSlug[1], route.commentKey, route.newPath);
    assert.ok(html.includes(`rel="canonical" href="https://airanschez.tech${route.newPath}"`), route.newPath);
    assert.ok(sitemap.includes(`<loc>https://airanschez.tech${route.newPath}</loc>`), route.newPath);
    if (route.oldPath !== route.newPath) assert.ok(!sitemap.includes(`<loc>https://airanschez.tech${xmlEscape(route.oldPath)}</loc>`), route.oldPath);
  }
});

test('Vercel redirects cover encoded and decoded old paths with and without slash', () => {
  for (const route of legacy.filter(r => r.oldPath !== r.newPath)) {
    for (const path of [route.oldPath, route.oldPath.slice(0, -1), encodeURI(route.oldPath), encodeURI(route.oldPath.slice(0, -1))]) {
      const redirect = config.routes.find(r => r.src && new RegExp(r.src).test(path));
      assert.equal(redirect?.status, 301, path);
      assert.equal(redirect?.headers?.Location, route.newPath, path);
    }
    const exact = config.routes.find(r => r.status === 301 && r.headers?.Location === route.newPath)!;
    assert.ok(!new RegExp(exact.src!).test(route.newPath), 'No redirect loops');
    assert.ok(!new RegExp(exact.src!).test(route.oldPath + 'not-an-article'), 'No broad catch-all redirects');
  }
});

test('public bundles cannot contain privileged environment names or the build sentinel', async () => {
  const { readdirSync } = await import('node:fs');
  function inspect(path: string) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const target = `${path}/${entry.name}`;
      if (entry.isDirectory()) inspect(target);
      else if (/\.(js|html|json|map)$/.test(entry.name)) {
        const source = readFileSync(target, 'utf8');
        for (const forbidden of ['SUPABASE_SERVICE_ROLE_KEY', 'LIBRETRANSLATE_API_KEY', 'SERVER_ONLY_BUILD_SENTINEL']) {
          assert.ok(!source.includes(forbidden), `Server-only value/name leaked into ${target}`);
        }
      }
    }
  }
  inspect('.vercel/output/static');
});
