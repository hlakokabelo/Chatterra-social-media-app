import * as React from "react";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import type { IPost } from "./PostList";
import PostItem from "./PostItem";
import PostNotFoud from "../pages/PageNotFound";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { useNavigate } from "react-router";
import { routeBuilder, slugify } from "../utils/routes";

interface ICommunityDisplayProps {
  communityId: number;
  slug: string | undefined;
}

interface ICommunity {
  name: string;
  description: string;
  created_at: string;
  user_id: string;
  creator: { username: string };
}

interface PostWithCommunity extends IPost {
  communities: {
    name: string;
  };
}

export const fetchCommunityData = async (
  communityId: number,
): Promise<ICommunity> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .single();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user_id)
    .single();

  if (error) throw new Error(error.message);

  if (profileData) data.creator = profileData;
  return data as ICommunity;
};
export const fetchCommunityPost = async (
  communityId: number,
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_community_meta", {
    p_community_id: communityId,
  });

  if (error) throw new Error(error.message);
  console.log({ meta: data });

  return data as PostWithCommunity[];
};
const CommunityDisplay: React.FunctionComponent<ICommunityDisplayProps> = ({
  communityId,
  slug,
}) => {
  const navigate = useNavigate();
  const { data: CommunityData, error: CommunityError } = useQuery<
    ICommunity,
    Error
  >({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunityData(communityId),
  });

  const { data, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (CommunityError) return <PostNotFoud title="Community" />;

  if (CommunityData && !isLoading) {
    const correctSlug = slugify(CommunityData.name);

    if (slug !== correctSlug) {
      navigate(routeBuilder.community(communityId) + `/${correctSlug}`, {
        replace: true,
      });
    }
  }

  return (
    <div className="grid justify-evenly gap-y-[4rem]">
      <div className="border w-full p-2.5 rounded-3xl  border-amber-200 bg-gradient-to-r from-gray-200 to-pink-500 bg-clip-text text-transparent">
        <h2 className="text-4xl text-center mb-2"> {CommunityData?.name}</h2>
        <p>{CommunityData?.description}</p>
        <p className="text-cyan-600">
          {" "}
          created {CommunityData && formatTimeStamp(CommunityData?.created_at)}
        </p>
        <p className="text-cyan-600">
          created by{" "}
          <span
            onClick={() =>
              CommunityData?.creator.username &&
              navigate(routeBuilder.user(CommunityData?.creator.username))
            }
            className="cursor-pointer text-blue-800"
          >
            {CommunityData?.creator.username}
          </span>
        </p>
      </div>
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
