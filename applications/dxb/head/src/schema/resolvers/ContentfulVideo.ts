import { config } from "dotenv";
import { google, youtube_v3 } from "googleapis";
import fetch, { Response } from "node-fetch";
import { getYoutubeId } from "../../../../libraries/utils/src/youtube";
import { Node } from "./types/Gatsby";

config({
  path: `./.env.${process.env.NODE_ENV}`
});

const throwMissingEnvVariable = (name: string): never => {
  throw new Error(`resolvers.ContentfulVideo: ${name} is missing.`);
};

const formatYoutubeDetails = (data: youtube_v3.Schema$VideoListResponse) => {
  if (!data || !data.items.length) {
    return null;
  }

  const {
    player: { embedHeight, embedWidth }
  } = data.items[0];

  return {
    height: parseFloat(embedHeight),
    width: parseFloat(embedWidth)
  };
};

const getYoutubeDetails = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse> => {
  let numberOfRetries = 0;
  let response: Response;
  const url = `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${youtubeId}`;
  const headers = {
    Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
  };

  do {
    try {
      response = await fetch(url, {
        method: "GET",
        headers: headers
      });

      if (!response.ok) {
        console.error(`Failed to get details for YouTube video ${youtubeId}`);
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error(
        `Failed to get details for YouTube video ${youtubeId}`,
        error
      );
      return Promise.reject(error);
    }
    numberOfRetries++;
  } while (numberOfRetries < 5 && response.status === 429);

  return undefined;
};

export default {
  videoRatio: {
    async resolve(source: Node) {
      const {
        GOOGLE_YOUTUBE_API_KEY,
        ENABLE_YOUTUBE_CACHE,
        YOUTUBE_CACHE_API_URL,
        YOUTUBE_CACHE_BEARER_TOKEN_SECRET
      } = process.env;

      const youtubeId = getYoutubeId(source.youtubeId);

      const youtube = GOOGLE_YOUTUBE_API_KEY
        ? google.youtube({
            version: "v3",
            auth: GOOGLE_YOUTUBE_API_KEY
          })
        : null;

      if (ENABLE_YOUTUBE_CACHE !== "true") {
        if (!youtube) {
          if (process.env.NODE_ENV === "production") {
            throwMissingEnvVariable("GOOGLE_YOUTUBE_API_KEY");
          }

          return { height: 16, width: 9 };
        }

        const { data } = await youtube.videos.list({
          part: ["player"],
          id: [youtubeId],
          maxHeight: 9999
        });

        return formatYoutubeDetails(data);
      }

      if (!YOUTUBE_CACHE_API_URL) {
        throwMissingEnvVariable("YOUTUBE_CACHE_API_URL");
      }
      if (!YOUTUBE_CACHE_BEARER_TOKEN_SECRET) {
        throwMissingEnvVariable("YOUTUBE_CACHE_BEARER_TOKEN_SECRET");
      }

      const data = await getYoutubeDetails(youtubeId);
      if (!data) {
        throw new Error(
          `resolvers.ContentfulVideo: Could not find video ${youtubeId}.`
        );
      }
      return formatYoutubeDetails(data);
    }
  },
  youtubeId: {
    async resolve(source: Node) {
      return source.youtubeId.startsWith("https://")
        ? source.youtubeId
        : `https://www.youtube.com/watch?v=${source.youtubeId}`;
    }
  }
};
