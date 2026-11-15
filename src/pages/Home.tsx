import * as React from "react";
import PostList from "../components/posts/PostList";
import { usePageTitle } from "../hooks/usePageTitle";
const Home: React.FunctionComponent = () => {
  usePageTitle("Home | Chatterra");
  return (
    <div className="max-w-screen">
      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
