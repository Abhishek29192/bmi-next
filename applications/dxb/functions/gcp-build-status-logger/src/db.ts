import { getFirestore } from "@bmi/functions-firestore";
import { BuildStatusData, ContentfulTriggeredBuildStatusData } from "./";

const {
  FIRESTORE_BUILD_STATUS_COLLECTION,
  FIRESTORE_TRIGGERED_BUILDS_COLLECTION
} = process.env;
const db = getFirestore();

const getBuildsStatusData = async (
  collectionId: string,
  mostRecentX: number
) => {
  const result = await db
    .collection(collectionId)
    .orderBy("timestamp", "desc")
    .limit(mostRecentX)
    .get();

  return result.docs.map((x) => x.data());
};

export const getList = async (
  mostRecentX: number
): Promise<FirebaseFirestore.DocumentData[]> => {
  const lastBuildTriggered = await getBuildsStatusData(
    FIRESTORE_TRIGGERED_BUILDS_COLLECTION!,
    1
  );

  const buildStatuses = await getBuildsStatusData(
    FIRESTORE_BUILD_STATUS_COLLECTION!,
    mostRecentX
  );

  return [...lastBuildTriggered, ...buildStatuses];
};

export const saveBuildStatus = async (
  eventDetails: ContentfulTriggeredBuildStatusData | BuildStatusData,
  collectionId: string
): Promise<void> => {
  const buildStatusRef = await db.collection(collectionId).add(eventDetails);

  await buildStatusRef.set(eventDetails);
};
