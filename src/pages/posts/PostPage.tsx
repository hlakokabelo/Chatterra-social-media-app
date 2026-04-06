import * as React from "react";
import PostDetail from "../../components/posts/PostDetail";
import { useParams } from "react-router";
import { decodeId } from "../../utils/idEncoder";

interface IPostPageProps {}

const PostPage: React.FunctionComponent<IPostPageProps> = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();

  
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);
    
  return (
    <div>
      {id && <PostDetail postId={Number(decodeId(id))} slug={slug} />}
    </div>
  );
};

export default PostPage;
