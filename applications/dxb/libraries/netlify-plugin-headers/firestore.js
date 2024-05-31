import firebase from "firebase-admin";

export const initialiseFirestore = () => {
  const credential = {
    type: "service_account",
    project_id: process.env.GLOBAL_GCP_PROJECT_ID || process.env.GCP_PROJECT_ID,
    private_key_id:
      process.env.GLOBAL_FIRESTORE_PRIVATE_KEY_ID ||
      process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: (
      process.env.GLOBAL_FIRESTORE_PRIVATE_KEY ||
      process.env.FIRESTORE_PRIVATE_KEY ||
      ""
    ).replace(/\\n/gm, "\n"),
    client_email:
      process.env.GLOBAL_FIRESTORE_CLIENT_EMAIL ||
      process.env.FIRESTORE_CLIENT_EMAIL,
    client_id:
      process.env.GLOBAL_FIRESTORE_CLIENT_ID || process.env.FIRESTORE_CLIENT_ID,
    auth_uri:
      process.env.GLOBAL_FIRESTORE_AUTH_URI || process.env.FIRESTORE_AUTH_URI,
    token_uri:
      process.env.GLOBAL_FIRESTORE_TOKEN_URI || process.env.FIRESTORE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.GLOBAL_FIRESTORE_AUTH_PROVIDER_X509_CERT_URL ||
      process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:
      process.env.GLOBAL_FIRESTORE_CLIENT_X509_CERT_URL ||
      process.env.FIRESTORE_CLIENT_X509_CERT_URL
  };

  const cfg = { credential: firebase.credential.cert(credential) };
  firebase.initializeApp(cfg);
  return firebase.firestore();
};
