import type { User } from "@supabase/supabase-js";
import * as React from "react";
import { Link } from "react-router";

interface IUserProfilePhotoProps {
  user: User | null;
}

const UserProfilePhoto: React.FunctionComponent<IUserProfilePhotoProps> = ({
  user,
}) => {
  return (
    <>
      {user && user?.user_metadata?.avatar_url && (
        <Link className="cursor-pointer" to={"/profile"}>
          <img
            src={user.user_metadata.avatar_url}
            className="w-8 h-8 rounded-full object-cover"
            alt="user Avatar"
          />
        </Link>
      )}
    </>
  );
};

export default UserProfilePhoto;
