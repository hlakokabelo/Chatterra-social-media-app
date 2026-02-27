import * as React from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface ICommentSectionProps {
  postId: number;
}
interface INewComment {
  content: string;
  parent_comment_id: number | null;
}

interface IComment {
  post_id: number;
  user_id: string;
  author: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  id: number;
}

const createComment = async (
  newComment: INewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) throw new Error("You must be logged in to comment");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    author: author,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<IComment[]> => {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  return data as IComment[];
};

const CommentSection: React.FunctionComponent<ICommentSectionProps> = ({
  postId,
}) => {
  const [newComentText, setNewCommentText] = React.useState<string>("");
  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: INewComment) => {
      return createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name,
      );
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!newComentText) return;
    mutate({ content: newComentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<IComment[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 15000, //10secs
  });

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {user ? (
        <form className="mb-4" onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={3}
            value={newComentText}
            placeholder="write comment..."
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
            type="submit"
          >
            {isPending ? "Posting" : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">Log in to comment</p>
      )}
    </div>
  );
};

export default CommentSection;
