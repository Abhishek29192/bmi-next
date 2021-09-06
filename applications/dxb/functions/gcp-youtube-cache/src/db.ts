import { google, youtube_v3 } from "googleapis";
import admin from "firebase-admin";
import { getSecrets, config } from "./config";

admin.initializeApp({
  databaseURL: `https://${config.GCP_PROJECT_ID}.firebaseio.com`
});

const getYoutubeIdRef = (youtubeId: string) =>
  admin.firestore().collection(config.FIRESTORE_ROOT_COLLECTION).doc(youtubeId);

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
  const config = await getSecrets();
  const youtube = google.youtube({
    version: "v3",
    auth: config.googleYoutubeApiKeySecret
  });
  const { data } = await youtube.videos.list({
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
