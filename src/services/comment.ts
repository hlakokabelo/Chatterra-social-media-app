import { supabase } from "../config/supabase-client";
import type { INewComment, IVote } from "../types/comment";
import { submitVote } from "./posts";


export const createComment = async (
  newComment: INewComment,
  postId: number,
  userId?: string,
) => {
  if (!userId) throw new Error("You must be logged in to comment");

  const { error, data } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content: newComment.content,
      parent_comment_id: newComment.parent_comment_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  submitVote(1, data.id, true);
};



export const deleteComment = async (item_id: number) => {
  const { error } = await supabase.rpc("delete_comment", {
    p_comment_id: item_id,
  });
  if (error) throw new Error(error.message);
};

export const fetchVotes = async (
  item_id: number,
  isComment: boolean,
): Promise<IVote[]> => {
  const table = isComment ? "comment_votes" : "votes";
  const column = isComment ? "comment_id" : "post_id";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, item_id);

  if (error) throw new Error(error.message);

  return data as IVote[];
};
