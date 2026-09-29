import type { ICommentChild } from "../types/comment";
import { encodeId } from "./idEncoder";

export const hashCommentId = (id: number): string => {
  return `#comment-${encodeId(id)}`;
};

/**
 * makes sure that if a comment is hashed, its parent comments are not collapsed.
 * It also ensures that the comment is highlighted by giving it a different style.
 */
export const handleHashedComment = (comment: ICommentChild): boolean => {
  const isHighlighted = window.location.hash === hashCommentId(comment.id);

  if (isHighlighted) return true;
  else if (comment.children) {
    let value = false;
    for (const child of comment.children) {
      value = window.location.hash === hashCommentId(child.id);

      if (value) break;
      else if (handleHashedComment(child)) {
        value = true;
      }
    }
    return value;
    // Output: 1, 2
  }

  return false;
};