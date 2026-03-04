import * as React from "react";
import { useNavigate } from "react-router";

interface IPostNotFoudProps {
  title?: string;
}

const PostNotFoud: React.FunctionComponent<IPostNotFoudProps> = ({ title="Page" }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {title} not found
        </h2>

        <p className="text-gray-200 dark:text-gray-400 mb-6">
          Either it was deleted, never existed
        </p>

        <p
          onClick={() => navigate("/")}
          className="cursor-pointer inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Back to feed
        </p>
      </div>
    </div>
  );
};

export default PostNotFoud;
