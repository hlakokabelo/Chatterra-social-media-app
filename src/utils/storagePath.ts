export const getStoragePath = (url: string) => {
  const marker = "/post-images/";
  const parsedUrl = new URL(url);

  const index = parsedUrl.pathname.indexOf(marker);

  if (index === -1) {
    throw new Error("Invalid post image URL");
  }

  return decodeURIComponent(
    parsedUrl.pathname.slice(index + marker.length),
  );
};