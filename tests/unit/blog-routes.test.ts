import { test } from 'node:test';
import assert from 'node:assert/strict';
import legacy from '../../src/data/blog-legacy-routes.json';
import { articleAlternates, articlePath, commentKey, normalizeArticleSlug } from '../../src/features/blog/routes';

const entries = legacy.map(route => ({ id: route.oldPath.split('/')[1] + '/' + route.commentKey, slug: route.oldPath.split('/blog/')[1] }));

test('all 51 historic articles map to distinct canonical routes', () => {
  assert.equal(legacy.length, 51);
  assert.equal(new Set(legacy.map(route => route.newPath)).size, legacy.length);
  for (const route of legacy) {
    const locale = route.oldPath.split('/')[1];
    assert.equal(articlePath(locale, route.oldPath.split('/blog/')[1]), route.newPath);
    assert.match(route.newPath, /^\/(en|es|ja)\/blog\/[\p{L}\p{N}-]+\/$/u);
    assert.equal(commentKey(`${locale}/${route.commentKey}`), route.commentKey);
    assert.equal(route.commentKey, route.commentKey.normalize('NFC'));
  }
});

test('each language switch targets a real translation, not a copied slug', () => {
  for (const entry of entries) {
    const paths = articleAlternates(entry, entries);
    assert.deepEqual(Object.keys(paths).sort(), ['en', 'es', 'ja']);
    for (const path of Object.values(paths)) assert.ok(legacy.some(route => route.newPath === path));
  }
});

test('slug normalization handles old separators without changing persistence keys', () => {
  assert.equal(normalizeArticleSlug('/es/React /TS/'), 'react-ts');
  assert.equal(normalizeArticleSlug('Mob&Pair'), 'mob-pair');
  assert.equal(normalizeArticleSlug('/en/café/'), 'cafe');
  assert.throws(() => normalizeArticleSlug('///'));
  assert.equal(commentKey('en/café.en.md'), 'café.en.md');
});
