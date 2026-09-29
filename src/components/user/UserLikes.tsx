import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { formatTimeStamp } from "../../utils/formatting";
import { useNavigate } from "react-router";
import { routeBuilder } from "../../utils/routes";
import UserLikesSkeleton from "../Skeletons/UserLikesSkeleton";
import { FormatContent } from "../FormatContent";
import type { IPost } from "../../types/post";

interface Props {
  userId: string;
}

interface IVotes {
  created_at: string;
  id: number;
  posts: IPost;
  user_id: string;
  vote: number;
}

const fetchUserLikes = async (userId: string) => {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `*,
      posts (
        id,
        title,
        content,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as IVotes[];
};

const UserLikes: React.FC<Props> = ({ userId }) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userLikes", userId],
    queryFn: () => fetchUserLikes(userId),
  });

  if (isLoading) return <UserLikesSkeleton />;

  if (error) {
    return <p className="mt-4 text-red-400">Error loading likes.</p>;
  }

  if (!data?.length) {
    return <p className="mt-4 text-zinc-400">No liked posts yet.</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {data.map((like: IVotes) => {
        const postRoute = routeBuilder.post(like.posts.id, like.posts.title);

        const handlePostClick = (event: React.MouseEvent<HTMLDivElement>) => {
          const target = event.target as HTMLElement;

          if (target.closest("a, button")) return;

          navigate(postRoute);
        };

        return (
          <div key={like.id}>
            <div
              onClick={handlePostClick}
              className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 p-4 hover:border-green-600"
            >
              <div className="text-white">
                <FormatContent content={like.posts.title} />
              </div>

              <p className="mt-2">
                <span
                  className={
                    like.vote === 1 ? "text-green-500" : "text-red-500"
                  }
                >
                  {like.vote === 1 ? "up-voted on:" : "down-voted on:"}{" "}
                </span>

                {formatTimeStamp(like.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserLikes;
