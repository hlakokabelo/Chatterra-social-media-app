import { supabase } from "../config/supabase-client";
import type { IPost, IPostInput } from "../types/post";
import { getStoragePath } from "../utils/storagePath";

export type IPostCommunity = IPost & {
  community_name: string;
  community_id: number;
};


export const createPost = async (post: IPostInput) => {
  const image_urls: string[] = [];

  for (const imageFile of post.imageFiles) {
    const filePath = `${crypto.randomUUID()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: imageData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    image_urls.push(imageData.publicUrl);
  }

  const { imageFiles: _, ...payloadVariables } = post;

  const payload = {
    ...payloadVariables,
    image_urls,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  submitVote(1, data.id, false);
  return data;
};

export const fetchPostById = async (id: number): Promise<IPostCommunity> => {
  const { data, error } = await supabase.rpc("get_posts_with_post_id", {
    p_post_id: id,
  });

  if (error) throw new Error(error.message);

  return data[0] as IPostCommunity;
};

export const submitVote = async (
  voteValue: number,
  itemIdValue: number,
  isComment: boolean,
) => {
  const functionName = isComment ? "submit_comment_vote" : "submit_post_vote";

  const params = isComment
    ? {
        c_comment_id: itemIdValue,
        c_vote: voteValue,
      }
    : {
        p_post_id: itemIdValue,
        p_vote: voteValue,
      };

  const { error } = await supabase.rpc(functionName, params);

  if (error) throw new Error(error.message);
};

export const deletePost = async (image_urls: string[],id:number) => {

  await deletePostImages(image_urls);
  const { error } = await supabase.rpc("delete_post", {
    p_post_id: id,
  });

  if (error) throw new Error(error.message);
};


const deletePostImages = async (imageUrls: string[]) => {
  const paths = imageUrls
    .map((url) => {
      try {
        return getStoragePath(url);
      } catch {
        return null;
      }
    })
    .filter((path): path is string => path !== null);

  if (!paths.length) return;

  const { error } = await supabase.storage
    .from("post-images")
    .remove(paths);

  if (error) throw error;
};


export const fetchUserPosts = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_posts_with_user_id", {
    p_user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

