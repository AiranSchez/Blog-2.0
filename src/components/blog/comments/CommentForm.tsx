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
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="comment-form__honeypot"
      />

      {parentId && parentAuthor && (
        <div className="comment-form__replying">
          <span>↩ {t.replyTo} <strong>{parentAuthor}</strong></span>
          {onCancel && (
            <button type="button" onClick={onCancel} className="comment-form__cancel">
              {t.cancelReply}
            </button>
          )}
        </div>
      )}

      <input
        type="text"
        value={authorName}
        onChange={e => setAuthorName(e.target.value)}
        placeholder={t.authorPlaceholder}
        maxLength={50}
        className="comment-form__input"
        aria-label={t.authorPlaceholder}
      />

      <div className="comment-form__field">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t.placeholder}
          rows={parentId ? 3 : 4}
          className={`comment-form__textarea${isOverLimit ? ' is-over-limit' : ''}`}
          aria-describedby="char-counter"
        />
        <span id="char-counter" className={`comment-form__counter${isOverLimit ? ' is-over-limit' : remaining < 200 ? ' is-near-limit' : ''}`}>
          {remaining} {t.charsRemaining}
        </span>
      </div>

      {error && (
        <p role="alert" className="comment-form__error">
          {error}
        </p>
      )}

      <div className="comment-form__actions">
        {onCancel && !parentId && (
          <button type="button" onClick={onCancel} className="comment-form__cancel">
            {t.cancel}
          </button>
        )}
        <button type="submit" disabled={submitting || isOverLimit} className="btn">
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
