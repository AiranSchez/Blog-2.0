/**
 * API Route: /api/comments
 * GET  ?slug={slug} — fetch comments for an article
 * POST             — submit a new comment
 *
 * Edge runtime: export const prerender = false
 */
import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { sanitizeContent, hashString, buildCommentTree } from '../../../components/blog/comments/utils';
import type { PostCommentBody } from '../../../types/comments';

export const prerender = false;

// ─── GET /api/comments?slug={slug} ────────────────────────────────────────────
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return Response.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('comments')
      .select('id, article_slug, parent_id, author_name, content, language, ip_hash, reactions, created_at')
      .eq('article_slug', slug)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const comments = buildCommentTree(data ?? []);

    return Response.json(
      { comments, total: data?.length ?? 0 },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[GET /api/comments]', err);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
};

// ─── POST /api/comments ────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  let body: PostCommentBody;

  try {
    body = await request.json() as PostCommentBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Honeypot check — bots fill this field, humans leave it empty
  if (body.website && body.website.trim() !== '') {
    // Silent reject — return 200 to fool bots
    return Response.json({ comment: null }, { status: 200 });
  }

  // Input validation
  const content = sanitizeContent(body.content ?? '');
  if (!content || content.length < 1) {
    return Response.json({ error: 'Comment cannot be empty', code: 'EMPTY_CONTENT' }, { status: 400 });
  }
  if (content.length > 2000) {
    return Response.json({ error: 'Comment exceeds 2000 characters', code: 'TOO_LONG' }, { status: 400 });
  }

  const authorName = body.author_name?.trim() ?? null;
  if (authorName && authorName.length > 50) {
    return Response.json({ error: 'Author name exceeds 50 characters', code: 'NAME_TOO_LONG' }, { status: 400 });
  }

  const slug = body.article_slug?.trim();
  if (!slug) {
    return Response.json({ error: 'Missing article_slug', code: 'MISSING_SLUG' }, { status: 400 });
  }

  // IP extraction and hashing
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const ipHash = await hashString(rawIp);

  const supabase = getSupabaseAdmin();

  // Rate limit check: max 5 comments per IP per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await supabase
    .from('rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', oneHourAgo);

  if (rateError) {
    console.error('[POST /api/comments] Rate limit check failed', rateError);
    return Response.json({ error: 'Server error', code: 'SERVER_ERROR' }, { status: 500 });
  }

  if ((count ?? 0) >= 5) {
    return Response.json(
      { error: 'Too many comments. Please wait before posting again.', code: 'RATE_LIMIT' },
      { status: 429 }
    );
  }

  // Validate parent_id if provided (1 level deep only)
  let parentId: string | null = body.parent_id ?? null;
  if (parentId) {
    const { data: parent } = await supabase
      .from('comments')
      .select('id, parent_id')
      .eq('id', parentId)
      .single();

    if (!parent) {
      return Response.json({ error: 'Parent comment not found', code: 'INVALID_PARENT' }, { status: 400 });
    }
    // If parent itself is a reply, reject (enforce 1 level deep)
    if (parent.parent_id !== null) {
      return Response.json({ error: 'Nested replies not allowed', code: 'NESTING_TOO_DEEP' }, { status: 400 });
    }
  }

  // Insert comment and rate_limit entry in parallel
  const [commentResult, _rateLimitResult] = await Promise.all([
    supabase
      .from('comments')
      .insert({
        article_slug: slug,
        parent_id: parentId,
        author_name: authorName,
        content,
        language: body.language ?? 'en',
        ip_hash: ipHash,
      })
      .select('id, article_slug, parent_id, author_name, content, language, reactions, created_at')
      .single(),
    supabase
      .from('rate_limits')
      .insert({ ip_hash: ipHash }),
  ]);

  if (commentResult.error) {
    console.error('[POST /api/comments] Insert failed', commentResult.error);
    return Response.json({ error: 'Failed to save comment', code: 'INSERT_FAILED' }, { status: 500 });
  }

  return Response.json(
    { comment: commentResult.data },
    { status: 201 }
  );
};
