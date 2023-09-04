import logger from "@bmi-digital/functions-logger";
import { Product } from "@bmi/firestore-types";
import { getFirestore } from "@bmi/functions-firestore";

const db = getFirestore();

export const setItemsInFirestore = async (products: Product[]) => {
  const batch = db.batch();

  products.forEach((item) => {
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${item.code}`;
    const docRef = db.doc(docPath);
    batch.set(docRef, item);
    logger.info({ message: `Set ${docPath}` });
  });

  await batch.commit();
};
