import {
  getFirestore,
  DocumentData,
  Firestore,
  Query
} from "@bmi/functions-firestore";
import logger from "@bmi/functions-logger";
import { FirestoreCollections } from "./firestore-collections";

async function deleteQueryBatch(db: Firestore, query: Query<DocumentData>) {
  let snapshot = await query.get();
  let batchSize = snapshot.size;
  while (batchSize !== 0) {
    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    logger.info({ message: `Deleted a batch of ${batchSize}` });
    snapshot = await query.get();
    batchSize = snapshot.size;
  }
}

export async function deleteFirestoreCollection(
  collectionPath: FirestoreCollections
) {
  const db = getFirestore();
  const batchSize = 20;

  const collectionRef = db.collection(
    `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}`
  );
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  await deleteQueryBatch(db, query);

  logger.info({ message: `Deleted all data for ${collectionPath}` });
}
