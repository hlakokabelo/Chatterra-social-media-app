import type { User } from "@supabase/supabase-js";
import * as React from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

interface IUserProfilePhotoProps {
  user: User | null;
}

const UserProfilePhoto: React.FunctionComponent<IUserProfilePhotoProps> = ({
  user,
}) => {
  const { userProfile } = useAuth();
  return (
    <>
      {user && user?.user_metadata?.avatar_url && (
        <Link
          className="cursor-pointer flex md:hidden absolute right-6"
    to={"/profile"}
        >
          <img
            src={user.user_metadata.avatar_url}
            className="w-8 h-8 rounded-full object-cover"
            alt="user Avatar"
          />
          <span className="text-gray-300">{userProfile?.username}</span>
        </Link>
      )}
    </>
  );
};

export default UserProfilePhoto;
