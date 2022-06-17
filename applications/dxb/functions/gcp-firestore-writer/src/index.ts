import logger from "@bmi-digital/functions-logger";
import { Product, System } from "@bmi/firestore-types";
import { getFirestore } from "@bmi/functions-firestore";
import {
  DeleteItemType,
  ItemType,
  ObjType
} from "@bmi/gcp-pim-message-handler";
import {
  Product as PimProduct,
  System as PimSystem,
  SystemLayer
} from "@bmi/pim-types";
import type { EventFunction } from "@google-cloud/functions-framework/build/src/functions";
import { transformProducts } from "./productTransformer";
import { transformSystems } from "./systemTransformer";

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
  updatedItem: System | Product,
  docPath: string,
  batch: FirebaseFirestore.WriteBatch
) => {
  const docRef = db.doc(docPath);
  batch.set(docRef, updatedItem);
  logger.info({
    message: `Updated by path: ${docPath}`
  });
};

const deleteDocument = (batch: FirebaseFirestore.WriteBatch, path: string) => {
  const docRef = db.doc(path);
  batch.delete(docRef);
  logger.info({
    message: `Deleted document ${path} from Firestore`
  });
};

const deleteByBaseCode = async (
  productBaseCode: string,
  batch: FirebaseFirestore.WriteBatch
) => {
  const basePath = `${FIRESTORE_ROOT_COLLECTION}/${COLLECTIONS["PRODUCTS"]}`;

  const documents = await db
    .collection(basePath)
    .where("baseCode", "==", productBaseCode)
    .get();
  documents.docs
    .filter((doc) => doc.exists)
    .forEach((doc) => batch.delete(doc.ref));
  logger.info({
    message: `Deleted all documents for base product ${productBaseCode}`
  });
};

const deleteSystemLayer = async (
  systemLayerCode: string,
  batch: FirebaseFirestore.WriteBatch
) => {
  const basePath = `${FIRESTORE_ROOT_COLLECTION}/${COLLECTIONS["SYSTEMS"]}`;

  const documents = await db
    .collection(basePath)
    .where(CODE_TYPES.LAYER_CODES, "array-contains", systemLayerCode)
    .get();

  const document = documents.docs[0]?.data();
  if (!document) {
    logger.info({
      message: `Unable to find system document to delete with layer ${systemLayerCode}`
    });
    return;
  }

  const docPath = `${basePath}/${document.code}`;
  const updatedDocumentEntities = document["systemLayers"].filter(
    (obj: SystemLayer) => obj.code !== systemLayerCode
  );

  const updatedDocument = {
    ...document,
    systemLayers: updatedDocumentEntities,
    layerCodes: updatedDocumentEntities.map((obj: SystemLayer) => obj.code)
  } as System;

  logger.info({
    message: `Removed just the system layer ${systemLayerCode} from the document.`
  });

  updateDocument(updatedDocument, docPath, batch);
};

const setItemsInFirestore = async (
  collectionPath: string,
  items: (System | Product)[]
) => {
  const batch = db.batch();

  items.forEach((item) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    updateDocument(item, docPath, batch);
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
      if (item.objType === ObjType.Variant || item.objType === ObjType.System) {
        deleteDocument(
          batch,
          `${FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`
        );
      } else if (item.objType === ObjType.Base_product) {
        await deleteByBaseCode(item.code, batch);
      } else {
        await deleteSystemLayer(item.code, batch);
      }
    })
  );

  await batch.commit();
};

export type Message =
  | {
      type: "UPDATED";
      itemType: "PRODUCTS";
      items: PimProduct[];
    }
  | {
      type: "UPDATED";
      itemType: "SYSTEMS";
      items: PimSystem[];
    }
  | {
      type: "UPDATED";
      itemType: "CATEGORIES";
      items: unknown[];
    }
  | {
      type: "DELETED";
      itemType: ItemType;
      items: DeleteItemType[];
    };

export const handleMessage: EventFunction = async ({ data }: any) => {
  const message: Message = data
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

  if (itemType === "CATEGORIES") {
    logger.error({ message: "CATEGORIES are not currently handled" });
    return;
  }

  switch (type) {
    case "UPDATED": {
      let transformedItems;
      if (itemType === "PRODUCTS") {
        transformedItems = transformProducts(items);
      } else {
        transformedItems = transformSystems(items);
      }
      await setItemsInFirestore(collectionPath, transformedItems);
      break;
    }
    case "DELETED":
      await deleteItemsFromFirestore(collectionPath, items);
      break;
    default:
      throw new Error(`Unrecognised message type [${type}]`);
  }
};
