import fetch from "node-fetch";
import { getYoutubeId } from "../../../../../libraries/utils/src/index";

export const getDefaultYoutubePreviewImage = async (youtubeId: string) => {
  const baseUrl = `https://i.ytimg.com/vi/${getYoutubeId(youtubeId).trim()}`;
  const listOfImages = [
    `${baseUrl}/maxresdefault.jpg`,
    `${baseUrl}/hqdefault.jpg`,
    `${baseUrl}/mqdefault.jpg`,
    `${baseUrl}/sqdefault.jpg`,
    `${baseUrl}/default.jpg`
  ];

  let validUrl = "";

  for (const imageUrl of listOfImages) {
    try {
      const res = await fetch(imageUrl);
      if (res.status === 200) {
        validUrl = imageUrl;
        break;
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  return validUrl;
};
