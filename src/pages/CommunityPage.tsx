import * as React from "react";
import { useParams } from "react-router";
import CommunityDisplay from "../components/community/CommunityDisplay";
import { decodeId } from "../utils/idEncoder";

interface ICommunityPageProps {}

const CommunityPage: React.FunctionComponent<ICommunityPageProps> = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  return (
    <div className="grid justify-evenly gap-y-[4rem]">
      {id && (
        <CommunityDisplay communityId={Number(decodeId(id))} slug={slug} />
      )}
    </div>
  );
};

export default CommunityPage;
