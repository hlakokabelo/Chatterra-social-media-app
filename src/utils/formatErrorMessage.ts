export const formatErrorMessage = (message: string) => {
  if (message.includes("Failed to fetch"))
    return "Network error";

  return "";
};
