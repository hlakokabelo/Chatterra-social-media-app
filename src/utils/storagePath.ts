export const getStoragePath = (url: string,isPost: boolean=true) => {

  const marker = isPost ? "/post-images/" : "/avatars/";
  const parsedUrl = new URL(url);

  const index = parsedUrl.pathname.indexOf(marker);

  if (index === -1) {
    throw new Error(`Invalid ${isPost ? "post" : "avatar"} image URL`);
  }

  return decodeURIComponent(
    parsedUrl.pathname.slice(index + marker.length),
  );
};