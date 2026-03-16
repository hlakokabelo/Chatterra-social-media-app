import * as React from "react";
import { supabase } from "../../supabase-client";
import { useQuery } from "@tanstack/react-query";
import type { IPost } from "../posts/PostList";
import PostItem from "../posts/PostItem";
import PostNotFoud from "../../pages/PageNotFound";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { useNavigate } from "react-router";
import { routeBuilder, slugify } from "../../utils/routes";

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
  <div className="max-w-3xl mx-auto px-4 space-y-8">

    {/* Community Header */}
    <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/60">

      <h2 className="text-2xl font-semibold text-slate-100 mb-2">
        c/{CommunityData?.name}
      </h2>

      {CommunityData?.description && (
        <p className="text-slate-300 mb-4">
          {CommunityData.description}
        </p>
      )}

      <div className="text-sm text-slate-400 space-y-1">
        <p>
          created {CommunityData && formatTimeStamp(CommunityData.created_at)}
        </p>

        <p>
          created by{" "}
          <span
            onClick={() =>
              CommunityData?.creator.username &&
              navigate(routeBuilder.user(CommunityData.creator.username))
            }
            className="cursor-pointer text-slate-300 hover:text-slate-100"
          >
            {CommunityData?.creator.username}
          </span>
        </p>
      </div>

    </div>

    {/* Posts */}
    {data && data.length > 0 ? (
      <div className="space-y-6">
        {data.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            calledByCommunityComponent={true}
          />
        ))}
      </div>
    ) : (
      <p className="text-center text-slate-400 py-6">
        No posts in this community yet.
      </p>
    )}

  </div>
);
};

export default CommunityDisplay;
