import * as React from "react";
import type { IPost } from "./PostList";
import { Link } from "react-router";
import { formatTimeStamp } from "../utils/util";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

interface IPostItemProps {
  post: IPost;
}

const PostItem: React.FunctionComponent<IPostItemProps> = ({ post }) => {
 
 const {user}= useAuth()
  return (
    <div className=" mb-6  sm:w-[35rem] relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="sm:w-[35rem] sm:h-[35rem] bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]">
                <FaUser className="w-[35px] h-[25px]" />
              </div>
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 mb-4 ml-3">
                <span className="text-amber-300 text-1">{user?.user_metadata.user_name}</span>
              </div>
            </div>
          </div>
          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-[25rem] h-[25rem] rounded-[20px] object-cover mx-auto"
            />
          </div>

          <div className="text-2xl ml-2 leading-[22px] font-semibold mt-2">
            <p> {post.title}</p>
          </div>
          <div className="grid ml-2 grid-cols-3 w-[15rem] justify-around mt-3.5">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              <span className="ml-2 text-nowrap">
                {formatTimeStamp(post.created_at, false) ?? 0}
              </span>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostItem;
