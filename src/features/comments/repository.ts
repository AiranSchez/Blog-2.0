import type { Comment, PostCommentBody, ReactionType } from '../../types/comments';

export type NewComment = Pick<Comment, 'article_slug' | 'parent_id' | 'author_name' | 'content' | 'language' | 'ip_hash'>;
export type SavedComment = Omit<Comment, 'ip_hash'>;

// The use cases do not know about Supabase queries, HTTP or browser state.
export interface CommentsRepository {
  list(slug: string): Promise<Comment[]>;
  countRecent(ipHash: string, since: string): Promise<number>;
  findParent(id: string): Promise<Pick<Comment, 'id' | 'parent_id'> | null>;
  createAndTrack(comment: NewComment): Promise<SavedComment>;
  react(id: string, reaction: ReactionType, delta: 1 | -1): Promise<void>;
}

export type CommentInput = Partial<PostCommentBody>;
