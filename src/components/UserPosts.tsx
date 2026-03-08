import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import type { IPost } from "./PostList";
import { routeBuilder } from "../utils/routes";

interface Props {
  userId: string;
}

const timeStamp = (post: IPost) => {
  //posted on : 16 Sep, 18:00
  //posted 18hrs ago
  const stamp = formatTimeStamp(post.created_at);
  return (
    "posted " +
    (stamp.includes("min") || stamp.includes("hr") ? "" : "on") +
    " " +
    stamp
  );
};
const fetchUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const UserPosts: React.FC<Props> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  if (isLoading) return <p className="text-zinc-400 mt-4">Loading posts...</p>;
  if (error) return <p className="text-red-400 mt-4">Error loading posts.</p>;

  if (!data?.length) return <p className="text-zinc-400 mt-4">No posts yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {data.map((post: IPost) => (
        <Link to={routeBuilder.post(post.id,post.title)}>
          <div
            key={post.id}
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-amber-300 "
          >
            <p className="text-white">{post.content}</p>

            <p className="text-xs text-zinc-500 mt-2">{timeStamp(post)} </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserPosts;
