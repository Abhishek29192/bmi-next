import admin from "firebase-admin";

// TODO: I think these should start with "/", but was easier for them not to
const FIRESTORE_COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

admin.initializeApp({
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
});

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // eslint-disable-next-line no-console
  console.log(`Deleted a batch of ${batchSize}`);

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function deleteFirestoreCollection(collectionPath) {
  const db = admin.firestore();
  const batchSize = 20;

  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}
export { deleteFirestoreCollection, FIRESTORE_COLLECTIONS };
