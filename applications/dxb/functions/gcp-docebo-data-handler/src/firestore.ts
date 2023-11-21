import { getFirestore } from "@bmi/functions-firestore";
import { DoceboMessageLog, MessageStatus } from "./types";

const firestore = getFirestore();

export const getMessageStatus = async (
  collectionId: string,
  messageId: string
): Promise<MessageStatus | undefined> => {
  const result = await firestore.collection(collectionId).doc(messageId).get();

  if (!result.exists) {
    return;
  }
  return result.data()?.status;
};

export const saveById = async (
  collectionId: string,
  messageDetails: DoceboMessageLog
): Promise<void> => {
  await firestore
    .collection(collectionId)
    .doc(messageDetails.id)
    .set(messageDetails);
};
