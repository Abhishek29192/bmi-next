import logger from "@bmi-digital/functions-logger";
import { YoutubeDetails } from "@bmi/firestore-types";
import { getFirestore } from "@bmi/functions-firestore";
import { youtube } from "googleapis/build/src/apis/youtube";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";

const { FIRESTORE_ROOT_COLLECTION, GOOGLE_YOUTUBE_API_KEY } = process.env;

const getYoutubeIdRef = (youtubeId: string) =>
  getFirestore().collection(FIRESTORE_ROOT_COLLECTION!).doc(youtubeId);

export const getById = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse | undefined> => {
  logger.info({ message: `Looking up cached details for ${youtubeId}` });
  const youtubeIdRef = getYoutubeIdRef(youtubeId);
  const doc = await youtubeIdRef.get();
  if (!doc.exists) {
    logger.info({ message: `Unable to find ${youtubeId} in the cache` });
    return undefined;
  }
  const data = doc.data();
  logger.info({
    message: `Found ${JSON.stringify(data)} for ${youtubeId} in the cache`
  });
  return data;
};

export const getYoutubeDetails = async (
  youtubeId: string
): Promise<YoutubeDetails | undefined> => {
  logger.info({ message: `Getting details for ${youtubeId} from YouTube` });
  const youtubeClient = youtube({
    version: "v3",
    auth: GOOGLE_YOUTUBE_API_KEY
  });
  const { data } = await youtubeClient.videos.list({
    part: ["snippet", "player", "status"],
    fields:
      "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
    id: [youtubeId],
    maxHeight: 9999
  });
  logger.info({
    message: `Received ${JSON.stringify(data)} for ${youtubeId} from YouTube`
  });

  if (!data.items?.length) {
    return undefined;
  }

  const { embedHeight, embedWidth } = data.items[0].player!;
  if (!embedHeight || !embedWidth) {
    return undefined;
  }

  return {
    uploadStatus: data.items[0].status!.uploadStatus!,
    thumbnails: data.items[0].snippet!.thumbnails!,
    embedWidth: parseFloat(embedWidth),
    embedHeight: parseFloat(embedHeight)
  };
};

export const saveById = async (
  youtubeId: string,
  youtubeDetails: YoutubeDetails
): Promise<void> => {
  logger.info({ message: `Saving details for ${youtubeId} into the cache` });
  const youtubeIdRef = getYoutubeIdRef(youtubeId);
  await youtubeIdRef.set(youtubeDetails);
  logger.info({ message: `Saved the details for ${youtubeId} into the cache` });
};
