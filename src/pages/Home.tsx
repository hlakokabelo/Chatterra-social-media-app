import * as React from "react";
import PostList from "../components/PostList";
import { useAuth } from "../context/AuthContext";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  const {user}= useAuth()
  console.log(user)
  return (
    <div className="">
      <h2 className="text-4xl font-bold mb-6 text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text">
        Recent Posts</h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
