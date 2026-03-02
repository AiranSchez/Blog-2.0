/**
 * Comments System Types
 * Type definitions for the blog comments feature
 */

export type ReactionType = '👍' | '👎' | '🔥';

export interface Reactions {
  '👍': number;
  '👎': number;
  '🔥': number;
}

export interface Comment {
  id: string;
  article_slug: string;
  parent_id: string | null;
  author_name: string | null;
  content: string;
  language: string;
  ip_hash: string;
  reactions: Reactions;
  created_at: string;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
}

export interface PostCommentBody {
  article_slug: string;
  parent_id?: string;
  content: string;
  author_name?: string;
  language: string;
  website: string; // honeypot field — must be empty
}

export interface ReactionBody {
  comment_id: string;
  reaction: ReactionType;
  delta: 1 | -1;
}

export interface TranslateBody {
  text: string;
  source_lang: string;
  target_lang: string;
}

export interface CommentsApiResponse {
  comments: CommentWithReplies[];
  total: number;
}

export interface ApiError {
  error: string;
  code?: string;
}
