import * as React from "react";
import { Link, useNavigate } from "react-router";
import { formatTimeStamp } from "../../utils/formatting";
import { FaUser, FaComment } from "react-icons/fa";
import { routeBuilder } from "../../utils/routes";
import { ShareBtn } from "./ShareBtn";
import LikeButton from "../postProperties/LikeButton";
import { FormatContent } from "../FormatContent";
import type { IPost } from "../../types/post";

interface IPostItemProps {
  post: IPost & {
    community_name?: string;
    community_id?: number;
  };
  calledByCommunityComponent?: boolean;
}

const PostItem: React.FunctionComponent<IPostItemProps> = ({
  post,
  calledByCommunityComponent = false,
}) => {
  const navigate = useNavigate();

  const postRoute = routeBuilder.post(post.id, post.title);

  const navigateToPost = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    // Allow links/buttons inside FormatContent to handle their own clicks.
    if (target.closest("a, button, input, textarea, select")) {
      return;
    }

    navigate(postRoute);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(postRoute);
    }
  };

  return (
    <div className="group mx-auto mb-6 w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/95 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          {post.avatar_url ? (
            <Link to={routeBuilder.user(post.username)} className="shrink-0">
              <img
                src={post.avatar_url}
                alt={post.username}
                onError={(e) => {
                  e.currentTarget.src = "/images/image-fallback.jpg";
                }}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-700 transition-all hover:ring-slate-500"
              />
            </Link>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-800 ring-2 ring-slate-700">
              <FaUser className="text-lg text-slate-300" />
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={routeBuilder.user(post.username)}
                className="text-base font-semibold text-slate-200 transition-colors hover:text-white"
              >
                u/{post.username}
              </Link>

              {!calledByCommunityComponent && post.community_id && (
                <>
                  <span className="text-slate-600">•</span>

                  <Link
                    to={routeBuilder.community(
                      post.community_id,
                      post.community_name,
                    )}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    c/{post.community_name}
                  </Link>
                </>
              )}
            </div>

            <span className="mt-0.5 text-xs text-slate-500">
              {formatTimeStamp(post.created_at, false)}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          role="link"
          tabIndex={0}
          onClick={navigateToPost}
          onKeyDown={handleKeyDown}
          className="cursor-pointer"
        >
          <h2 className="mb-3 text-2xl font-bold leading-tight text-slate-100 transition-colors hover:text-white">
            <FormatContent content={post.title} />
          </h2>
        </div>

        {/* Content Snippet */}
        {post.content && (
          <div
            role="link"
            tabIndex={0}
            onClick={navigateToPost}
            onKeyDown={handleKeyDown}
            className="mb-4 cursor-pointer text-sm leading-relaxed text-slate-400"
          >
            <div className="line-clamp-3">
              <FormatContent content={post.content} />
            </div>
          </div>
        )}

        {/* Images */}
        {post.image_urls?.length > 0 && (
          <Link to={postRoute} className="mb-4 block">
            <div
              className={
                post.image_urls.length > 1
                  ? "flex gap-2 overflow-x-auto scrollbar-small"
                  : "block"
              }
            >
              {post.image_urls.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className={
                    post.image_urls.length > 1
                      ? "h-64 w-64 shrink-0 overflow-hidden rounded-xl bg-black"
                      : "max-h-[80vh] overflow-hidden rounded-xl bg-black"
                  }
                >
                  <img
                    src={imageUrl}
                    alt={`${post.title} - Image ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/image-fallback.jpg";
                    }}
                    className={
                      post.image_urls.length > 1
                        ? "h-64 w-full object-cover"
                        : "max-h-[80vh] h-auto w-full object-contain"
                    }
                  />
                </div>
              ))}
            </div>
          </Link>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-6 border-t border-slate-800 pt-2">
          <LikeButton
            item_id={post.id}
            user_id={post.user_id}
            refetchIntervalOn={false}
          />

          <Link
            to={postRoute}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-400 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            <FaComment className="text-base" />

            <span className="text-sm font-medium">
              {post.comment_count ?? 0}
            </span>
          </Link>

          <ShareBtn post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostItem;
