import path from "path";
import { config as loadConfig } from "dotenv";

const { NODE_ENV = "development" } = process.env;

loadConfig({
  path: path.join(__dirname, "..", `.env.${NODE_ENV}`)
});

const {
  GCP_PROJECT_ID,
  GOOGLE_YOUTUBE_API_KEY,
  FIRESTORE_ROOT_COLLECTION,
  SECURITY_KEY
} = process.env;

export const config = {
  NODE_ENV,
  GCP_PROJECT_ID,
  GOOGLE_YOUTUBE_API_KEY,
  FIRESTORE_ROOT_COLLECTION,
  SECURITY_KEY
};
