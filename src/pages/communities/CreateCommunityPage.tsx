import * as React from "react";
import CreateCommunity from "../../components/community/CreateCommunity";

interface ICreateCommunityPageProps {}

const CreateCommunityPage: React.FunctionComponent<
  ICreateCommunityPageProps
> = () => {
  return (
    <div className="pt-20 sm:pt-0">
      <CreateCommunity />
    </div>
  );
};

export default CreateCommunityPage;
