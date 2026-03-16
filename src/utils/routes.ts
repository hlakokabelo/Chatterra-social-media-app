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
  post: (id: number | string, title?: string) =>
    title ? `/post/${id}/${slugify(title)}` : `/post/${id}`,
  community: (id: number, title?: string) =>
    title ? `/community/${id}/${slugify(title)}` : `/community/${id}`,
  user: (username: string | undefined) => `/user/${username ? username : ""}`,
  hashComment: (postId: number, commentId: number) =>
    `/post/${postId}#comment-${commentId}`,
};
