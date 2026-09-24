
export interface IPost {
  id: number;
  title: string;
  content: string;
  image_urls: string[];
  avatar_url: string | null;
  created_at: string;
  comment_count?: number;
  like_count?: number;
  user_id?: string;
  username?: string;
  community_name?: string;
  edited?: boolean;
  is_deleted?: boolean;
}
export interface IPostInput {
  title: string;
  content: string;
  imageFiles: File[];
  avatar_url: string | null;
  community_id?: number | null;
  user_id?: string | null;
}