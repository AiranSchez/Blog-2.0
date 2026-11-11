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
    <div className={`comment${isReply ? ' comment--reply' : ''}`}>
      <div className="comment__head">
        <div className="comment__who">
          <span className="comment__avatar" aria-hidden="true">{authorDisplay[0].toUpperCase()}</span>
          <span className="comment__author">{authorDisplay}</span>
          <span className="comment__lang" title={`${t.postedIn} ${comment.language}`}>
            {LANGUAGE_NAMES[comment.language] ?? comment.language.toUpperCase()}
          </span>
        </div>
        <time dateTime={comment.created_at} className="comment__time">
          {formatRelativeTime(comment.created_at, locale)}
        </time>
      </div>

      <p className="comment__body">{displayContent}</p>

      <div className="comment__actions">
        <ReactionBar commentId={comment.id} reactions={comment.reactions} />
        <div className="comment__tools">
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
          {!isReply && (
            <button
              type="button"
              onClick={() => setShowReplyForm(v => !v)}
              className="comment__reply"
            >
              {showReplyForm ? t.cancelReply : `↩ ${t.reply}`}
            </button>
          )}
        </div>
      </div>

      {showReplyForm && !isReply && (
        <div className="comment__reply-form">
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

      {'replies' in comment && comment.replies.length > 0 && (
        <div className="comment__replies">
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
