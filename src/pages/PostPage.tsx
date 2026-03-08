import * as React from "react";
import PostDetail from "../components/PostDetail";
import { useParams } from "react-router";

interface IPostPageProps {}

const PostPage: React.FunctionComponent<IPostPageProps> = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();

  return (
    <div>
      <PostDetail postId={Number(id)} slug={slug} />
    </div>
  );
};

export default PostPage;
