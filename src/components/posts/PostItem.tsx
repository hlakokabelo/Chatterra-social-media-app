import * as React from "react";
import type { IPost } from "./PostList";
import { Link } from "react-router";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { FaUser } from "react-icons/fa";
import { routeBuilder } from "../../utils/routes";

interface IPostItemProps {
  post: IPost & { community_name?: string; community_id?: number };
  calledByCommunityComponent?: boolean; //ensures the community name is displayed when called by postList
}

const PostItem: React.FunctionComponent<IPostItemProps> = ({
  post,
  calledByCommunityComponent = false,
}) => {
  return (
    <div className="sm:w-3xl mb-6  font-bold sm:max-w-[35rem] relative group">
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 transition hover:bg-slate-900/80">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {post.avatar_url ? (
            <Link to={routeBuilder.user(post.username)}>
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <FaUser className="text-slate-300 text-sm" />
            </div>
          )}

          <div className="flex flex-col text-1xl leading-tight">
            <Link
              to={routeBuilder.user(post.username)}
              className="text-slate-200 font-medium hover:text-slate-700"
            >
              {post.username}
            </Link>

            {!calledByCommunityComponent && post.community_id && (
              <Link
                to={routeBuilder.community(
                  post.community_id,
                  post.community_name,
                )}
                className="text-slate-400 hover:text-white text-xs"
              >
                c/{post.community_name}
              </Link>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={routeBuilder.post(post.id, post.title)}>
          <h2
            className={`text-[1.6rem] font-semibold text-slate-100 mb-3 hover:text-slate-50
              ${post.image_url?"":"mb-8 mt-8"}`}
          >
            {post.title}
          </h2>
        </Link>

        {/* Image */}
        {post.image_url && (
          <Link to={routeBuilder.post(post.id, post.title)}>
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-lg w-full max-h-[28rem] object-cover mb-3"
            />
          </Link>
        )}

        {/* Footer stats */}
        <div className="flex items-center gap-5 text-sm text-slate-400">
          <span>{formatTimeStamp(post.created_at, false)}</span>

          <span className="flex items-center gap-1">
            ❤️ {post.like_count ?? 0}
          </span>

          <span className="flex items-center gap-1">
            💬 {post.comment_count ?? 0}
          </span>
        </div>
      </div>{" "}
    </div>
  );
};

export default PostItem;
