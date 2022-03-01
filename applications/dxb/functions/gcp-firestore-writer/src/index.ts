import logger from "@bmi-digital/functions-logger";
import { getFirestore } from "@bmi/functions-firestore";
import { DeleteItemType, ObjType } from "@bmi/gcp-pim-message-handler";
import type { EventFunction } from "@google-cloud/functions-framework/build/src/functions";

const { FIRESTORE_ROOT_COLLECTION } = process.env;
const db = getFirestore();

// TODO: I think these should start with "/", but was easier for them not to
const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

const objectTypes = {
  VARIANT_OPTIONS: "variantOptions",
  SYSTEM_LAYERS: "systemLayers"
};

const codeTypes = {
  VARIANT_CODES: "variantCodes",
  LAYER_CODES: "layerCodes"
};

// TODO: This is batched, functions can be consolidated
const setItemsInFirestore = async (collectionPath: string, items: any) => {
  const batch = db.batch();

  items.forEach((item: any) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    if (collectionPath === COLLECTIONS.CATEGORIES) {
      batch.set(docRef, item);
    } else {
      // this update will allow us to find correct base product or system in delete method if we deleting variantOption or systemLayer
      const key =
        collectionPath === COLLECTIONS.PRODUCTS
          ? codeTypes.VARIANT_CODES
          : codeTypes.LAYER_CODES;
      const objType =
        collectionPath === COLLECTIONS.PRODUCTS
          ? objectTypes.VARIANT_OPTIONS
          : objectTypes.SYSTEM_LAYERS;

      if (item[`${objType}`] && item[`${objType}`].length) {
        const updatedItem = {
          ...item,
          [key]: item[`${objType}`].map((obj: any) => obj.code)
        };

        batch.set(docRef, updatedItem);
      } else {
        batch.set(docRef, item);
      }
    }

    logger.info({ message: `Set ${docPath}` });
  });

  await batch.commit();
};

const deleteItemsFromFirestore = async (
  collectionPath: string,
  items: DeleteItemType[]
) => {
  const batch = db.batch();

  await Promise.all(
    items.map(async (item: DeleteItemType) => {
      let docPath = "";

      if (
        item.objType === ObjType.Base_product ||
        item.objType === ObjType.System
      ) {
        docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;

        const docRef = db.doc(docPath);

        batch.delete(docRef);
      } else {
        const objType =
          item.objType === ObjType.Variant
            ? objectTypes.VARIANT_OPTIONS
            : objectTypes.SYSTEM_LAYERS;

        const key =
          item.objType === ObjType.Variant
            ? codeTypes.VARIANT_CODES
            : codeTypes.LAYER_CODES;

        const data = await db
          .collection(`${FIRESTORE_ROOT_COLLECTION}/${collectionPath}`)
          .where(key, "array-contains", item.code)
          .get();

        logger.info({
          message: `Deleted ${item.objType} data: ${JSON.stringify(data)}`
        });

        const document = data.docs[0].data();

        logger.info({
          message: `Deleted document data: ${JSON.stringify(document)}`
        });

        const updatedObjType = document[`${objType}`].filter(
          (obj: any) => obj.code !== item.code
        );

        logger.info({
          message: `Deleted updatedObjType data: ${JSON.stringify(
            updatedObjType
          )}`
        });

        docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${document.code}`;

        logger.info({
          message: `Deleted from docPath: ${docPath}`
        });

        if (updatedObjType.length) {
          const updatedDocument = {
            ...document,
            [objType]: updatedObjType,
            [key]: updatedObjType.map((obj: any) => obj.code)
          };

          logger.info({
            message: `Deleted updatedDocument data: ${JSON.stringify(
              updatedDocument
            )}`
          });

          const docRef = db.doc(docPath);

          batch.set(docRef, updatedDocument);
        } else {
          const docRef = db.doc(docPath);

          batch.delete(docRef);
        }

        logger.info({ message: `Delete ${docPath}` });
      }
    })
  );

  await batch.commit();
};

export const handleMessage: EventFunction = async ({ data }: any) => {
  const message: { type: string; itemType: string; items: any } = data
    ? JSON.parse(Buffer.from(data, "base64").toString())
    : {};

  logger.info({
    message: `handleMessage: Received message ${data}`
  });

  logger.info({
    message: `handleMessage: items ${JSON.stringify(message.items)}`
  });

  logger.info({
    message: `WRITE: Received message [${message.type}][${message.itemType}]: ${
      (message.items || []).length
    }`
  });

  const { type, itemType, items } = message;

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
