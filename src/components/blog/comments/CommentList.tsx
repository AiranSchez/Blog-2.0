/**
 * CommentList — renders the full list of top-level comments with their replies
 */
import type { CommentWithReplies, Comment } from '../../../types/comments';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentWithReplies[];
  locale: string;
  articleSlug: string;
  translations: Parameters<typeof CommentItem>[0]['translations'] & {
    noComments: string;
    title: string;
  };
  onNewReply: (parentId: string, reply: Comment) => void;
}

export default function CommentList({
  comments,
  locale,
  articleSlug,
  translations: t,
  onNewReply,
}: CommentListProps) {
  if (comments.length === 0) {
    return <p className="comments__status">{t.noComments}</p>;
  }

  return (
    <section className="comments-list" aria-label={t.title}>
      <div className="comments-list__items">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            locale={locale}
            articleSlug={articleSlug}
            translations={t}
            onNewReply={(reply) => onNewReply(comment.id, reply)}
          />
        ))}
      </div>
    </section>
  );
}
