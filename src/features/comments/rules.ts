/**
 * Sanitizes user content: strips HTML tags to prevent XSS.
 * Used server-side before storing to Supabase.
 */
export function sanitizeContent(content: string): string {
  return content.replace(/<[^>]*>/g, '').trim();
}

/**
 * Builds a nested comment tree from a flat list.
 * Root comments (parent_id = null) get a `replies` array of their children.
 */
export function buildCommentTree(flatComments: import('../../types/comments').Comment[]): import('../../types/comments').CommentWithReplies[] {
  const roots: import('../../types/comments').CommentWithReplies[] = [];
  const map = new Map<string, import('../../types/comments').CommentWithReplies>();

  // First pass: create all nodes
  for (const c of flatComments) {
    map.set(c.id, { ...c, replies: [] });
  }

  // Second pass: attach children to parents
  for (const node of map.values()) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
