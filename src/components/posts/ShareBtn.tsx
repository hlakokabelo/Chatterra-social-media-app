import { BsReddit, BsTwitterX } from "react-icons/bs";
import { routeBuilder } from "../../utils/routes";
import { BiCopy } from "react-icons/bi";
import React from "react";
import type { IPost } from "./PostList";
import { FaShare } from "react-icons/fa";
import toast from "react-hot-toast";

export function ShareBtn({ post }: { post: IPost }) {
  const postUrl = `${window.location.origin}${routeBuilder.post(post.id, post.title)}`;

  const [showShareMenu, setShowShareMenu] = React.useState(false);
  const shareMenuRef = React.useRef<HTMLDivElement>(null);
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this post: ${post.title}`,
      url: postUrl,
    };

    // Try using Web Share API first (mobile devices)
    if (
      navigator.share &&
      /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to menu
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }

    // Fallback: Show share menu
    setShowShareMenu(!showShareMenu);
  };

  // Close share menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setShowShareMenu(false);
      // Optional: Show a toast notification
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out this post: ${post.title}`);
    const url = encodeURIComponent(postUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
    setShowShareMenu(false);
  };

  const shareToReddit = () => {
    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(postUrl);
    window.open(
      `https://www.reddit.com/submit?title=${title}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
    setShowShareMenu(false);
  };

  return (
    <div className="relative" ref={shareMenuRef}>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
      >
        <FaShare className="text-base" />
        <span className="text-sm cursor-pointer font-medium">Share</span>
      </button>

      {/* Share Menu Dropdown */}
      {showShareMenu && (
        <div className="absolute bottom-full mb-2 right-0 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-slate-400 font-medium border-b border-slate-700 mb-1">
              Share this post
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full cursor-pointer text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3"
            >
              <BiCopy /> Copy link
            </button>

            <button
              onClick={shareToTwitter}
              className="w-full cursor-pointer text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3"
            >
              <BsTwitterX />
              Share on X (Twitter)
            </button>

            <button
              onClick={shareToReddit}
              className="w-full cursor-pointer text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3"
            >
              <BsReddit />
              Share on Reddit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
