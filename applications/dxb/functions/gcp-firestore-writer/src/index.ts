import logger from "@bmi/functions-logger";
import { getFirestore } from "@bmi/functions-firestore";
import type { EventFunction } from "@google-cloud/functions-framework/build/src/functions";
import { config } from "dotenv";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

// TODO: I think these should start with "/", but was easier for them not to
const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

const db = getFirestore();

// TODO: This is batched, functions can be consolidated
const setItemsInFirestore = async (collectionPath: string, item: any) => {
  const batch = db.batch();

  item.forEach((item: any) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.set(docRef, item);

    logger.info({ message: `Set ${docPath}` });
  });

  await batch.commit();
};

const deleteItemsFromFirestore = async (collectionPath: string, items: any) => {
  const batch = db.batch();

  items.forEach((item: any) => {
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.delete(docRef);

    logger.info({ message: `Delete ${docPath}` });
  });

  await batch.commit();
};

export const handleMessage: EventFunction = async ({ data }: any) => {
  const message: { type: string; itemType: string; items: any } = data
    ? JSON.parse(Buffer.from(data, "base64").toString())
    : {};

  logger.info({
    message: `WRITE: Received message [${message.type}][${message.itemType}]: ${
      (message.items || []).length
    }`
  });

  const { type, itemType, items } = message;
  // eslint-disable-next-line security/detect-object-injection
  const collectionPath =
    itemType in COLLECTIONS &&
    COLLECTIONS[itemType as keyof typeof COLLECTIONS];

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
