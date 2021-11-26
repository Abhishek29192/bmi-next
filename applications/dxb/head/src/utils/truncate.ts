export const truncate = (
  string: string,
  length: number,
  truncateSymbol: string = "..."
): string => {
  if (string.length >= length) {
    return `${string.substring(0, length - 1)}${truncateSymbol}`;
  } else {
    return string;
  }
};
