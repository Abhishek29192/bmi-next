import { initializeApp } from "firebase-admin/app";
import {
  Firestore,
  getFirestore as getAdminFirestore
} from "firebase-admin/firestore";

const { GCP_PROJECT_ID } = process.env;

let firestoreCache: Firestore;

/**
 * Creates a Firestore client.
 *
 * @returns {Firestore} Configured Firestore client
 * @throws {Error} GCP_PROJECT_ID must be provided
 */
export const getFirestore = (): Firestore => {
  if (!firestoreCache) {
    if (!GCP_PROJECT_ID) {
      throw Error("GCP_PROJECT_ID was not provided");
    }

    const app = initializeApp({
      databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
    });

    firestoreCache = getAdminFirestore(app);
    firestoreCache.settings({
      ignoreUndefinedProperties: true
    });
  }
  return firestoreCache;
};
