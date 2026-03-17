import * as React from "react";
import { Link } from "react-router";
import { routeBuilder } from "../../utils/routes";
import type { ICommunity, IMemberInfo } from "./CommunityList";

interface IMyCommunitiesProps {
  communities: ICommunity[];
  userCommunities: IMemberInfo[];
  user: any; // Replace 'any' with your User type
  onLeaveCommunity: (e: React.MouseEvent, communityId: number) => void;
  onDiscoverClick: () => void;
  isJoinPending: boolean;
  isLeavePending: boolean;
}

const MyCommunities: React.FunctionComponent<IMyCommunitiesProps> = ({ 
  communities, 
  userCommunities,
  user, 
  onLeaveCommunity,
  onDiscoverClick,
  isJoinPending,
  isLeavePending 
}) => {
  const isPending = isJoinPending || isLeavePending;

  if (communities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        You haven't joined any communities yet.{' '}
        <button 
          onClick={onDiscoverClick}
          className="text-emerald-400 hover:underline"
        >
          Discover communities
        </button>
      </div>
    );
  }

  return (
    <>
      {communities.map((community) => {
        const userCommunity = userCommunities.find(uc => uc.id === community.id);
        
        return (
          <div key={community.id}>
            <Link to={routeBuilder.community(community.id, community.name)}>
              <div
                className="p-5 m-4 rounded-xl border border-slate-700 bg-slate-900/60
                  hover:bg-slate-900/80 hover:-translate-y-0.5
                  transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-semibold text-slate-200 hover:text-slate-100">
                      {community.name}
                    </div>
                    {userCommunity?.role && (
                      <span className="text-xs text-slate-500 mt-1 inline-block">
                        Role: {userCommunity.role}
                      </span>
                    )}
                  </div>

                  {user && (
                    <button
                      onClick={(e) => onLeaveCommunity(e, community.id)}
                      disabled={isPending}
                      className="px-3 py-1 text-sm bg-red-600/20 text-red-400 
                        rounded-lg hover:bg-red-600/30 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLeavePending ? "Leaving..." : "Leave"}
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
        );
      })}
    </>
  );
};

export default MyCommunities;