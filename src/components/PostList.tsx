import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";
import Loading from "./Loading";

interface IPostListProps {}

export interface IPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  avatar_url: string | null;
  created_at: string;
  comment_count?: number;
  like_count?: number;
  user_id?: string;
  username?: string;
}
const fetchPosts = async (): Promise<IPost[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error?.message);
  return data as IPost[];
};
const PostList: React.FunctionComponent<IPostListProps> = () => {
  const { data, error, isLoading } = useQuery<IPost[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <Loading title="fetching posts" />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid justify-evenly">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};

export default PostList;
