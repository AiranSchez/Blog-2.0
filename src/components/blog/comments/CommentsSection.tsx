/**
 * CommentsSection — React island (client:load)
 * Main entry point for the comments feature.
 * Fetches comments, subscribes to Realtime, orchestrates sub-components.
 */
import { useState, useEffect, useRef } from 'react';
import type { CommentWithReplies, Comment } from '../../../types/comments';
import { createBrowserSupabaseClient } from '../../../lib/supabase';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

type Locale = 'en' | 'es' | 'ja';

interface CommentsSectionProps {
  articleSlug: string;
  locale: Locale;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const translations = {
  en: {
    title: 'Comments',
    noComments: 'Be the first to comment!',
    loading: 'Loading comments...',
    error: 'Could not load comments. Please try again.',
    placeholder: 'Write a comment...',
    authorPlaceholder: 'Your name (optional)',
    submit: 'Post Comment',
    submitting: 'Posting...',
    cancel: 'Cancel',
    reply: 'Reply',
    replyTo: 'Replying to',
    cancelReply: 'Cancel reply',
    translate: 'Translate',
    showOriginal: 'Show original',
    translating: 'Translating...',
    translateError: 'Translation unavailable',
    anonymous: 'Anonymous',
    charsRemaining: 'characters remaining',
    postedIn: 'Written in',
    'error.empty': 'Comment cannot be empty',
    'error.tooLong': 'Comment is too long (max 2000 characters)',
    'error.rateLimit': 'Too many comments. Please wait before posting again.',
    'error.generic': 'Something went wrong. Please try again.',
  },
  es: {
    title: 'Comentarios',
    noComments: '¡Sé el primero en comentar!',
    loading: 'Cargando comentarios...',
    error: 'No se pudieron cargar los comentarios. Inténtalo de nuevo.',
    placeholder: 'Escribe un comentario...',
    authorPlaceholder: 'Tu nombre (opcional)',
    submit: 'Publicar comentario',
    submitting: 'Publicando...',
    cancel: 'Cancelar',
    reply: 'Responder',
    replyTo: 'Respondiendo a',
    cancelReply: 'Cancelar respuesta',
    translate: 'Traducir',
    showOriginal: 'Ver original',
    translating: 'Traduciendo...',
    translateError: 'Traducción no disponible',
    anonymous: 'Anónimo',
    charsRemaining: 'caracteres restantes',
    postedIn: 'Escrito en',
    'error.empty': 'El comentario no puede estar vacío',
    'error.tooLong': 'El comentario es demasiado largo (máx. 2000 caracteres)',
    'error.rateLimit': 'Demasiados comentarios. Espera un momento antes de publicar de nuevo.',
    'error.generic': 'Algo salió mal. Inténtalo de nuevo.',
  },
  ja: {
    title: 'コメント',
    noComments: '最初にコメントしましょう！',
    loading: 'コメントを読み込み中...',
    error: 'コメントを読み込めませんでした。もう一度お試しください。',
    placeholder: 'コメントを書く...',
    authorPlaceholder: 'お名前（任意）',
    submit: 'コメントを投稿',
    submitting: '投稿中...',
    cancel: 'キャンセル',
    reply: '返信',
    replyTo: '返信先',
    cancelReply: '返信をキャンセル',
    translate: '翻訳',
    showOriginal: '原文を表示',
    translating: '翻訳中...',
    translateError: '翻訳できません',
    anonymous: '匿名',
    charsRemaining: '文字残り',
    postedIn: '言語',
    'error.empty': 'コメントを入力してください',
    'error.tooLong': 'コメントが長すぎます（最大2000文字）',
    'error.rateLimit': 'コメントが多すぎます。しばらくしてからもう一度お試しください。',
    'error.generic': 'エラーが発生しました。もう一度お試しください。',
  },
} as const;

export default function CommentsSection({
  articleSlug,
  locale,
  supabaseUrl,
  supabaseAnonKey,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const channelRef = useRef<ReturnType<ReturnType<typeof createBrowserSupabaseClient>['channel']> | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createBrowserSupabaseClient> | null>(null);

  const t = translations[locale] ?? translations.en;

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json() as { comments: CommentWithReplies[] };
        setComments(data.comments);
      } catch {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleSlug]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createBrowserSupabaseClient(supabaseUrl, supabaseAnonKey);
    supabaseRef.current = supabase;

    const channel = supabase
      .channel(`comments:${articleSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `article_slug=eq.${articleSlug}`,
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments(prev => {
            if (newComment.parent_id) {
              // Add as reply to parent
              return prev.map(c =>
                c.id === newComment.parent_id
                  ? { ...c, replies: [...(c.replies ?? []), newComment] }
                  : c
              );
            } else {
              // Add as top-level comment — avoid duplicates
              const exists = prev.some(c => c.id === newComment.id);
              if (exists) return prev;
              return [...prev, { ...newComment, replies: [] }];
            }
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [articleSlug, supabaseUrl, supabaseAnonKey]);

  const handleNewComment = (newComment: unknown) => {
    const comment = newComment as Comment;
    // Realtime will handle adding the comment to the list,
    // but if Realtime isn't connected yet, add it manually as fallback
    setComments(prev => {
      const exists = prev.some(c => c.id === comment.id);
      if (exists) return prev;
      return [...prev, { ...comment, replies: [] }];
    });
    setShowForm(false);
  };

  const handleNewReply = (parentId: string, reply: Comment) => {
    // Fallback: add reply manually if Realtime hasn't triggered yet
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? {
              ...c,
              replies: c.replies.some(r => r.id === reply.id)
                ? c.replies
                : [...c.replies, reply],
            }
          : c
      )
    );
  };

  return (
    <section
      className="mt-12 pt-8 border-t border-alabaster-200 dark:border-carbon-600"
      data-pagefind-ignore
      aria-label={t.title}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-stormy dark:text-seaweed">
          {t.title}
          {comments.length > 0 && (
            <span className="ml-2 text-lg font-normal text-carbon/50 dark:text-alabaster/50">
              ({comments.length})
            </span>
          )}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-stormy dark:bg-seaweed text-white text-sm font-semibold
                       hover:bg-stormy/90 dark:hover:bg-seaweed/90 transition-all shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed"
          >
            + {t.submit}
          </button>
        )}
      </div>

      {/* New comment form */}
      {showForm && (
        <div className="mb-6 p-5 bg-alabaster-50 dark:bg-carbon-800 rounded-xl border border-alabaster-200 dark:border-carbon-600">
          <CommentForm
            articleSlug={articleSlug}
            locale={locale}
            translations={t}
            onSuccess={handleNewComment}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-carbon/50 dark:text-alabaster/50 text-sm">
          {t.loading}
        </div>
      ) : error ? (
        <div role="alert" className="text-center py-8 text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      ) : (
        <CommentList
          comments={comments}
          locale={locale}
          articleSlug={articleSlug}
          translations={t}
          onNewReply={handleNewReply}
        />
      )}
    </section>
  );
}
