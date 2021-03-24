"use strict";

const { google } = require("googleapis");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const { GOOGLE_YOUTUBE_API_KEY } = process.env;

const youtube = google.youtube({
  version: "v3",
  auth: GOOGLE_YOUTUBE_API_KEY
});

module.exports = {
  videoRatio: {
    async resolve(source) {
      const { data } = await youtube.videos.list({
        part: ["player"],
        id: [source.youtubeId],
        maxHeight: 9999
      });

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
    }
  }
};
