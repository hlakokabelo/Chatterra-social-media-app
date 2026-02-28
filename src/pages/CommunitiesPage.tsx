import * as React from "react";
import CommunityList from "../components/CommunityList";

interface ICommunitiesPageProps {}

const CommunitiesPage: React.FunctionComponent<ICommunitiesPageProps> = () => {
  return (
    <div className="">
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Communities
      </h2>
      <CommunityList />
    </div>
  );
};

export default CommunitiesPage;
