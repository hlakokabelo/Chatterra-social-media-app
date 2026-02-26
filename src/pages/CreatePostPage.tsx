import * as React from "react";
import CreatePost from "../components/CreatePost";

interface ICreatePostPageProps {}

const CreatePostPage: React.FunctionComponent<ICreatePostPageProps> = () => {
  return (
    <div>
      <h2>Create New Post</h2>
      <CreatePost/>
    </div>
  );
};

export default CreatePostPage;
