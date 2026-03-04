import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type ICommunity } from "./CommunityList";
import { useNavigate } from "react-router";

interface ICreatePostProps {}
let postId: number = 0;
interface IPostInput {
  title: string;
  content: string;
  imageFile: File | null;
  avatar_url: string | null;
  community_id?: number | null;
  user_id?: string | null;
}
const createPost = async (post: IPostInput) => {
  //uploade image
  const { imageFile } = post;
  let image_url: string | null = "";
  if (imageFile) {
    const filePath = `${post.title}--${Date.now()}--${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) return new Error(uploadError.message);

    //get imageUrl
    const { data: ImageData } = await supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);
    image_url = ImageData.publicUrl;
  }
  //upload post
  if (image_url === "") image_url = null;
  
  const { imageFile: _, ...payloadVariables } = post;
  let payload = {
    ...payloadVariables,
    image_url: image_url,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  postId = data.id;
  return data;
};

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const { user } = useAuth();
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>(
    user ? "" : "Log in to create post",
  );

  const navigate = useNavigate();
  const clearForm = (): void => {
    setTitle("");
    setContent("");
    setSelectedFile(null);
  };
  /** Community functionality*/
  const [communityId, setCommunityId] = React.useState<number | null>(null);

  const { data: communities } = useQuery<ICommunity[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const { mutate, isError, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      clearForm();
      navigate("/post/" + postId);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!user) return setErrorMessage("Log in to create post");

    return mutate({
      title,
      content,
      imageFile: selectedFile,
      avatar_url: user?.user_metadata.avatar_url || null,
      community_id: communityId,
      user_id: user.id,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <p className="text-center text-red-500">{errorMessage}</p>

      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>{" "}
        <input
          type="text"
          value={title}
          disabled={!user}
          id="title"
          required
          maxLength={20}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setTitle(e.target.value)}
        />{" "}
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          rows={5}
          disabled={!user}
          value={content}
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setContent(e.target.value)}
        />{" "}
        <div>
          <select
            disabled={!user}
            className="w-[14rem] px-4 py-2 text-center rounded-xl border border-gray-300 
       text-gray-800 
         focus:outline-none mb-2.5 mt-2.5  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         transition duration-200 ease-in-out
         shadow-sm"
            id="community"
            onChange={handleCommunityChange}
          >
            <option className="" value={""}>
              {" "}
              Choose a Community{" "}
            </option>

            {communities?.map((community, key) => (
              <option className="min-w-[4px]" key={key} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>
        <label className="block mb-2 font-medium" htmlFor="image">
          Upload image
        </label>
        <input
          id="image"
          disabled={!user}
          type="file"
          accept="image/*"
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={handleFileChange}
        />
      </div>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
        type="submit"
      >
        {isPending ? "Creating" : "Create Post"}
      </button>
      {isError && <p className="text-red-500">Error creating post</p>}
    </form>
  );
};

export default CreatePost;
