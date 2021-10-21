export const randomPassword = (length: number = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return [...new Array(length)]
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join("");
};

export const sortByFirstName = (nodes) =>
  [...nodes].sort((a, b) => a.firstName?.localeCompare(b?.firstName));
