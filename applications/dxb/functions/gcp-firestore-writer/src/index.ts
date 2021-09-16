import type { HandlerFunction } from "@google-cloud/functions-framework/build/src/functions";
import { config } from "dotenv";
import admin from "firebase-admin";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

// TODO: I think these should start with "/", but was easier for them not to
const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

admin.initializeApp({
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
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

    // eslint-disable-next-line no-console
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

    // eslint-disable-next-line no-console
    console.log(`Delete ${docPath}`);
  });

  await batch.commit();
};

export const handleMessage: HandlerFunction = async ({ data }) => {
  const message = data
    ? JSON.parse(Buffer.from(data, "base64").toString())
    : {};

  // eslint-disable-next-line no-console
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
      await setItemsInFirestore(collectionPath, items);
      break;
    case "DELETED":
      await deleteItemsFromFirestore(collectionPath, items);
      break;
    default:
      throw new Error(`Unrecognised message type [${type}]`);
  }
};
