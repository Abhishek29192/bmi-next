import { google, youtube_v3 } from "googleapis";
import { config } from "dotenv";
import axios from "axios";
import { Node } from "./types";

config({
  path: `./.env.${process.env.NODE_ENV}`
});

const throwMissingEnvVariable = (name: string) => {
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

export default {
  videoRatio: {
    async resolve(source: Node) {
      const {
        GOOGLE_YOUTUBE_API_KEY,
        ENABLE_YOUTUBE_CACHE,
        YOUTUBE_CACHE_API_URL,
        YOUTUBE_CACHE_BEARER_TOKEN_SECRET
      } = process.env;

      const youtube = GOOGLE_YOUTUBE_API_KEY
        ? google.youtube({
            version: "v3",
            auth: GOOGLE_YOUTUBE_API_KEY
          })
        : null;

      if (!ENABLE_YOUTUBE_CACHE) {
        if (!youtube) {
          if (process.env.NODE_ENV === "production") {
            return throwMissingEnvVariable("GOOGLE_YOUTUBE_API_KEY");
          }

          return { height: 16, width: 9 };
        }

        const { data } = await youtube.videos.list({
          part: ["player"],
          id: [source.youtubeId],
          maxHeight: 9999
        });

        return formatYoutubeDetails(data);
      }

      if (!YOUTUBE_CACHE_API_URL) {
        return throwMissingEnvVariable("YOUTUBE_CACHE_API_URL");
      }
      if (!YOUTUBE_CACHE_BEARER_TOKEN_SECRET) {
        return throwMissingEnvVariable("YOUTUBE_CACHE_BEARER_TOKEN_SECRET");
      }

      const url = `${YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}`;
      const options = {
        headers: {
          Authorization: `Bearer ${YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
        }
      };
      const { data } = await axios.get(url, options);

      return formatYoutubeDetails(data);
    }
  }
};
