import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { Link, useNavigate } from "react-router";
import Loading from "./Loading";
import { FaUser } from "react-icons/fa";
import PostNotFoud from "../pages/PageNotFound";
import { routeBuilder, ROUTES, slugify } from "../utils/routes";

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

  console.log(data[0]);
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
      const correctSlug = slugify(data.title);

      if (slug !== correctSlug) {
        navigate(routeBuilder.post(postId) + `/${correctSlug}`, {
          replace: true,
        });
      }
    }

  return (
    <div className="space-y-6">
      <div className="lg:ml-[56vh] md:flex flex-col justify-center">
        {data?.avatar_url ? (
          <div className="flex border-transparent sm:w-[45%]  pb-1.5">
            <Link
              className="cursor-pointer"
              to={routeBuilder.user(data.username)}
            >
              {" "}
              <img
                src={data?.avatar_url}
                alt="User Avatar"
                className="w-[55px] h-[55px] rounded-full object-cover"
              />
            </Link>
            <div className="text-[20px] leading-[22px] font-semibold mt-2 mb-4 ml-3">
              <Link to={routeBuilder.user(data.username)}>
                <p className="text-amber-300 text-1 hover:text-amber-500">
                  {data.username}
                </p>
              </Link>

              {data?.community_id && (
                <Link
                  to={routeBuilder.community(
                    data?.community_id,
                    data.community_name,
                  )}
                >
                  <p className="text-[13px] hover:text-blue-400">
                    c/{data.community_name}
                  </p>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]">
            <FaUser className="w-[35px] h-[25px]" />
          </div>
        )}

        <h2 className="text-3xl mt-2.5 mb-2.5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
        {data?.image_url && (
          <div className="mb-2.5">
            <img
              src={data?.image_url}
              alt={data?.title}
              className="mt-4 max-h-[30rem] rounded object-cover"
            />
          </div>
        )}
        <div className=" flex flex-col">
          <p className="text-gray-400 m-4  max-w-[35rem] text-wrap">
            {data?.content}
          </p>

          <p className=" text-cyan-700 text-sm">
            posted: {formatTimeStamp(data!.created_at)}
          </p>

          <LikeButton postId={postId} user_id={data?.user_id} />
        </div>
      </div>
      <CommentSection postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;
