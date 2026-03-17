const validateName = (value: string, field: string): string => {
  if (value.includes(" ")) {
    return [field] + " cannot contain spaces.";
  }

  if (value.length < 3) {
    return [field] + " must be at least 3 characters.";
  }

  if (value.length > 20) {
    return [field] + " cannot exceed 20 characters.";
  }

  return "";
};

export const validateUsername = (value: string): string => {
  // Only letters, numbers, underscores
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(value)) {
    return "Only letters, numbers, and underscores are allowed.";
  }
  return validateName(value, "Username");
};

export const validateCommunityName = (value: string): string => {
  // Only letters, numbers, underscores
  const regex = /^[a-zA-Z0-9_-]+$/;
  if (!regex.test(value)) {
    return "Only letters, numbers, and underscores are allowed.";
  }
  return validateName(value, "community name");
};
