import * as React from "react";
import { supabase } from "../../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { routeBuilder } from "../../utils/routes";
import Loading from "../Loading";
import { formatErrorMessage } from "../../utils/formatErrorMessage";

interface ICommunityListProps {}
export interface ICommunity {
  name: string;
  description: string;
  id: number;
  created_at: string;
}

export const fetchCommunities = async (): Promise<ICommunity[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error?.message);
  return data as ICommunity[];
};

const CommunityList: React.FunctionComponent<ICommunityListProps> = () => {
  const { data, error, isLoading } = useQuery<ICommunity[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (error) return <div className="text-center text-red-400">{formatErrorMessage(error.message)}</div>;
  return (
    <div className="max-w-5xl mx-auto px-4 space-y-4">
      {data?.map((community) => (
        <Link to={routeBuilder.community(community.id, community.name)}>
          <div
            key={community.id}
            className="p-5 m-4 rounded-xl border border-slate-700 bg-slate-900/60
        hover:bg-slate-900/80 hover:-translate-y-0.5
        transition-all duration-200"
          >
            <div className="text-xl font-semibold text-slate-200 hover:text-slate-100">
              {community.name}
            </div>

            {community.description && (
              <div className="text-slate-400 mt-2 text-sm leading-relaxed">
                {community.description}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommunityList;
