/**
 * ReactionBar — emoji reaction buttons for a comment
 * Reactions stored server-side; user's choices stored in localStorage (GDPR compliant)
 */
import { useState, useEffect } from 'react';
import type { ReactionType, Reactions } from '../../../types/comments';
import { getLocalReactions, toggleLocalReaction } from './utils';

interface ReactionBarProps {
  commentId: string;
  reactions: Reactions;
}

const REACTION_EMOJIS: { type: ReactionType; label: string }[] = [
  { type: '👍', label: 'Thumbs up' },
  { type: '👎', label: 'Thumbs down' },
  { type: '🔥', label: 'Fire' },
];

export default function ReactionBar({ commentId, reactions }: ReactionBarProps) {
  const [counts, setCounts] = useState<Reactions>(reactions);
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());

  useEffect(() => {
    setUserReactions(getLocalReactions(commentId));
  }, [commentId]);

  const handleReaction = async (type: ReactionType) => {
    const hasReacted = userReactions.has(type);
    const delta = hasReacted ? -1 : 1;

    // Optimistic update
    setCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
    const added = toggleLocalReaction(commentId, type);
    setUserReactions(getLocalReactions(commentId));

    // Sync to server
    try {
      const res = await fetch('/api/comments/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, reaction: type, delta }),
      });
      if (!res.ok) {
        // Rollback on error
        setCounts(prev => ({
          ...prev,
          [type]: Math.max(0, prev[type] - delta),
        }));
        toggleLocalReaction(commentId, type);
        setUserReactions(getLocalReactions(commentId));
      }
    } catch {
      // Rollback on network error
      setCounts(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - delta),
      }));
      toggleLocalReaction(commentId, type);
      setUserReactions(getLocalReactions(commentId));
    }
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Reactions">
      {REACTION_EMOJIS.map(({ type, label }) => {
        const active = userReactions.has(type);
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            aria-pressed={active}
            aria-label={`${label}: ${counts[type]}`}
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              transition-all duration-200 border
              ${active
                ? 'bg-stormy/10 dark:bg-seaweed/20 border-stormy/30 dark:border-seaweed/30 text-stormy dark:text-seaweed scale-105'
                : 'bg-alabaster-100 dark:bg-carbon-800 border-transparent text-carbon/60 dark:text-alabaster/60 hover:bg-alabaster-200 dark:hover:bg-carbon-700'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-stormy dark:focus:ring-seaweed
            `}
          >
            <span aria-hidden="true">{type}</span>
            <span>{counts[type]}</span>
          </button>
        );
      })}
    </div>
  );
}
