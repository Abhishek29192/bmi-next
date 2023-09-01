import { getFirestore } from "@bmi/functions-firestore";
import { BuildLog } from "@bmi/firestore-types";
import { BuildStatusType } from "./types";

const firestore = getFirestore();

export const getBuildStartedEventId = async (
  collectionId: string,
  isPreviewEvent: boolean
): Promise<string | undefined> => {
  try {
    const docs = await firestore
      .collection(collectionId)
      .where(
        "eventType",
        "==",
        isPreviewEvent
          ? BuildStatusType.PREVIEW_BUILD_STARTED.toString()
          : BuildStatusType.BUILD_STARTED.toString()
      )
      .get();

    if (docs.empty) {
      return undefined;
    }

    return docs.docs[0].id;
  } catch (err) {
    return undefined;
  }
};

export const setDocumentInFirestore = async (
  docPath: string,
  document: BuildLog
) => firestore.doc(docPath).set(document);
