import * as React from "react";
import PostList from "../components/PostList";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <div className="pt-10">
      <h2 className="text-6xl font-bold mb-6 text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text">Recent Posts</h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
