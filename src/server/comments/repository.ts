import type { CommentsRepository } from '../../features/comments/repository';
import { getSupabaseAdmin } from '../supabase';

export function createCommentsRepository(): CommentsRepository {
  // Create on first query: malformed requests do not require credentials.
  let supabase: ReturnType<typeof getSupabaseAdmin> | undefined;
  const client = () => supabase ??= getSupabaseAdmin();
  return {
    async list(slug) {
      // Old macOS-local builds could have stored decomposed Unicode slugs.
      // Read both forms while all new paths use the portable NFC key.
      const legacySlug = slug.normalize('NFD');
      const keys = legacySlug === slug ? [slug] : [slug, legacySlug];
      const { data, error } = await client().from('comments')
        .select('id, article_slug, parent_id, author_name, content, language, ip_hash, reactions, created_at')
        .in('article_slug', keys).order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    async countRecent(ipHash, since) {
      const { count, error } = await client().from('rate_limits').select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash).gte('created_at', since);
      if (error) throw error;
      return count ?? 0;
    },
    async findParent(id) {
      const { data, error } = await client().from('comments').select('id, parent_id').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    async createAndTrack(comment) {
      const supabase = client();
      // Preserve the existing two-write behavior; making these atomic needs a DB migration.
      const [saved] = await Promise.all([
        supabase.from('comments').insert(comment)
          .select('id, article_slug, parent_id, author_name, content, language, reactions, created_at').single(),
        supabase.from('rate_limits').insert({ ip_hash: comment.ip_hash }),
      ]);
      if (saved.error) throw saved.error;
      return saved.data;
    },
    async react(id, reaction, delta) {
      const { error } = await client().rpc('increment_reaction', {
        p_comment_id: id, p_reaction: reaction, p_delta: delta,
      });
      if (error) throw error;
    },
  };
}
