import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

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
      navigate("/communities");
    },
  });

  const handleOnSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (user) return mutate({ name, description, user_id: user?.id });
    setErrorMessage("Log in to create community");
  };
  return (
    <form onSubmit={handleOnSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <p className="text-center text-red-500">{errorMessage}</p>

      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          disabled={!user}
          type="text"
          id="name"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          disabled={!user}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating Community..." : "Create Community"}
      </button>
      {isError && <p className="text-red-500">Error creating community</p>}
    </form>
  );
};

export default CreateCommunity;
