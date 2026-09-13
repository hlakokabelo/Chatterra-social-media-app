import { encodeId } from "./idEncoder";

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITIES: "/communities",
  CREATE_POST: "/create",
  CREATE_COMMUNITY: "/community/create",
  EDIT_PROFILE: "/edit-profile",
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "-") // turn apostrophes into hyphens
    .replace(/[^a-z0-9\s-]/g, "") // remove other special characters
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim hyphens from start/end

export const routeBuilder = {
  editPost: (id: number) => `/post/${encodeId(id)}/edit`,
  post: (id: number, title?: string) =>
    title ? `/post/${encodeId(id)}/${slugify(title)}` : `/post/${encodeId(id)}`,
  community: (id: number, title?: string) =>
    title
      ? `/c/${encodeId(id)}/${slugify(title)}`
      : `/c/${encodeId(id)}`,
  user: (username: string | undefined) => `/u/${username ? username : ""}`,
  hashComment: (postId: number, commentId: number) =>
    `/post/${encodeId(postId)}#comment-${encodeId(commentId)}`,
};
