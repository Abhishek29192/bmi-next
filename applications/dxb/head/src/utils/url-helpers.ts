export const getValidHttpUrl = (url: string): string => {
  try {
    return new URL(url).href;
  } catch (error) {
    throw new Error(`Not valid url: ${url}`);
  }
};
