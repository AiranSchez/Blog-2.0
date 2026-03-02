/**
 * CommentForm — form to post a new comment or reply
 * Used as both root CommentForm and ReplyForm (via parentId prop)
 */
import { useState } from 'react';
import type { PostCommentBody } from '../../../types/comments';

interface CommentFormTranslations {
  placeholder: string;
  authorPlaceholder: string;
  submit: string;
  submitting: string;
  cancel?: string;
  replyTo?: string;
  cancelReply?: string;
  'error.empty': string;
  'error.tooLong': string;
  'error.rateLimit': string;
  'error.generic': string;
  charsRemaining: string;
}

interface CommentFormProps {
  articleSlug: string;
  locale: string;
  translations: CommentFormTranslations;
  parentId?: string;
  parentAuthor?: string;
  onSuccess: (comment: unknown) => void;
  onCancel?: () => void;
}

const MAX_LENGTH = 2000;

export default function CommentForm({
  articleSlug,
  locale,
  translations: t,
  parentId,
  parentAuthor,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const remaining = MAX_LENGTH - content.length;
  const isOverLimit = remaining < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError(t['error.empty']);
      return;
    }
    if (content.length > MAX_LENGTH) {
      setError(t['error.tooLong']);
      return;
    }

    setSubmitting(true);

    // Detect browser language for the comment's language tag
    const browserLang = navigator.language.split('-')[0];
    const commentLang = ['en', 'es', 'ja'].includes(browserLang) ? browserLang : 'en';

    const body: PostCommentBody & { parent_id?: string } = {
      article_slug: articleSlug,
      content: content.trim(),
      author_name: authorName.trim() || undefined,
      language: commentLang,
      website, // honeypot
      ...(parentId ? { parent_id: parentId } : {}),
    };

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { comment?: unknown; error?: string; code?: string };

      if (!res.ok) {
        if (data.code === 'RATE_LIMIT' || res.status === 429) {
          setError(t['error.rateLimit']);
        } else {
          setError(data.error ?? t['error.generic']);
        }
        return;
      }

      setContent('');
      setAuthorName('');
      onSuccess(data.comment);
    } catch {
      setError(t['error.generic']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot field — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
      />

      {/* Reply indicator */}
      {parentId && parentAuthor && (
        <div className="flex items-center justify-between mb-2 text-sm text-stormy dark:text-seaweed">
          <span>↩ {t.replyTo} <strong>{parentAuthor}</strong></span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-carbon/50 dark:text-alabaster/50 hover:text-carbon dark:hover:text-alabaster text-xs"
            >
              {t.cancelReply}
            </button>
          )}
        </div>
      )}

      {/* Author name */}
      <input
        type="text"
        value={authorName}
        onChange={e => setAuthorName(e.target.value)}
        placeholder={t.authorPlaceholder}
        maxLength={50}
        className="w-full px-4 py-2 mb-3 rounded-lg border border-alabaster-200 dark:border-carbon-600
                   bg-white dark:bg-carbon-800 text-carbon dark:text-alabaster text-sm
                   placeholder:text-carbon/40 dark:placeholder:text-alabaster/40
                   focus:outline-none focus:ring-2 focus:ring-stormy dark:focus:ring-seaweed focus:border-transparent"
      />

      {/* Content textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t.placeholder}
          rows={parentId ? 3 : 4}
          className={`
            w-full px-4 py-3 rounded-lg border text-sm resize-none
            bg-white dark:bg-carbon-800 text-carbon dark:text-alabaster
            placeholder:text-carbon/40 dark:placeholder:text-alabaster/40
            focus:outline-none focus:ring-2 focus:ring-stormy dark:focus:ring-seaweed focus:border-transparent
            transition-colors
            ${isOverLimit
              ? 'border-red-400 dark:border-red-500'
              : 'border-alabaster-200 dark:border-carbon-600'
            }
          `}
          aria-describedby="char-counter"
        />
        <span
          id="char-counter"
          className={`absolute bottom-2 right-3 text-xs ${
            isOverLimit
              ? 'text-red-500 dark:text-red-400 font-semibold'
              : remaining < 200
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-carbon/40 dark:text-alabaster/40'
          }`}
        >
          {remaining} {t.charsRemaining}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-3">
        {onCancel && !parentId && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-carbon/60 dark:text-alabaster/60 hover:text-carbon dark:hover:text-alabaster transition-colors"
          >
            {t.cancel}
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || isOverLimit}
          className="px-5 py-2 rounded-lg bg-stormy dark:bg-seaweed text-white text-sm font-semibold
                     hover:bg-stormy/90 dark:hover:bg-seaweed/90 transition-all shadow-sm hover:shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
