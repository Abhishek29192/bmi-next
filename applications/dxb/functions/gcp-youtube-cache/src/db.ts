import logger from "@bmi-digital/functions-logger";
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
): Promise<youtube_v3.Schema$VideoListResponse> => {
  logger.info({ message: `Getting details for ${youtubeId} from YouTube` });
  const youtubeClient = youtube({
    version: "v3",
    auth: GOOGLE_YOUTUBE_API_KEY
  });
  const { data } = await youtubeClient.videos.list({
    part: ["player"],
    id: [youtubeId],
    maxHeight: 9999
  });
  logger.info({
    message: `Receivede ${JSON.stringify(data)} for ${youtubeId} from YouTube`
  });
  return data;
};

export const saveById = async (
  youtubeId: string,
  youtubeDetails: youtube_v3.Schema$VideoListResponse
): Promise<void> => {
  logger.info({ message: `Saving details for ${youtubeId} into the cache` });
  const youtubeIdRef = getYoutubeIdRef(youtubeId);
  await youtubeIdRef.set(youtubeDetails);
  logger.info({ message: `Saved the details for ${youtubeId} into the cache` });
};
