import { supabase } from "../config/supabase-client";
import { submitVote } from "./posts";

export interface INewComment {
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
  is_deleted?: boolean;
}


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