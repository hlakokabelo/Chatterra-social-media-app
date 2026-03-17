import * as React from "react";
import { Link } from "react-router";
import { routeBuilder } from "../../utils/routes";
import type { ICommunity } from "./CommunityList";

interface IDiscoverCommunitiesProps {
  communities: ICommunity[];
  user: any; // Replace 'any' with your User type
  onJoinCommunity: (e: React.MouseEvent, communityId: number) => void;
  isJoinPending: boolean;
  isLeavePending: boolean;
}

const DiscoverCommunities: React.FunctionComponent<IDiscoverCommunitiesProps> = ({ 
  communities, 
  user, 
  onJoinCommunity,
  isJoinPending,
  isLeavePending 
}) => {
  const isPending = isJoinPending || isLeavePending;

  if (communities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No communities to discover!
      </div>
    );
  }

  return (
    <>
      {communities.map((community) => (
        <div key={community.id}>
          <Link to={routeBuilder.community(community.id, community.name)}>
            <div
              className="p-5 m-4 rounded-xl border border-slate-700 bg-slate-900/60
                hover:bg-slate-900/80 hover:-translate-y-0.5
                transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-slate-200 hover:text-slate-100">
                  {community.name}
                </div>

                {user && (
                  <button
                    onClick={(e) => onJoinCommunity(e, community.id)}
                    disabled={isPending}
                    className="px-3 py-1 text-sm bg-emerald-600/20 text-emerald-400 
                      rounded-lg hover:bg-emerald-600/30 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isJoinPending ? "Joining..." : "Join"}
                  </button>
                )}
              </div>

              {community.description && (
                <div className="text-slate-400 mt-2 text-sm leading-relaxed">
                  {community.description}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default DiscoverCommunities;