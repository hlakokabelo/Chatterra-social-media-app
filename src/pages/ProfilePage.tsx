import * as React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface IProfilePageProps {}

interface IUserProfile {
  bio: string;
  username: string;
  display_name: string;
}
const upDateProfile = async (profile: IUserProfile, id: string | undefined) => {
  await supabase.from("profiles").update(profile).eq("id", id);
};

const reFetchProfile = async (getProfile: any) => {
  getProfile();
};

const ProfilePage: React.FunctionComponent<IProfilePageProps> = () => {
  const { user, userProfile, getProfile } = useAuth();
  const [editing, setEditing] = React.useState<boolean>(false);
  // const [password, setPassword] = React.useState<string>("-------");
  const [display_name, setDisplayName] = React.useState<string>("-------");
  const [bio, setBio] = React.useState<string>("my bio");
  const [username, setUsername] = React.useState<string>("");
  const [infoEdited, setInfoEdited] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name);
      setBio(userProfile.bio);
      setUsername(userProfile.username);
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: (profile: IUserProfile) => {
      return upDateProfile(profile, userProfile?.id);
    },
    onSuccess: () => reFetchProfile(getProfile),
  });

  const validateUsername = (value: string): string => {
    // Only letters, numbers, underscores
    const regex = /^[a-zA-Z0-9_]+$/;

    if (value.includes(" ")) {
      return "Username cannot contain spaces.";
    }

    if (!regex.test(value)) {
      return "Only letters, numbers, and underscores are allowed.";
    }

    if (value.length < 3) {
      return "Username must be at least 3 characters.";
    }

    if (value.length > 20) {
      return "Username cannot exceed 20 characters.";
    }

    return "";
  };

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error !== "") return;

    if (infoEdited) {
      const profile: IUserProfile = {
        bio,
        username,
        display_name,
      };

      console.log(profile);
      mutate(profile);
    }
    setEditing((prev) => !prev);
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.id;
    const value = e.target.value;
    setInfoEdited(true);
    switch (name) {
      case "username":
        setUsername(value);
        setError(validateUsername(value));
        break;
      case "bio":
        setBio(value);
        break;
      case "display_name":
        setDisplayName(value);
        break;
      /*    case "password":
        setPassword(value);
        break;
    */
    }
  };
  if (!user) return <Navigate to="/" />;

  return (
    <div className="flex justify-center">
      <div className="w-[70%] md:w-[50%] bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
        {/*  */}
        <form className="justify-center gap-16 " onSubmit={onSubmitForm}>
          <div>
            <div>
              <label className="text-sm text-zinc-400" htmlFor="username">
                username:
              </label>
              <input
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
                type="text"
                id="username"
                value={username}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400" htmlFor="display_name">
                Display name:
              </label>
              <input
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
                type="text"
                id="display_name"
                value={display_name}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400" htmlFor="bio">
                bio
              </label>
              <textarea
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
                rows={3}
                id="bio"
                value={bio}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            {/* <div>
              <label className="text-sm text-zinc-400" htmlFor="password">
                Password
              </label>
              <input
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
                type="password"
                id="password"
                value={password}
                onChange={(e) => handleOnChange(e)}
              />
            </div> */}
          </div>

          <div>
            <div className="flex justify-center mt-4">
              {!editing && (
                <div
                  onClick={() => setEditing((prev) => !prev)}
                  className=" text-center h-[12%] mt-4 bg-purple-600 hover:bg-purple-800 cursor-pointer text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Edit
                </div>
              )}
              {editing && (
                <input
                  type="submit"
                  className=" text-center mt-4 h-[12%] bg-purple-600 hover:bg-purple-800 cursor-pointer text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={"Submit"}
                />
              )}
            </div>
          </div>
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
