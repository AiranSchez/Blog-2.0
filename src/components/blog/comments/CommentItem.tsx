/**
 * CommentItem — renders a single comment with reactions, translate button, and reply toggle
 */
import { useState } from 'react';
import type { Comment, CommentWithReplies } from '../../../types/comments';
import { formatRelativeTime } from './utils';
import ReactionBar from './ReactionBar';
import TranslateButton from './TranslateButton';
import CommentForm from './CommentForm';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  ja: 'JA',
};

interface CommentItemTranslations {
  anonymous: string;
  reply: string;
  cancelReply: string;
  replyTo: string;
  translate: string;
  showOriginal: string;
  translating: string;
  translateError: string;
  placeholder: string;
  authorPlaceholder: string;
  submit: string;
  submitting: string;
  charsRemaining: string;
  postedIn: string;
  'error.empty': string;
  'error.tooLong': string;
  'error.rateLimit': string;
  'error.generic': string;
}

interface CommentItemProps {
  comment: CommentWithReplies | Comment;
  locale: string;
  articleSlug: string;
  translations: CommentItemTranslations;
  onNewReply?: (reply: Comment) => void;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  locale,
  articleSlug,
  translations: t,
  onNewReply,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const displayContent = translatedContent ?? comment.content;
  const authorDisplay = comment.author_name || t.anonymous;

  const handleReplySuccess = (newComment: unknown) => {
    setShowReplyForm(false);
    onNewReply?.(newComment as Comment);
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-4 border-l-2 border-alabaster-200 dark:border-carbon-600 pl-4' : ''}`}>
      <div className="bg-white dark:bg-carbon-700 rounded-xl p-5 shadow-sm border border-alabaster-100 dark:border-carbon-600">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Avatar placeholder */}
            <div
              className="w-8 h-8 rounded-full bg-stormy/10 dark:bg-seaweed/20 flex items-center justify-center text-sm font-bold text-stormy dark:text-seaweed flex-shrink-0"
              aria-hidden="true"
            >
              {authorDisplay[0].toUpperCase()}
            </div>
            <span className="font-semibold text-sm text-carbon dark:text-alabaster">
              {authorDisplay}
            </span>
            {/* Language badge */}
            <span
              className="px-1.5 py-0.5 text-xs rounded bg-alabaster-200 dark:bg-carbon-800 text-carbon/60 dark:text-alabaster/60 font-mono"
              title={`${t.postedIn} ${comment.language}`}
            >
              {LANGUAGE_NAMES[comment.language] ?? comment.language.toUpperCase()}
            </span>
          </div>
          {/* Timestamp */}
          <time
            dateTime={comment.created_at}
            className="text-xs text-carbon/50 dark:text-alabaster/50 flex-shrink-0"
          >
            {formatRelativeTime(comment.created_at, locale)}
          </time>
        </div>

        {/* Content */}
        <p className="text-sm text-carbon dark:text-alabaster leading-relaxed mb-3 whitespace-pre-wrap">
          {displayContent}
        </p>

        {/* Footer: reactions + actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ReactionBar commentId={comment.id} reactions={comment.reactions} />

          <div className="flex items-center gap-3">
            <TranslateButton
              commentId={comment.id}
              content={comment.content}
              sourceLang={comment.language}
              targetLang={locale}
              translations={{
                translate: t.translate,
                showOriginal: t.showOriginal,
                translating: t.translating,
                translateError: t.translateError,
              }}
              onTranslated={setTranslatedContent}
            />
            {/* Reply button — only for root comments */}
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(v => !v)}
                className="text-xs text-carbon/50 dark:text-alabaster/50 hover:text-stormy dark:hover:text-seaweed transition-colors focus:outline-none focus:underline"
              >
                {showReplyForm ? t.cancelReply : `↩ ${t.reply}`}
              </button>
            )}
          </div>
        </div>

        {/* Inline reply form */}
        {showReplyForm && !isReply && (
          <div className="mt-4 pt-4 border-t border-alabaster-100 dark:border-carbon-600">
            <CommentForm
              articleSlug={articleSlug}
              locale={locale}
              translations={{
                placeholder: t.placeholder,
                authorPlaceholder: t.authorPlaceholder,
                submit: t.submit,
                submitting: t.submitting,
                cancelReply: t.cancelReply,
                replyTo: t.replyTo,
                'error.empty': t['error.empty'],
                'error.tooLong': t['error.tooLong'],
                'error.rateLimit': t['error.rateLimit'],
                'error.generic': t['error.generic'],
                charsRemaining: t.charsRemaining,
              }}
              parentId={comment.id}
              parentAuthor={authorDisplay}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {'replies' in comment && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={{ ...reply, replies: [] } as CommentWithReplies}
              locale={locale}
              articleSlug={articleSlug}
              translations={t}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
