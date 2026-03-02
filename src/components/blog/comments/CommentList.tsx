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
    return (
      <div className="text-center py-12">
        <p className="text-carbon/50 dark:text-alabaster/50 text-sm">{t.noComments}</p>
      </div>
    );
  }

  return (
    <section aria-label={t.title}>
      <div className="space-y-4">
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
