import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { Link } from "react-router";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import type { IPost } from "./PostList";
import { routeBuilder } from "../../utils/routes";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import UserPostsSkeleton from "../Skeletons/UserPostsSkeleton";
import { FormatContent } from "../FormatContent";

interface Props {
  userId: string;
}

const timeStamp = (post: IPost) => {
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
    .rpc("get_posts_with_user_id", { p_user_id: userId });

  if (error) throw new Error(error.message);

  return data;
};

const UserPosts: React.FC<Props> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  if (isLoading) return <UserPostsSkeleton />;

  if (error) {
    return (
      <p className="mt-4 text-red-400">
        {formatErrorMessage(error.message)}
      </p>
    );
  }

  if (!data?.length) {
    return (
      <p className="mt-4 text-zinc-400">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {data.map((post: IPost & { community_id: number; community_name: string }) => (
        <div
          key={post.id}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 transition-colors hover:border-zinc-500"
        >
          <div className="flex gap-2">
            {/* Post content */}
            <div className="min-w-0 flex-2">
              <Link to={routeBuilder.post(post.id, post.title)}>
                <h3 className="font-medium text-zinc-100 hover:text-blue-300">
                  <FormatContent content={post.title} />
                </h3>

                {post.content && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    <FormatContent content={post.content} />
                  </p>
                )}
              </Link>

              {/*image for mobile*/}

 {post.image_urls
  ?.[0] && (
    <img
      src={post.image_urls[0]}
      alt=""
      className="sm:hidden mt-3 max-h-64  rounded-md object-cover flex justify-center"
    />
  )}
              {/* Metadata */}
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                {post.community_id && (
                  <>
                    <Link
                      to={routeBuilder.community(
                        post.community_id,
                        post.community_name
                      )}
                      className="text-blue-300 hover:text-blue-400"
                    >
                      c/{post.community_name}
                    </Link>

                    <span>·</span>
                  </>
                )}

                <span>{timeStamp(post)}</span>
              </div>
            </div>

            {/* Image thumbnail */}
            {post.image_urls?.[0] && (
              <Link
                to={routeBuilder.post(post.id, post.title)}
                className="hidden shrink-0 sm:block"
              >
                <img
                  src={post.image_urls[0]}
                  alt=""
                  className="max-h-20 rounded-md object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPosts;