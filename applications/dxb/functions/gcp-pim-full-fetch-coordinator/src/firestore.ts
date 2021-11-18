import admin from "firebase-admin";
import { DocumentData, Firestore, Query } from "@google-cloud/firestore";
import { info } from "./logger";

export enum FirestoreCollections {
  Categories = "root/categories",
  Products = "root/products",
  Systems = "root/systems"
}

admin.initializeApp({
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
});

async function deleteQueryBatch(db: Firestore, query: Query<DocumentData>) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  info({ message: `Deleted a batch of ${batchSize}` });

  await deleteQueryBatch(db, query);
}

export async function deleteFirestoreCollection(
  collectionPath: FirestoreCollections
) {
  const db = admin.firestore();
  const batchSize = 20;

  const collectionRef = db.collection(
    `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}`
  );
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  await deleteQueryBatch(db, query);
}
