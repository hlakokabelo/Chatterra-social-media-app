import * as React from "react";
import PostList from "../components/posts/PostList";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <div className="max-w-screen">
      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
