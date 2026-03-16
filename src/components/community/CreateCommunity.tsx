import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/routes";

interface ICreateCommunityProps {}

interface ICommunity {
  name: string;
  description: string;
  user_id: string;
}

const createCommunity = async (community: ICommunity) => {
  const { error } = await supabase.from("communities").insert(community);

  if (error) throw new Error(error.message);
};
const CreateCommunity: React.FunctionComponent<ICreateCommunityProps> = () => {
  const { user } = useAuth();
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>(
    user ? "" : "Log in to create community",
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate(ROUTES.COMMUNITIES);
    },
  });

  const handleOnSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (user) return mutate({ name, description, user_id: user?.id });
    setErrorMessage("Log in to create community");
  };
  return (
    <form
      onSubmit={handleOnSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 p-8 rounded-2xl
  bg-slate-900/60 backdrop-blur-md border border-slate-600/60 shadow-xl"
    >
      <h2 className="text-4xl font-bold text-center  text-slate-300 bg-clip-text ">
        Create New Community
      </h2>

      <p className="text-center text-red-400">{errorMessage}</p>

      {/* Community Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium text-gray-200">
          Community Name
        </label>

        <input
          disabled={!user}
          type="text"
          id="name"
          value={name}
          maxLength={20}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2
      focus:outline-none focus:ring-2 focus:ring-cyan-900 transition"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block font-medium text-gray-200"
        >
          Description
        </label>

        <textarea
          disabled={!user}
          id="description"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2
      focus:outline-none focus:ring-2 focus:ring-cyan-900 transition resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold text-white
    bg-cyan-900/65
    hover:scale-[1.02] active:scale-[0.98]
    transition-transform shadow-lg cursor-pointer"
      >
        {isPending ? "Creating Community..." : "Create Community"}
      </button>

      {isError && (
        <p className="text-center text-red-400">Error creating community</p>
      )}
    </form>
  );
};

export default CreateCommunity;
