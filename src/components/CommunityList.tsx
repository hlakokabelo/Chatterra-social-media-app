import * as React from "react";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

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

  if (isLoading) return <div>Loading communities...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
