export const getYoutubeId = (urlOrCode: string) => {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*/;
  const match = urlOrCode.match(regExp);
  return match && match.length > 0 ? match[1] : urlOrCode;
};
