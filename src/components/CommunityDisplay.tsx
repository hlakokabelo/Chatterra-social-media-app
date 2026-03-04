import * as React from "react";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import type { IPost } from "./PostList";
import PostItem from "./PostItem";
import PostNotFoud from "../pages/PageNotFound";

interface ICommunityDisplayProps {
  communityId: number;
}

interface PostWithCommunity extends IPost {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number,
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  if(!data[0].communities?.name)  throw new Error("Community exists not")
  console.log(data);
  return data as PostWithCommunity[];
};
const CommunityDisplay: React.FunctionComponent<ICommunityDisplayProps> = ({
  communityId,
}) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error) return <PostNotFoud title="Community" />;
  return (
    <div className="grid justify-evenly gap-y-[4rem]">
      <h2 className="text-4xl  text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data.length > 0 && data[0].communities?.name} Community Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};

export default CommunityDisplay;
