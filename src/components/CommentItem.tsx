import * as React from "react";
import type { IComment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import {formatTimeStamp} from '../utils/formatTimeStamp.tsx'

interface ICommentItemProps {
  comment: IComment & { children?: IComment[] };
  postId: number;
}
interface IReplyComment {
  content: string;
  parent_comment_id: number | null;
}

const createReply = async (
  newReply: IReplyComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) throw new Error("You must be logged in to reply");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    author: author,
    content: newReply.content,
    parent_comment_id: newReply.parent_comment_id,
  });

  if (error) throw new Error(error.message);
};
const CommentItem: React.FunctionComponent<ICommentItemProps> = ({
  comment,
  postId,
}) => {
  const [showReply, setShowReply] = React.useState<boolean>(false);
  const [replyText, setReplyText] = React.useState<string>("");

  /**ensures that the first comments of root comment are shown */
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(
    comment.parent_comment_id ? false : true,
  );
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: IReplyComment) => {
      return createReply(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      setReplyText("");
      setShowReply(false);
      setIsCollapsed(true)
    },
  });

  const handleReplySubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!replyText) return;
    mutate({ content: replyText, parent_comment_id: comment.id });
  };

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          {/**Display commenter username */}
          <span className="text-sm font-bold text-blue-400">
            {comment?.author}
          </span>
          <span className="text-xs text-gray-500">
        
            {formatTimeStamp(comment?.created_at)}
          </span>
        </div>
        <p className="text-gray-300 wrap-anywhere">{comment.content}</p>
        <button
          className="text-amber-500 text-sm mt-1 cursor-pointer"
          onClick={() => setShowReply((prev) => !prev)}
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {showReply && user && (
        <form className="mb-2" onSubmit={handleReplySubmit}>
          <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={2}
            value={replyText}
            placeholder="write reply..."
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="mt-1 bg-purple-500 text-white px-3 py-1 rounded cursor-pointer hover:text-amber-200"
            type="submit"
          >
            {isPending ? "Replying" : "Post reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button className=""
            title={isCollapsed ? "Hide Replies" : "Show Replies"}
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
                color="green"
            
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                color="red"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>
          {isCollapsed && (
            <div className="space-y-3 pl-2">
              {comment.children.map((childComment, key) => (
                <CommentItem key={key} comment={childComment} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
