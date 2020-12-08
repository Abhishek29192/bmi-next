import admin from "firebase-admin";

// TODO: I think these should start with "/", but was easier for them not to
const FIRESTORE_COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products"
};

admin.initializeApp({
  credential: admin.credential.cert({
    // type: "service_account",
    projectId: process.env.GCP_PROJECT_ID,
    // private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    privateKey: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL
    // client_id: process.env.FIRESTORE_CLIENT_ID,
    // auth_uri: process.env.FIRESTORE_AUTH_URI,
    // token_uri: process.env.FIRESTORE_TOKEN_URI,
    // auth_provider_x509_cert_url:
    // process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
    // client_x509_cert_url: process.env.FIRESTORE_CLIENT_X509_CERT_URL
  }),
  databaseURL: "https://dxb-development.firebaseio.com"
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

  console.log(`Deleted a batch of ${batchSize}`);

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function deleteFirestoreCollection() {
  const db = admin.firestore();
  const collectionPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${FIRESTORE_COLLECTIONS["PRODUCTS"]}`;
  const batchSize = 20;

  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}
export { deleteFirestoreCollection };
