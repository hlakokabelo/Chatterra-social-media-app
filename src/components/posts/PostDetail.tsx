import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import LikeButton from "../postsProperties/LikeButton";
import CommentSection from "../postsProperties/CommentSection";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { Link, useNavigate } from "react-router";
import Loading from "../Loading";
import { FaUser } from "react-icons/fa";
import PostNotFoud from "../../pages/PageNotFound";
import { routeBuilder, ROUTES, slugify } from "../../utils/routes";

interface IPostDetailProps {
  postId: number;
  slug: string | undefined;
}

type IPostCommunity = IPost & { community_name: string; community_id: number };

const fetchPostById = async (id: number): Promise<IPostCommunity> => {
  const { data, error } = await supabase.rpc("get_posts_with_post_id", {
    p_post_id: id,
  });
  if (error) throw new Error(error.message);

  return data[0] as IPostCommunity;
};
const PostDetail: React.FunctionComponent<IPostDetailProps> = ({
  postId,
  slug,
}) => {
  const navigate = useNavigate();

  if (isNaN(postId)) {
    navigate(ROUTES.HOME);
  }
  const { data, error, isLoading, isSuccess } = useQuery<IPostCommunity, Error>(
    {
      queryKey: ["post", postId],
      queryFn: () => fetchPostById(postId),
    },
  );

  if (isLoading) return <Loading title="Loading post" />;

  if (error) return <PostNotFoud title="Post" />;

  if (isSuccess)
    if (data) {
      const hash = window.location.hash;

      const correctSlug = slugify(data.title);

      if (slug !== correctSlug) {
        navigate(routeBuilder.post(postId) + `/${correctSlug}${hash}`, {
          replace: true,
        });
      }
    }


  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Post Card */}
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur">
        {/* Author Section */}
        <div className="flex items-center gap-3 mb-4">
          {data?.avatar_url ? (
            <Link to={routeBuilder.user(data.username)}>
              <img
                src={data.avatar_url}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            </Link>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
              <FaUser className="text-slate-300" />
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <Link
              to={routeBuilder.user(data!.username)}
              className="text-slate-200 font-semibold hover:text-slate-100"
            >
              {data?.username}
            </Link>

            {data?.community_id && (
              <Link
                to={routeBuilder.community(
                  data.community_id,
                  data.community_name,
                )}
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                c/{data.community_name}
              </Link>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">
          {data?.title}
        </h2>

        {/* Image */}
        {data?.image_url && (
          <div className="mb-5">
            <img
              src={data.image_url}
              alt={data.title}
              className="rounded-lg max-h-[30rem] w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <p className="text-slate-300 leading-relaxed mb-4">{data?.content}</p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>posted {formatTimeStamp(data!.created_at)}</span>
        </div>

        {/* Likes */}
        <div className="mt-4">
          <LikeButton item_id={postId} user_id={data?.user_id} />
        </div>

        <p className="text-sm italic text-blue-300">
          {data?.edited ? "edited" : ""}
        </p>
      </div>

      {/* Comments */}
      <CommentSection postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;
