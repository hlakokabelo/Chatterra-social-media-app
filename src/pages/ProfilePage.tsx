import * as React from "react";

interface IProfilePageProps {}

const ProfilePage: React.FunctionComponent<IProfilePageProps> = () => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("password");
  const [name, setName] = React.useState<string>("name");
  const [surname, setSurname] = React.useState<string>("surname");
  const [bio, setBio] = React.useState<string>("my bio");
  const [username, setUsername] = React.useState<string>("kabelo.bbk");
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
        {/*  */}
        <form className="flex flex-col">
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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400" htmlFor="name">
              Name:
            </label>
            <input
              disabled={!editing}
              className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400" htmlFor="surname">
              Surname:
            </label>
            <input
              disabled={!editing}
              className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
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
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400" htmlFor="password">
              Password
            </label>
            <input
              disabled={!editing}
              className={`mt-1 w-full px-4 py-2 ${editing ? "bg-zinc-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : "border border-blue-500 rounded-2xl"}`}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <div
              onClick={() => setEditing((prev) => !prev)}
              className=" text-center mt-4 w-[50%] bg-purple-600 hover:bg-purple-800 cursor-pointer text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {editing ? "Submit" : "Edit profile"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
