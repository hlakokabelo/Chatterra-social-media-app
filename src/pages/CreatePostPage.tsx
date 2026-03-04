import * as React from "react";
import CreatePost from "../components/CreatePost";

interface ICreatePostPageProps {}

const CreatePostPage: React.FunctionComponent<ICreatePostPageProps> = () => {
  return (
    <div className=" sm:pt-0">
      <h2 className="text-4xl font-bold mb-3 text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
