import type { IPost } from "../components/posts/PostList";
import { supabase } from "../config/supabase-client";

export type IPostCommunity = IPost & {
  community_name: string;
  community_id: number;
};

export const fetchPostById = async (id: number): Promise<IPostCommunity> => {
  const { data, error } = await supabase.rpc("get_posts_with_post_id", {
    p_post_id: id,
  });

  if (error) throw new Error(error.message);

  return data[0] as IPostCommunity;
};



export const submitVote = async (
  voteValue: number,
  itemIdValue: number,
  isComment: boolean,
) => {
  const functionName = isComment
    ? "submit_comment_vote"
    : "submit_post_vote";

  const params = isComment
    ? {
        c_comment_id: itemIdValue,
        c_vote: voteValue,
      }
    : {
        p_post_id: itemIdValue,
        p_vote: voteValue,
      };

  const { error } = await supabase.rpc(functionName, params);

  if (error) throw new Error(error.message);
};
