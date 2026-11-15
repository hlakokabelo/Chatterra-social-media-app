import * as React from "react";
import CreatePost from "../../components/posts/CreatePost";
import { usePageTitle } from "../../hooks/usePageTitle";

const CreatePostPage: React.FunctionComponent = () => {
  usePageTitle("Submit to Chatterra");
  return (
    
    <div className=" sm:pt-0">
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
