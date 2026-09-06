import type { ReactionType } from '../../types/comments';
import type { CommentInput, CommentsRepository } from './repository';
import { buildCommentTree, sanitizeContent } from './rules';

export class CommentError extends Error {
  constructor(public readonly code: string, message: string) { super(message); }
}

export async function listComments(repository: CommentsRepository, slug: string) {
  const comments = await repository.list(slug);
  return { comments: buildCommentTree(comments), total: comments.length };
}

export async function postComment(
  repository: CommentsRepository,
  body: CommentInput,
  ipHash: string,
  now: number,
) {
  if (body.website?.trim()) return { comment: null };
  const content = sanitizeContent(body.content ?? '');
  if (!content) throw new CommentError('EMPTY_CONTENT', 'Comment cannot be empty');
  if (content.length > 2000) throw new CommentError('TOO_LONG', 'Comment exceeds 2000 characters');
  const authorName = body.author_name?.trim() ?? null;
  if (authorName && authorName.length > 50) throw new CommentError('NAME_TOO_LONG', 'Author name exceeds 50 characters');
  const slug = body.article_slug?.trim();
  if (!slug) throw new CommentError('MISSING_SLUG', 'Missing article_slug');

  const count = await repository.countRecent(ipHash, new Date(now - 60 * 60 * 1000).toISOString());
  if (count >= 5) throw new CommentError('RATE_LIMIT', 'Too many comments. Please wait before posting again.');
  const parentId = body.parent_id ?? null;
  if (parentId) {
    const parent = await repository.findParent(parentId);
    if (!parent) throw new CommentError('INVALID_PARENT', 'Parent comment not found');
    if (parent.parent_id !== null) throw new CommentError('NESTING_TOO_DEEP', 'Nested replies not allowed');
  }
  try {
    const comment = await repository.createAndTrack({
      article_slug: slug, parent_id: parentId, author_name: authorName,
      content, language: body.language ?? 'en', ip_hash: ipHash,
    });
    return { comment };
  } catch {
    throw new CommentError('INSERT_FAILED', 'Failed to save comment');
  }
}

export async function reactToComment(repository: CommentsRepository, id: string, reaction: ReactionType, delta: 1 | -1) {
  await repository.react(id, reaction, delta);
  return { ok: true };
}
