import { initializeApp } from "firebase-admin/app";
import {
  getFirestore as getAdminFirestore,
  Firestore
} from "firebase-admin/firestore";

const { GCP_PROJECT_ID } = process.env;

let firestoreCache: Firestore;

export const getFirestore = (): Firestore => {
  if (!firestoreCache) {
    if (!GCP_PROJECT_ID) {
      throw Error("GCP_PROJECT_ID was not provided");
    }

    const app = initializeApp({
      databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
    });

    firestoreCache = getAdminFirestore(app);
  }
  return firestoreCache;
};