import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../supabase-client";
import { useAuth } from "../../context/AuthContext";
import { fetchCommunities, type ICommunity } from "../community/CommunityList";
import { useNavigate } from "react-router";
import { routeBuilder } from "../../utils/routes";

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
      navigate(routeBuilder.post(postId, title));
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-1 p-8 rounded-2xl 
  bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl"
    >
      <h2 className="text-4xl  font-bold mb-3 text-center bg-linear-to-r text-slate-200">
        Create New Post
      </h2>
      <p className="text-center text-red-400">{errorMessage}</p>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block font-medium text-gray-200">
          Title
        </label>

        <input
          type="text"
          value={title}
          disabled={!user}
          id="title"
          required
          maxLength={20}
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block font-medium text-gray-200">
          Content
        </label>

        <textarea
          id="content"
          rows={5}
          disabled={!user}
          value={content}
          required
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Community */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-200">Community</label>

        <select
          disabled={!user}
          className="w-full text-center rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          id="community"
          onChange={handleCommunityChange}
        >
          <option value="text-black">Choose a Community</option>

          {communities?.map((community, key) => (
            <option
              className="text-black text-start"
              key={key}
              value={community.id}
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-200" htmlFor="image">
          Upload Image
        </label>

        <input
          id="image"
          disabled={!user}
          type="file"
          accept="image/*"
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
      file:bg-cyan-700 file:text-white hover:file:bg-cyan-500
      transition"
          onChange={handleFileChange}
        />
      </div>

      {/* Button */}
      <button
        className="w-full py-3 mt-2 rounded-lg font-semibold text-white 
    bg-cyan-700
    hover:scale-[1.02] active:scale-[0.98] 
    transition-transform shadow-lg"
        type="submit"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-center text-red-400">Error creating post</p>
      )}
    </form>
  );
};

export default CreatePost;
