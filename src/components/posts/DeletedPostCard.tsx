import { Link } from "react-router-dom";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { routeBuilder } from "../../utils/routes";
import { FaUser } from "react-icons/fa";
import type { IPostCommunity } from "../../services/posts";

interface DeletedPostStateProps {
  post: IPostCommunity;
}

export const DeletedPostState: React.FunctionComponent<
  DeletedPostStateProps
> = ({ post }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <FaUser className="text-slate-600" />
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">[deleted]</span>

            {post.community_id && (
              <>
                <span className="text-slate-700">•</span>

                <Link
                  to={routeBuilder.community(
                    post.community_id,
                    post.community_name,
                  )}
                  className="text-sm text-slate-500 hover:text-emerald-400"
                >
                  c/{post.community_name}
                </Link>
              </>
            )}
          </div>

          <span className="text-xs text-slate-600 mt-0.5">
            {formatTimeStamp(post.created_at, false)}
          </span>
        </div>
      </div>

      <div className="py-4">
        <p className="text-sm italic text-slate-500">
          This post was deleted by the author.
        </p>
      </div>
    </div>
  );
};
