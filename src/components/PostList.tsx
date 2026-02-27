import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

interface IPostListProps {}

export interface IPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  avatar_url: string | null;
  created_at: string;
}
const fetchPosts = async (): Promise<IPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error?.message);
  return data as IPost[];
};
const PostList: React.FunctionComponent<IPostListProps> = () => {
  const { data, error, isLoading } = useQuery<IPost[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading posts...</div>;

  if (error) return <div>Error: {error.message}</div>;

  
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};

export default PostList;
