"use strict";

require("dotenv").config();

const admin = require("firebase-admin");

// TODO: I think these should start with "/", but was easier for them not to
const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products"
};

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.FIRESTORE_CLIENT_EMAIL,
    client_id: process.env.FIRESTORE_CLIENT_ID,
    auth_uri: process.env.FIRESTORE_AUTH_URI,
    token_uri: process.env.FIRESTORE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIRESTORE_CLIENT_X509_CERT_URL
  }),
  databaseURL: "https://dxb-development.firebaseio.com"
});

const db = admin.firestore();

// TODO: This is batched, functions can be consolidated
const setItemsInFirestore = async (collectionPath, item) => {
  const batch = db.batch();

  item.forEach((item) => {
    // Doing it this way to be able to set the ID, otherwise collection.add() creates ID automatically
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.set(docRef, item);

    console.log(`Set ${docPath}`);
  });

  await batch.commit();
};

const deleteItemsFromFirestore = async (collectionPath, items) => {
  const batch = db.batch();

  items.forEach((item) => {
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/${collectionPath}/${item.code}`;
    const docRef = db.doc(docPath);

    batch.delete(docRef);

    console.log(`Delete ${docPath}`);
  });

  await batch.commit();
};

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const handleMessage = async (event, context) => {
  const message = event.data
    ? JSON.parse(Buffer.from(event.data, "base64").toString())
    : {};

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
      setItemsInFirestore(collectionPath, items);
      break;
    case "DELETED":
      deleteItemsFromFirestore(collectionPath, items);
      break;
    default:
      throw new Error(`Unrecognised message type [${type}]`);
  }
};

// NOTE: GCP likes the export this way 🤷‍♂️
exports.handleMessage = handleMessage;
