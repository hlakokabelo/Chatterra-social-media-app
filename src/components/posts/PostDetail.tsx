import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import LikeButton from "../postProperties/LikeButton";
import CommentSection from "../postProperties/CommentSection";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { Link, useNavigate } from "react-router";
import { FaUser, FaComment } from "react-icons/fa";
import PostNotFoud from "../../pages/PageNotFound";
import { routeBuilder, slugify } from "../../utils/routes";
import { ShareBtn } from "./ShareBtn";
import PostMenu from "../postProperties/PostMenu";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { fetchPostById, type IPostCommunity } from "../../services/posts";
import PostDetailSkeleton from "../Skeletons/PostDetailSkeleton";
import { FormatContent } from "../FormatContent";

interface IPostDetailProps {
  postId: number;
  slug: string | undefined;
}

const PostDetail: React.FunctionComponent<IPostDetailProps> = ({
  postId,
  slug,
}) => {
  const navigate = useNavigate();

  if (isNaN(postId)) {
    return <PostNotFoud title="Post" />;
  }

  const { data: post, error, isLoading, isSuccess } = useQuery<
    IPostCommunity,
    Error
  >({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  React.useEffect(() => {
    if (isSuccess && post && slug !== slugify(post.title)) {
      const hash = window.location.hash;

      navigate(routeBuilder.post(postId) + `/${slugify(post.title)}${hash}`, {
        replace: true,
      });
    }
  }, [isSuccess, post, slug, postId, navigate]);

if (isLoading) return <PostDetailSkeleton />;
  if (error) return <PostNotFoud title="Post" />;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Post Card */}
      <div className="w-full max-w-3xl mx-auto group">
        <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-sm p-6 transition-all duration-300">
          {/* Header */}
         <div className="flex items-center gap-3 mb-4">
  {/* Avatar */}
  {post?.avatar_url ? (
    <Link
      to={routeBuilder.user(post.username)}
      className="shrink-0"
    >
      <img
        src={post.avatar_url}
        alt={post.username}
        onError={(e) => {
          e.currentTarget.src = "/images/image-fallback.jpg";
        }}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 hover:ring-slate-500 transition-all"
      />
    </Link>
  ) : (
    <div className="w-12 h-12 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-700">
      <FaUser className="text-slate-300 text-lg" />
    </div>
  )}

  {/* User information */}
  <div className="flex flex-col flex-1 min-w-0">
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        to={routeBuilder.user(post!.username)}
        className="text-slate-200 font-semibold hover:text-white transition-colors text-base"
      >
        u/{post?.username}
      </Link>

      {post?.community_id && (
        <>
          <span className="text-slate-600">•</span>

          <Link
            to={routeBuilder.community(
              post.community_id,
              post.community_name
            )}
            className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
          >
            c/{post.community_name}
          </Link>
        </>
      )}
    </div>

    <span className="text-xs text-slate-500 mt-0.5">
      {formatTimeStamp(post!.created_at, false)}
    </span>
  </div>

  {/* Three dots */}
  {post?.user_id && (
    <PostMenu
      postId={postId}
      postUserId={post.user_id}
    />
  )}
</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-100 mb-3 leading-tight">
           <FormatContent content={post?.title}/>
          </h2>

      {/* Image */}
{post?.image_urls&&post?.image_urls?.length > 0 && (
  <div className="block mb-4">
    <PhotoProvider maskOpacity={0.9} speed={() => 300}>
     <div
  className={
    post.image_urls.length > 2
      ? "flex gap-2 overflow-x-auto scrollbar-small"
      : "block"
  }
>
        {post.image_urls.map((imageUrl, index) => (
          <PhotoView key={imageUrl} src={imageUrl}>
            <div
              className={
                post.image_urls.length > 2
                  ? "shrink-0 w-64 rounded-xl overflow-hidden bg-black cursor-zoom-in"
                  : "rounded-xl overflow-hidden bg-black cursor-zoom-in select-none"
              }
            >
              <img
                src={imageUrl}
                alt={`${post.title} - Image ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = "/images/image-fallback.jpg";
                }}
                className={
                  post.image_urls.length > 2
                    ? "w-full h-64 object-cover"
                    : "w-full h-auto max-h-128 object-contain bg-black transition-transform duration-300 hover:scale-[1.01]"                }
              />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  </div>
)}


          {/* Content */}
          <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
         <FormatContent content={post?.content}/>
          </p>

          {/* Edited indicator */}
          {post?.edited && (
            <p className="text-xs italic text-blue-300/70 mb-4">
              edited
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-800 mt-2">
            <LikeButton
              item_id={postId}
              user_id={post?.user_id}
              refetchIntervalOn={false}
            />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400">
              <FaComment className="text-base" />

              <span className="text-sm font-medium">
                {post?.comment_count ?? 0}
              </span>
            </div>

            {/* Share Button */}
            {post && <ShareBtn post={post} />}
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;