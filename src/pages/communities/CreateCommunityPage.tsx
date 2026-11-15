import * as React from "react";
import CreateCommunity from "../../components/community/CreateCommunity";
import { usePageTitle } from "../../hooks/usePageTitle";

const CreateCommunityPage: React.FunctionComponent = () => {
  usePageTitle("Submit to Chatterra");
  return (
    <div className="pt-20 sm:pt-0">
      <CreateCommunity />
    </div>
  );
};

export default CreateCommunityPage;
