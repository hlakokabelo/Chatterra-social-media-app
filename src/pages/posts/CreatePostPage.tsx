import * as React from "react";
import CreatePost from "../../components/posts/CreatePost";

interface ICreatePostPageProps {}

const CreatePostPage: React.FunctionComponent<ICreatePostPageProps> = () => {
  return (
    <div className=" sm:pt-0">
     
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
