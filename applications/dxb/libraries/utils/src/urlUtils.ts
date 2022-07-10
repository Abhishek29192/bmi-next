export const generateUrl = (urlParts: string[]): string => {
  return urlParts
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/_+/g, "-")
        .replace(/\/+/g, "-")
        .replace(/[^.,\s\p{L}\p{Nd}-]/gu, "")
        .replace(/\.+/g, "-")
        .replace(/,+/g, "-")
    )
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
};
