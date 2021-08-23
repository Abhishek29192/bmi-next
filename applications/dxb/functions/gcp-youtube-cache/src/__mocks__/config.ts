export const config = {
  NODE_ENV: "test",
  GCP_PROJECT_ID: "test",
  FIRESTORE_ROOT_COLLECTION: "test",
  SECRET_MAN_GCP_PROJECT_NAME: "test"
};

export const getSecrets = async () => ({
  googleYoutubeApiKeySecret: "test",
  bearerTokenSecret: "test"
});
