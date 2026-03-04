import * as React from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";
import Loading from "./Loading";

interface ICommentSectionProps {
  postId: number;
}
interface INewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface IComment {
  post_id: number;
  user_id: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  id: number;
  username?: string;
}

const createComment = async (
  newComment: INewComment,
  postId: number,
  userId?: string,
) => {
  if (!userId) throw new Error("You must be logged in to comment");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<IComment[]> => {
  /*   const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
 */
  const { data, error } = await supabase.rpc("get_post_comments", {
    p_post_id: postId,
  });

  if (error) console.error(error);

  return data as IComment[];
};

const CommentSection: React.FunctionComponent<ICommentSectionProps> = ({
  postId,
}) => {
  const [newComentText, setNewCommentText] = React.useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: INewComment) => {
      return createComment(newComment, postId, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 15000, //10secs
  });
  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: IComment[],
  ): (IComment & { children?: IComment[] })[] => {
    //map stores comments and commentID
    // comment migth also have a variable called children
    const map = new Map<number, IComment & { children?: IComment[] }>();
    const roots: (IComment & { children?: IComment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <Loading title="Fetching comments" />;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];
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

      {/* Comments Display Section */}
      <div className="space-y-4">
        {commentTree.map((comment_, key) => (
          <CommentItem key={key} comment={comment_} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
