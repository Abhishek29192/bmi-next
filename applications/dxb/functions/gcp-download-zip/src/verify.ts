const hostRegex = "^(.*:)//([A-Za-z0-9-.]+)(:[0-9]+)?(.*)$";

export const verifyOrigins = (
  urls: string[],
  allowedOrigins: string[]
): boolean => {
  if (!allowedOrigins || !allowedOrigins.length) {
    return true;
  }
  for (const url of urls) {
    const match = url.match(hostRegex);
    const host = match?.[2];
    if (!host || !allowedOrigins.includes(host)) {
      return false;
    }
  }
  return true;
};
