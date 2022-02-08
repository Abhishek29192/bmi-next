import { getSecret } from "@bmi/functions-secret-client";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import { youtube } from "googleapis/build/src/apis/youtube";
import { getFirestore } from "@bmi/functions-firestore";

const { FIRESTORE_ROOT_COLLECTION, GOOGLE_YOUTUBE_API_KEY_SECRET } =
  process.env;

const getYoutubeIdRef = (youtubeId: string) =>
  getFirestore().collection(FIRESTORE_ROOT_COLLECTION!).doc(youtubeId);

export const getById = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse | undefined> => {
  const youtubeIdRef = getYoutubeIdRef(youtubeId);
  const doc = await youtubeIdRef.get();
  return doc.exists ? doc.data() : undefined;
};

export const getYoutubeDetails = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse> => {
  const youtubeClient = youtube({
    version: "v3",
    auth: await getSecret(GOOGLE_YOUTUBE_API_KEY_SECRET!)
  });
  const { data } = await youtubeClient.videos.list({
    part: ["player"],
    id: [youtubeId],
    maxHeight: 9999
  });
  return data;
};

export const saveById = async (
  youtubeId: string,
  youtubeDetails: youtube_v3.Schema$VideoListResponse
): Promise<void> => {
  const youtubeIdRef = getYoutubeIdRef(youtubeId);
  await youtubeIdRef.set(youtubeDetails);
};
