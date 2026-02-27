import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface ILikeButtonProps {
  postId: number;
}
interface IVote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}
const submitVote = async (
  voteValue: number,
  postId: number,
  userId: string,
) => {
  //check if vote exists
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  if (existingVote) {
    //if vote is equal to vote in db delete vote
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      //else updatte vote value
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, vote: voteValue, user_id: userId });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<IVote[]> => {
  const { data } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  return data as IVote[];
};

const LikeButton: React.FunctionComponent<ILikeButtonProps> = ({ postId }) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote!");
      return submitVote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<IVote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 15000, //10secs
  });

  if (isLoading) {
    return <div> Loading votes...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const dislikes = votes?.filter((vote) => vote.vote === -1).length;
  const likes = votes?.filter((vote) => vote.vote === 1).length;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
};

export default LikeButton;
