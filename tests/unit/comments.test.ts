import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listComments, postComment, CommentError, reactToComment } from '../../src/features/comments/service';
import { buildCommentTree } from '../../src/features/comments/rules';
import type { CommentsRepository } from '../../src/features/comments/repository';
import type { Comment } from '../../src/types/comments';

const comment: Comment = {
  id: '1', article_slug: 'article.es.md', parent_id: null, author_name: null,
  content: 'Hello', language: 'es', ip_hash: 'hashed', created_at: '2026-01-01T00:00:00Z',
  reactions: { '👍': 0, '👎': 0, '🔥': 0 },
};
const input = { article_slug: comment.article_slug, content: ' <b>Hello</b> ', language: 'es', website: '' };
function repository(overrides: Partial<CommentsRepository> = {}): CommentsRepository {
  return {
    list: async () => [comment], countRecent: async () => 0, findParent: async () => comment,
    createAndTrack: async value => ({ ...comment, ...value }), react: async () => {}, ...overrides,
  };
}

test('comments build a stable tree and preserve orphan roots', async () => {
  const reply = { ...comment, id: '2', parent_id: '1' };
  const orphan = { ...comment, id: '3', parent_id: 'missing' };
  assert.deepEqual(buildCommentTree([reply, comment, orphan]).map(c => [c.id, c.replies.map(r => r.id)]), [['1', ['2']], ['3', []]]);
  const result = await listComments(repository(), comment.article_slug);
  assert.equal(result.total, 1);
  assert.equal(result.comments[0].article_slug, comment.article_slug);
});

test('posting strips tags and preserves the historical article key', async () => {
  let saved;
  const result = await postComment(repository({ createAndTrack: async value => { saved = value; return { ...comment, ...value }; } }), input, 'hash', 0);
  assert.deepEqual(saved, { article_slug: 'article.es.md', parent_id: null, author_name: null, content: 'Hello', language: 'es', ip_hash: 'hash' });
  assert.equal(result.comment?.content, 'Hello');
});

test('honeypot never touches persistence', async () => {
  assert.deepEqual(await postComment(repository({ countRecent: async () => { throw new Error('unexpected IO'); } }), { website: 'bot' }, 'hash', 0), { comment: null });
});

for (const [body, code] of [
  [{ content: '' }, 'EMPTY_CONTENT'],
  [{ ...input, content: 'x'.repeat(2001) }, 'TOO_LONG'],
  [{ ...input, author_name: 'x'.repeat(51) }, 'NAME_TOO_LONG'],
  [{ content: 'Hello' }, 'MISSING_SLUG'],
] as const) {
  test(`rejects ${code} before persistence`, async () => {
    await assert.rejects(postComment(repository({ countRecent: async () => { throw new Error('unexpected IO'); } }), body, 'hash', 0), error => error instanceof CommentError && error.code === code);
  });
}

test('rate limit uses injected time and rejects the sixth comment', async () => {
  await assert.rejects(postComment(repository({ countRecent: async (hash, since) => {
    assert.equal(hash, 'hash'); assert.equal(since, '2026-01-01T11:00:00.000Z'); return 5;
  } }), input, 'hash', Date.parse('2026-01-01T12:00:00Z')), { code: 'RATE_LIMIT' });
});

test('missing parents and nested replies are rejected', async () => {
  await assert.rejects(postComment(repository({ findParent: async () => null }), { ...input, parent_id: 'bad' }, 'hash', 0), { code: 'INVALID_PARENT' });
  await assert.rejects(postComment(repository({ findParent: async () => ({ id: '2', parent_id: '1' }) }), { ...input, parent_id: '2' }, 'hash', 0), { code: 'NESTING_TOO_DEEP' });
});

test('valid reply and insertion failures retain their contract', async () => {
  assert.equal((await postComment(repository(), { ...input, parent_id: '1' }, 'hash', 0)).comment?.parent_id, '1');
  await assert.rejects(postComment(repository({ createAndTrack: async () => { throw new Error('offline'); } }), input, 'hash', 0), { code: 'INSERT_FAILED' });
});

test('reactions are delegated without coupling to a provider', async () => {
  let args: unknown[] = [];
  assert.deepEqual(await reactToComment(repository({ react: async (...values) => { args = values; } }), '1', '🔥', -1), { ok: true });
  assert.deepEqual(args, ['1', '🔥', -1]);
});
