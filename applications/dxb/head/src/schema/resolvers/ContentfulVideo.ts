import { google } from "googleapis";
import fetchRetry from "@bmi/fetch-retry";
import { getYoutubeId } from "@bmi/utils";
import { getDefaultYoutubePreviewImage } from "./utils/getDefaultYoutubePreviewImage";
import resolveImage from "./ContentfulImage";
import type { ContentfulVideoData as VideoData } from "../../components/video/types";
import type { Video as ContentfulVideo } from "./types/Video";

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
    player: { embedHeight, embedWidth } = { embedHeight: "0", embedWidth: "0" }
  } = data.items[0] || {};

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

  const data = (await response.json()) as {
    embedWidth: number;
    embedHeight: number;
  };
  return { width: data.embedWidth, height: data.embedHeight };
};

const resolveVideo = async ({
  youtubeId,
  previewMedia,
  ...rest
}: ContentfulVideo): Promise<VideoData> => {
  return {
    ...rest,
    previewMedia: previewMedia ? resolveImage(previewMedia) : null,
    videoRatio: await getVideoRatio(youtubeId),
    videoUrl: youtubeId?.startsWith("https://")
      ? youtubeId
      : `https://www.youtube.com/watch?v=${youtubeId}`,
    defaultYouTubePreviewImage: await getDefaultYoutubePreviewImage(
      youtubeId ?? ""
    )
  };
};

const getVideoRatio = async (originalYoutubeId: string) => {
  const youtubeId = getYoutubeId(originalYoutubeId ?? "");

  if (process.env.ENABLE_YOUTUBE_CACHE === "true") {
    return await getYoutubeDetailsFromCache(youtubeId);
  }

  return await getYoutubeDetailsFromYoutube(youtubeId);
};

export default resolveVideo;
