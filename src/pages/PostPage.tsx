import * as React from "react";
import PostDetail from "../components/PostDetail";
import { useParams } from "react-router";

interface IPostPageProps {}

const PostPage: React.FunctionComponent<IPostPageProps> = (props) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <PostDetail postId={Number(id)} />
    </div>
  );
};

export default PostPage;
