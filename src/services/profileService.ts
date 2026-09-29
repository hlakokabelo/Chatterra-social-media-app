  
import { supabase } from "../config/supabase-client";
import type { IUserProfile } from "../types/profile";
  
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
    let image_url = "";
    if (profilePic) {
      const filePath = `${profilePic.name}-4-4-${Date.now()}-3-3-${profilePic.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, profilePic);
  
      if (uploadError) return new Error(uploadError.message);
  
      //get imageUrl
      const { data: ImageData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      image_url = ImageData.publicUrl;
    }
    if (image_url !== "") profile.avatar_url = image_url;
    await supabase.from("profiles").update(profile).eq("id", id);
  };