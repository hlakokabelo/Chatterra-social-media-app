import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface ICreatePostProps {}

interface IPostInput {
  title: string;
  content: string;
  imageFile: File;
  avatar_url: string | null;
}
const createPost = async (post: IPostInput) => {
  //uploade image
  const { imageFile } = post;
  const filePath = `${post.title}--${Date.now()}--${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) return new Error(uploadError.message);

  //get imageUrl
  const { data: ImageData } = await supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  //upload post
  const { imageFile: _, ...payloadVariables } = post;
  let payload = {
    ...payloadVariables,
    image_url: ImageData.publicUrl,
  };

  const { data, error } = await supabase.from("posts").insert(payload);

  if (error) throw new Error(error.message);
  return data;
};

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const { user } = useAuth();
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const { mutate, status, isError, isPending } = useMutation({
    mutationFn: createPost,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (selectedFile)
      mutate({
        title,
        content,
        imageFile: selectedFile,
        avatar_url: user?.user_metadata.avatar_url || null,
      });
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>{" "}
        <input
          type="text"
          id="title"
          required
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
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setContent(e.target.value)}
        />{" "}
        <label className="block mb-2 font-medium" htmlFor="image">
          Upload image
        </label>
        <input
          id="image"
          type="file"
          required
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
