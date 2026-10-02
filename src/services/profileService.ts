  
import { supabase } from "../config/supabase-client";
import type { IUserProfile } from "../types/profile";
import { getStoragePath } from "../utils/storagePath";
  
  export const checkUsernameAvailability = async (name: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .ilike("username", name)
      .maybeSingle();

    return !data;
  };
  
export const upDateProfile = async (
  profile: IUserProfile,
  id: string | undefined,
  profilePic: File | null,
) => {
  if (!id) throw new Error("User ID is required");

  const oldAvatarUrl = profile.avatar_url;

  let newAvatarUrl = "";
  let newAvatarPath = "";

  if (profilePic) {
    newAvatarPath = `${id}/${Date.now()}-${profilePic.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newAvatarPath, profilePic);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(newAvatarPath);

    newAvatarUrl = data.publicUrl;
  }

  const updatedProfile = {
    ...profile,
    ...(newAvatarUrl && { avatar_url: newAvatarUrl }),
  };

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updatedProfile)
    .eq("id", id);

  if (updateError) {
    if (newAvatarPath) {
      await supabase.storage
        .from("avatars")
        .remove([newAvatarPath]);
    }

    throw updateError;
  }


  if (oldAvatarUrl && newAvatarUrl && oldAvatarUrl !== newAvatarUrl) {
     deleteProfileAvatar(oldAvatarUrl);
  }

  return updatedProfile;
};
const deleteProfileAvatar = async (avatarUrl: string) => {
  let path :string;

  try {
    path = getStoragePath(avatarUrl, false);
  } catch {
    return;
  }

  if (!path.trim()) return;

  await supabase.storage
    .from("avatars")
    .remove([path]);
};