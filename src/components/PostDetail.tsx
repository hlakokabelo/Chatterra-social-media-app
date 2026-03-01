import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { formatTimeStamp } from "../utils/util";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

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

  return data as IPost;
};
const PostDetail: React.FunctionComponent<IPostDetailProps> = ({ postId }) => {
  const navigate = useNavigate();
   const { user } = useAuth();
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
          <div className="flex border-transparent sm:w-[45%] border-b-blue-300 border pb-1.5">
            <img
              src={data?.avatar_url}
              alt="User Avatar"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
            <p
              className="ml-1.5 cursor-pointer"
              onClick={() => navigate(`/u/${user?.user_metadata.user_name}`)}
            >
              {user?.user_metadata.user_name}
            </p>
          </div>
        ) : (
          <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]">
            <FaUser className="w-[35px] h-[25px]" />
          </div>
        )}
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
        <div className="max-w-[25rem] max-h-[26rem] mb-[5rem]">
          <img
            src={data?.image_url}
            alt={data?.title}
            className="mt-4 border-amber-50 border-4 rounded object-cover"
          />
        </div>
        <div className=" flex flex-col mt-2.5">
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
