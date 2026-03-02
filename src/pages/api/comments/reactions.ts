/**
 * API Route: POST /api/comments/reactions
 * Atomically increments or decrements a reaction count on a comment.
 * Uses Supabase RPC function increment_reaction defined in the DB.
 */
import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';
import type { ReactionBody, ReactionType } from '../../../types/comments';

export const prerender = false;

const VALID_REACTIONS: ReactionType[] = ['👍', '👎', '🔥'];

export const POST: APIRoute = async ({ request }) => {
  let body: ReactionBody;

  try {
    body = await request.json() as ReactionBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { comment_id, reaction, delta } = body;

  // Validate inputs
  if (!comment_id || typeof comment_id !== 'string') {
    return Response.json({ error: 'Invalid comment_id' }, { status: 400 });
  }
  if (!VALID_REACTIONS.includes(reaction)) {
    return Response.json({ error: 'Invalid reaction type' }, { status: 400 });
  }
  if (delta !== 1 && delta !== -1) {
    return Response.json({ error: 'Delta must be 1 or -1' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.rpc('increment_reaction', {
    p_comment_id: comment_id,
    p_reaction: reaction,
    p_delta: delta,
  });

  if (error) {
    console.error('[POST /api/comments/reactions]', error);
    return Response.json({ error: 'Failed to update reaction' }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
};
