import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { formatTimeStamp } from "../utils/util";

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
  const { data, error, isLoading } = useQuery<IPost, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div>Loading posts...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="lg:ml-[56vh] md:flex flex-col justify-center">
        <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
        <div className="">
          <img
            src={data?.image_url}
            alt={data?.title}
            className="mt-4 w-[30rem] h-[30rem] border-amber-50 border-4 rounded object-cover"
          />
        </div>
        <div className=" flex flex-col mt-2.5">
          <p className="text-gray-400">{data?.content}</p>

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
