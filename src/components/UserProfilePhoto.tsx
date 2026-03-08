import type { User } from "@supabase/supabase-js";
import * as React from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { routeBuilder } from "../utils/routes";

interface IUserProfilePhotoProps {
  user: User | null;
}

const UserProfilePhoto: React.FunctionComponent<IUserProfilePhotoProps> = ({
  user,
}) => {
  const { userProfile } = useAuth();
  return (
    <>
      {user && userProfile?.avatar_url && (
        <Link
          className="cursor-pointer flex"
          to={routeBuilder.user(userProfile?.username)}
        >
          <img
            src={userProfile?.avatar_url}
            className="w-8 h-8 rounded-full object-cover"
            alt="user Avatar"
          />
          <span className="text-gray-300  hover:text-amber-400">
            {userProfile?.username}
          </span>
        </Link>
      )}
    </>
  );
};

export default UserProfilePhoto;
