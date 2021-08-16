import { google, youtube_v3 } from "googleapis";
import admin from "firebase-admin";
import { config } from "./config";

const youtube = google.youtube({
  version: "v3",
  auth: config.GOOGLE_YOUTUBE_API_KEY
});

admin.initializeApp({
  databaseURL: `https://${config.GCP_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

const collection = db.collection(config.FIRESTORE_ROOT_COLLECTION);

export const getById = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse | null> => {
  const youtubeIdRef = collection.doc(youtubeId);
  const doc = await youtubeIdRef.get();
  return doc.exists ? doc.data() : null;
};

export const getYoutubeDetails = async (
  youtubeId: string
): Promise<youtube_v3.Schema$VideoListResponse> => {
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
  const youtubeIdRef = collection.doc(youtubeId);
  await youtubeIdRef.set(youtubeDetails);
};
