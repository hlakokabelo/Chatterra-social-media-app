import * as React from "react";
import { useParams } from "react-router";
import CommunityDisplay from "../../components/community/CommunityDisplay";
import { decodeId } from "../../utils/idEncoder";
import { useEffect } from "react";

const CommunityPage: React.FunctionComponent = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="grid justify-evenly gap-y-16">
      {id && (
        <CommunityDisplay communityId={Number(decodeId(id))} slug={slug} />
      )}
    </div>
  );
};

export default CommunityPage;
