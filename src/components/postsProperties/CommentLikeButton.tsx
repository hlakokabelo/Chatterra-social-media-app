import * as React from "react";

const CommentLikeButton: React.FunctionComponent = () => {
  const likeValues = [1, -1];
  const [userLike, setUserLike] = React.useState(
    likeValues[Math.floor(Math.random() * 2)],
  );
  const likes = 2;
  const dislikes = 3;

  const submitLike = (like: number) => {
    if (userLike === like) {
      return setUserLike(0);
    }
    setUserLike(like);
  };
  return (
    <div>
      <div className="flex items-center space-x-4 my-4 text-[10px]">
        <button
          onClick={() => submitLike(1)}
          className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
            userLike === 1
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          👍 {likes}
        </button>
        <button
          onClick={() => submitLike(-1)}
          className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
            userLike === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          👎 {dislikes}
        </button>
      </div>
    </div>
  );
};

export default CommentLikeButton;
