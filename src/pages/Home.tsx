import * as React from "react";
import PostList from "../components/posts/PostList";

const Home: React.FunctionComponent = () => {
  return (
    <div className="max-w-screen">
      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
