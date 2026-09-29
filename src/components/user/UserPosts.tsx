import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { formatTimeStamp, formatErrorMessage } from "../../utils/formatting";
import { routeBuilder } from "../../utils/routes";
import UserPostsSkeleton from "../Skeletons/UserPostsSkeleton";
import { FormatContent } from "../FormatContent";
import type { IPost } from "../../types/post";
import { fetchUserPosts } from "../../services/posts";

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

const UserPosts: React.FC<Props> = ({ userId }) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  if (isLoading) return <UserPostsSkeleton />;

  if (error) {
    return (
      <p className="mt-4 text-red-400">{formatErrorMessage(error.message)}</p>
    );
  }

  if (!data?.length) {
    return <p className="mt-4 text-zinc-400">No posts yet.</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {data.map(
        (post: IPost & { community_id: number; community_name: string }) => {
          const postRoute = routeBuilder.post(post.id, post.title);

          const navigateToPost = (event: React.MouseEvent<HTMLElement>) => {
            const target = event.target as HTMLElement;

            if (target.closest("a, button")) return;

            navigate(postRoute);
          };

          return (
            <div
              key={post.id}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 transition-colors hover:border-zinc-500"
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-2">
                  <div onClick={navigateToPost} className="cursor-pointer">
                    <h3 className="font-medium text-zinc-100 hover:text-blue-300">
                      <FormatContent content={post.title} />
                    </h3>

                    {post.content && (
                      <div className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        <FormatContent content={post.content} />
                      </div>
                    )}
                  </div>

                  {post.image_urls?.[0] && (
                    <Link to={postRoute} className="sm:hidden">
                      <img
                        src={post.image_urls[0]}
                        alt=""
                        className="mt-3 max-h-64 rounded-md object-cover"
                      />
                    </Link>
                  )}

                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    {post.community_id && (
                      <>
                        <Link
                          to={routeBuilder.community(
                            post.community_id,
                            post.community_name,
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

                {post.image_urls?.[0] && (
                  <Link to={postRoute} className="hidden shrink-0 sm:block">
                    <img
                      src={post.image_urls[0]}
                      alt=""
                      className="max-h-20 rounded-md object-cover"
                    />
                  </Link>
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
};

export default UserPosts;
