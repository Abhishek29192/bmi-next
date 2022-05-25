import logger from "@bmi-digital/functions-logger";
import { VariantOption, SystemLayer } from "@bmi/pim-types";
import { getFirestore } from "@bmi/functions-firestore";
import { DeleteItemType, ObjType } from "@bmi/gcp-pim-message-handler";
import type { EventFunction } from "@google-cloud/functions-framework/build/src/functions";

const { FIRESTORE_ROOT_COLLECTION } = process.env;
const db = getFirestore();

// TODO: I think these should start with "/", but was easier for them not to
export const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

export const OBJECT_TYPES = {
  VARIANT_OPTIONS: "variantOptions",
  SYSTEM_LAYERS: "systemLayers"
};

export const CODE_TYPES = {
  VARIANT_CODES: "variantCodes",
  LAYER_CODES: "layerCodes"
};

const updateDocument = (
  updatedItem: any,
  docPath: string,
  batch: FirebaseFirestore.WriteBatch
) => {
  const docRef = db.doc(docPath);

  batch.set(docRef, updatedItem);
  logger.info({
    message: `Updated by path: ${docPath}`
  });
};

const deleteBaseEntity = (
  item: DeleteItemType,
  batch: FirebaseFirestore.WriteBatch,
  path: string
) => {
  const docRef = db.doc(path);

  if (docRef) {
    batch.delete(docRef);
    logger.info({
      message: `Deleted by path: ${path}`
    });
  } else {
    logger.info({
      message: `Deleted ${item.objType} did not found in firestore`
    });
  }
};

const deleteNestedEntity = async (
  item: DeleteItemType,
  collectionPath: string,
  batch: FirebaseFirestore.WriteBatch
) => {
  const key =
    item.objType === ObjType.Variant
      ? CODE_TYPES.VARIANT_CODES
      : CODE_TYPES.LAYER_CODES;

  const basePath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}`;

  const documents = await db
    .collection(basePath)
    .where(key, "array-contains", item.code)
    .get();

  const document = documents.docs[0]?.data();

  if (document) {
    const objType =
      item.objType === ObjType.Variant
        ? OBJECT_TYPES.VARIANT_OPTIONS
        : OBJECT_TYPES.SYSTEM_LAYERS;

    logger.info({
      message: `Deleted document data: ${JSON.stringify(document)}`
    });

    const updatedDocumentEntities = document[`${objType}`].filter(
      (obj: VariantOption | SystemLayer) => obj.code !== item.code
    );
    logger.info({
      message: `All updated document entities: ${updatedDocumentEntities}`
    });

    const docPath = `${basePath}/${document.code}`;

    logger.info({
      message: `Deleted from docPath: ${docPath}`
    });

    if (updatedDocumentEntities.length || item.objType === ObjType.Layer) {
      const updatedDocument = {
        ...document,
        [objType]: updatedDocumentEntities,
        [key]: updatedDocumentEntities.map(
          (obj: VariantOption | SystemLayer) => obj.code
        )
      };

      logger.info({
        message: `Deleted updated document data: ${JSON.stringify(
          updatedDocument
        )}`
      });

      updateDocument(updatedDocument, docPath, batch);
    } else {
      deleteBaseEntity(item, batch, docPath);
    }

    logger.info({ message: `Delete ${docPath}` });
  } else {
    logger.info({
      message: `Deleted ${item.objType} did not found in firestore`
    });
  }
};

const getUpdatedItem = (item: any, collectionPath: string) => {
  if (collectionPath === COLLECTIONS.CATEGORIES) {
    logger.info({ message: `collection path is the same as in category` });
    return item;
  } else {
    const key =
      collectionPath === COLLECTIONS.PRODUCTS
        ? CODE_TYPES.VARIANT_CODES
        : CODE_TYPES.LAYER_CODES;
    const objType =
      collectionPath === COLLECTIONS.PRODUCTS
        ? OBJECT_TYPES.VARIANT_OPTIONS
        : OBJECT_TYPES.SYSTEM_LAYERS;

    if (item[`${objType}`] && item[`${objType}`].length) {
      const updatedItem = {
        ...item,
        [key]: item[`${objType}`].map(
          (obj: VariantOption | SystemLayer) => obj.code
        )
      };
      logger.info({ message: `updatedItem with new ${key}:  ${updatedItem}` });
      return updatedItem;
    } else {
      return item;
    }
  }
};

// TODO: This is batched, functions can be consolidated
const setItemsInFirestore = async (collectionPath: string, items: any) => {
  const batch = db.batch();

  items.forEach((item: any) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const updatedItem = getUpdatedItem(item, collectionPath);

    updateDocument(updatedItem, docPath, batch);

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
      if (
        item.objType === ObjType.Base_product ||
        item.objType === ObjType.System
      ) {
        const docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
        deleteBaseEntity(item, batch, docPath);
      } else {
        deleteNestedEntity(item, collectionPath, batch);
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
