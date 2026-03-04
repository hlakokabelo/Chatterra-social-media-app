import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import { FaUser } from "react-icons/fa";

interface IPostDetailProps {
  postId: number;
}
const fetchPostById = async (id: number): Promise<IPost> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // fetch user avatar_url & user
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user_id)
    .single();
  data.avatar_url = profileData.avatar_url;
  data.username = profileData.username;
  return data as IPost;
};
const PostDetail: React.FunctionComponent<IPostDetailProps> = ({ postId }) => {
  const navigate = useNavigate();

  if (isNaN(postId)) {
    navigate("/");
  }
  const { data, error, isLoading } = useQuery<IPost, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <Loading title="Loading post" />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="lg:ml-[56vh] md:flex flex-col justify-center">
        {data?.avatar_url ? (
          <div
            onClick={() => navigate(`/u/${data.username}`)}
            className="flex cursor-pointer border-transparent sm:w-[45%]  pb-1.5"
          >
            <img
              src={data?.avatar_url}
              alt="User Avatar"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
            <p className="ml-1.5 cursor-pointer">{data.username}</p>
          </div>
        ) : (
          <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]">
            <FaUser className="w-[35px] h-[25px]" />
          </div>
        )}
        <h2 className="text-4xl m-2.5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
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
          <p className="text-gray-400 mb-2 max-w-[35rem] text-wrap">
            {data?.content}
          </p>

          <p className=" text-cyan-700 text-sm">
            posted: {formatTimeStamp(data!.created_at)}
          </p>

          <LikeButton postId={postId} />
        </div>
      </div>
      <CommentSection postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;
