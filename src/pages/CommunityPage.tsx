import * as React from "react";
import { useParams } from "react-router";
import CommunityDisplay from "../components/CommunityDisplay";

interface ICommunityPageProps {}

const CommunityPage: React.FunctionComponent<ICommunityPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-20 grid justify-evenly gap-y-[4rem]">
    
      <CommunityDisplay communityId={Number(id)} />
    </div>
  );
};

export default CommunityPage;
