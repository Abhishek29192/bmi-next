export const truncate = (
  string: string,
  maxLength: number,
  truncateSymbol = "..."
): string => {
  if (string.length >= maxLength) {
    return `${string.substring(0, maxLength - 1)}${truncateSymbol}`;
  } else {
    return string;
  }
};
