import { docSuffix } from "./utils.js";

export const getCsp = async (marketCode, database) => {
  const collectionName = process.env.FIRESTORE_CSP_COLLECTION || "dxb-csp";
  const collectionRef = database.collection(collectionName);

  const docName = `csp_${docSuffix(marketCode)}`;
  const docRef = collectionRef.doc(docName);
  const doc = await docRef.get();
  if (!doc) {
    throw new Error(`Content Security Policy document : ${docName} not found.`);
  }

  if (!doc.data()?.policy) {
    throw new Error(`Content Security Policy is empty for ${marketCode}.`);
  }

  return doc.data()?.policy;
};
