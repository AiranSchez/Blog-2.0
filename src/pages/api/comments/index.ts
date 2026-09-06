import type { APIRoute } from 'astro';
import { CommentError, listComments, postComment } from '../../../features/comments/service';
import type { CommentInput } from '../../../features/comments/repository';
import { createCommentsRepository } from '../../../server/comments/repository';
import { hashString } from '../../../server/comments/hash-ip';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return Response.json({ error: 'Missing slug parameter' }, { status: 400 });
  try {
    return Response.json(await listComments(createCommentsRepository(), slug), {
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[GET /api/comments]', error);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: CommentInput;
  try {
    const input: unknown = await request.json();
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected object');
    const fields = ['article_slug', 'parent_id', 'content', 'author_name', 'language', 'website'];
    for (const [key, value] of Object.entries(input)) {
      if (fields.includes(key) && value !== null && typeof value !== 'string') throw new Error('Expected string');
    }
    body = input as CommentInput;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  try {
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip') ?? 'unknown';
    const result = await postComment(createCommentsRepository(), body, await hashString(rawIp), Date.now());
    return Response.json(result, { status: result.comment === null ? 200 : 201 });
  } catch (error) {
    if (error instanceof CommentError) {
      const status = error.code === 'RATE_LIMIT' ? 429 : error.code === 'INSERT_FAILED' ? 500 : 400;
      return Response.json({ error: error.message, code: error.code }, { status });
    }
    console.error('[POST /api/comments]', error);
    return Response.json({ error: 'Server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
};
