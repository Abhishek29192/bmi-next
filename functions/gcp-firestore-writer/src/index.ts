import type { HandlerFunction } from "@google-cloud/functions-framework/build/src/functions";
import { config } from "dotenv";
import admin from "firebase-admin";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

// TODO: I think these should start with "/", but was easier for them not to
const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products"
};

admin.initializeApp({
  credential: admin.credential.cert({
    // @ts-ignore 'type' does not exist in type 'ServiceAccount'.
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.FIRESTORE_CLIENT_EMAIL,
    client_id: process.env.FIRESTORE_CLIENT_ID,
    auth_uri: process.env.FIRESTORE_AUTH_URI,
    token_uri: process.env.FIRESTORE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIRESTORE_CLIENT_X509_CERT_URL
  }),
  databaseURL: "https://dxb-development.firebaseio.com"
});

const db = admin.firestore();

// TODO: This is batched, functions can be consolidated
const setItemsInFirestore = async (collectionPath: string, item) => {
  const batch = db.batch();

  item.forEach((item) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.set(docRef, item);

    console.log(`Set ${docPath}`);
  });

  await batch.commit();
};

const deleteItemsFromFirestore = async (collectionPath: string, items) => {
  const batch = db.batch();

  items.forEach((item) => {
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.delete(docRef);

    console.log(`Delete ${docPath}`);
  });

  await batch.commit();
};

export const handleMessage: HandlerFunction = async ({ data }) => {
  const message = data
    ? JSON.parse(Buffer.from(data, "base64").toString())
    : {};

  console.log(
    `WRITE: Received message [${message.type}][${message.itemType}]: ${
      (message.items || []).length
    }`
  );

  const { type, itemType, items } = message;
  const collectionPath = COLLECTIONS[itemType];

  if (!collectionPath) {
    throw new Error(`Unrecognised itemType [${itemType}]`);
  }

  switch (type) {
    case "UPDATED":
      setItemsInFirestore(collectionPath, items);
      break;
    case "DELETED":
      deleteItemsFromFirestore(collectionPath, items);
      break;
    default:
      throw new Error(`Unrecognised message type [${type}]`);
  }
};
