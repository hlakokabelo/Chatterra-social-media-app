import * as React from "react";
import { supabase } from "../../supabase-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../Loading";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import { useAuth } from "../../context/AuthContext";
import DiscoverCommunities from "./DiscoverCommunities";
import MyCommunities from "./MyCommunitiesDisplay";

interface ICommunityListProps {}

export interface ICommunity {
  name: string;
  description: string;
  id: number;
  created_at: string;
}

export interface IMemberInfo {
  id: number;
  joined_at: string;
  name: string;
  role: string;
}

type TabType = "my-communities" | "discover";

const getUserCommunities = async (): Promise<IMemberInfo[]> => {
  const { error, data } = await supabase.rpc("get_user_communities");
  if (error) throw new Error(error?.message);
  return data as IMemberInfo[];
};

export const fetchCommunities = async (): Promise<ICommunity[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error?.message);
  return data as ICommunity[];
};

const joinCommunity = async ({
  communityId,
  userId,
}: {
  communityId: number;
  userId: string;
}) => {
  const { error, status, data } = await supabase
    .from("community_members")
    .insert({
      community_id: communityId,
      user_id: userId,
      role: "member",
      joined_at: new Date().toISOString(),
    });

  console.log({ status, data });
  if (error) throw new Error(error.message);
};

const leaveCommunity = async ({
  communityId,
  userId,
}: {
  communityId: number;
  userId: string;
}) => {
  const { error, status, data } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", userId);

  console.log({ status, data });
  if (error) throw new Error(error.message);
};

const CommunityList: React.FunctionComponent<ICommunityListProps> = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<TabType>("discover");

  const {
    data: communities,
    error,
    isLoading,
  } = useQuery<ICommunity[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { data: userCommunities } = useQuery<IMemberInfo[], Error>({
    queryKey: ["memberInfo", user?.id],
    queryFn: getUserCommunities,
    enabled: !!user,
  });

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberInfo", user?.id] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberInfo", user?.id] });
    },
  });


  const handleJoinCommunity = async (
    e: React.MouseEvent,
    communityId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    joinMutation.mutate({ communityId, userId: user.id });
  };

  const handleLeaveCommunity = async (
    e: React.MouseEvent,
    communityId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

      leaveMutation.mutate({ communityId, userId: user.id });
    
  };

  const myCommunities = React.useMemo(() => {
    if (!communities || !userCommunities) return [];
    return communities.filter((community) =>
      userCommunities.some((userComm) => userComm.id === community.id),
    );
  }, [communities, userCommunities]);

  const discoverCommunities = React.useMemo(() => {
    if (!communities || !userCommunities) return communities || [];
    return communities.filter(
      (community) =>
        !userCommunities.some((userComm) => userComm.id === community.id),
    );
  }, [communities, userCommunities]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-400">
        {formatErrorMessage(error.message)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Tabs */}
      {user && (
        <div className="flex gap-4 border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-2 px-4 font-medium transition-colors relative
              ${
                activeTab === "discover"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
          >
            Discover
            {discoverCommunities.length > 0 && activeTab !== "discover" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("my-communities")}
            className={`pb-2 px-4 font-medium transition-colors relative
              ${
                activeTab === "my-communities"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
          >
            My Communities
            <span className="ml-2 text-sm text-slate-500">
              ({myCommunities.length})
            </span>
          </button>
        </div>
      )}

      {/* Community Grid */}
      <div className="space-y-4">
        {!user && (
          <div className="text-center py-8 text-slate-400">
            Sign in to join communities
          </div>
        )}

        {activeTab === "my-communities" && (
          <>
            {myCommunities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                You haven't joined any communities yet.{" "}
                <button
                  onClick={() => setActiveTab("discover")}
                  className="text-emerald-400 hover:underline"
                >
                  Discover communities
                </button>
              </div>
            ) : (
              <MyCommunities
                communities={myCommunities}
                userCommunities={userCommunities || []}
                user={user}
                onLeaveCommunity={handleLeaveCommunity}
                onDiscoverClick={() => setActiveTab("discover")}
                isJoinPending={joinMutation.isPending}
                isLeavePending={leaveMutation.isPending}
              />
            )}
          </>
        )}

        {activeTab === "discover" && (
          <>
            {discoverCommunities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No new communities to discover!
              </div>
            ) : (
              <DiscoverCommunities
                communities={discoverCommunities}
                user={user}
                onJoinCommunity={handleJoinCommunity}
                isJoinPending={joinMutation.isPending}
                isLeavePending={leaveMutation.isPending}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityList;
