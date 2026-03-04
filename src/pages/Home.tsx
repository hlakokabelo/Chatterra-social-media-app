import * as React from "react";
import PostList from "../components/PostList";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import type { User } from "@supabase/supabase-js";

interface IHomeProps {}

const handleOAuthProfile = async(user: User | null) => {
  alert("mutate");
  console.log(user?.id);
  if (!user) return;

  const meta = user.user_metadata ?? {};

  const username =
    meta.preferred_username ||
    meta.user_name ||
    meta.name?.toLowerCase().replace(/\s+/g, "") ||
    user.email?.split("@")[0] ||
    `user_${user.id.slice(0, 8)}`;

  const display_name = meta.full_name || meta.name || username;

  const avatar_url = meta.avatar_url || meta.picture || null;

  const profile = {
    username: username + "_" + Math.floor(Math.random() * 1000),
    display_name,
    avatar_url,
  };

  const res=await supabase.from("profiles").update(profile).eq("id", user.id);
  console.log(res)
};

const Home: React.FunctionComponent<IHomeProps> = () => {
  const { user } = useAuth();

  console.log(user);
  return (
    <div className="">
      <h2 className="text-4xl font-bold mb-6 text-center bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text">
        Recent Posts
      </h2>

      <div>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
