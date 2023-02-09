import { config } from "dotenv";
import { google } from "googleapis";
import fetchRetry from "../../../../libraries/fetch-retry/src/index";
import { getYoutubeId } from "../../../../libraries/utils/src/youtube";
import { Node } from "./types/Gatsby";
import { getDefaultYoutubePreviewImage } from "./utils/getDefaultYoutubePreviewImage";

config({
  path: `./.env.${process.env.NODE_ENV}`
});

const verifyEnvVariable = (name: string) => {
  // eslint-disable-next-line security/detect-object-injection
  if (!process.env[name]) {
    throw new Error(`resolvers.ContentfulVideo: ${name} is missing.`);
  }
};

const getYoutubeDetailsFromYoutube = async (
  youtubeId: string
): Promise<{ height: number; width: number } | null> => {
  verifyEnvVariable("GOOGLE_YOUTUBE_API_KEY");

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_YOUTUBE_API_KEY
  });

  const { data } = await youtube.videos.list({
    part: ["snippet", "player", "status"],
    fields:
      "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
    id: [youtubeId],
    maxHeight: 9999
  });

  if (!data?.items?.length) {
    return null;
  }

  const {
    player: { embedHeight, embedWidth }
  } = data.items[0];

  if (!embedHeight || !embedWidth) {
    return null;
  }

  return {
    height: parseFloat(embedHeight),
    width: parseFloat(embedWidth)
  };
};

const getYoutubeDetailsFromCache = async (youtubeId: string) => {
  verifyEnvVariable("YOUTUBE_CACHE_API_URL");
  verifyEnvVariable("YOUTUBE_CACHE_BEARER_TOKEN_SECRET");

  const response = await fetchRetry(
    `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${youtubeId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
      }
    }
  );

  const data = await response.json();
  return { width: data.embedWidth, height: data.embedHeight };
};

export default {
  videoRatio: {
    async resolve(source: Node) {
      const youtubeId = getYoutubeId(source.youtubeId);

      if (process.env.ENABLE_YOUTUBE_CACHE === "true") {
        return await getYoutubeDetailsFromCache(youtubeId);
      }

      return await getYoutubeDetailsFromYoutube(youtubeId);
    }
  },
  youtubeId: {
    async resolve(source: Node) {
      return source.youtubeId.startsWith("https://")
        ? source.youtubeId
        : `https://www.youtube.com/watch?v=${source.youtubeId}`;
    }
  },
  defaultYouTubePreviewImage: {
    async resolve(source: Node) {
      return await getDefaultYoutubePreviewImage(source.youtubeId);
    }
  }
};
