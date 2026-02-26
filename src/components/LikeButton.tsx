import * as React from "react";

interface ILikeButtonProps {
  postId: number;
}

const LikeButton: React.FunctionComponent<ILikeButtonProps> = ({ postId }) => {
  return (
    <div>
      <button>👍</button>

      <button>👎</button>
    </div>
  );
};

export default LikeButton;
