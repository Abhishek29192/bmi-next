"use strict";

const { google } = require("googleapis");
const axios = require("axios");

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

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

const throwMissingEnvVariable = (name) => {
  throw new Error(`resolvers.ContentfulVideo: ${name} is missing.`);
};

const formatYoutubeDetails = (data) => {
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

module.exports = {
  videoRatio: {
    async resolve(source) {
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
        throw new Error(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_API_URL is missing."
        );
      }
      if (!YOUTUBE_CACHE_BEARER_TOKEN_SECRET) {
        throw new Error(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_BEARER_TOKEN_SECRET is missing."
        );
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
